const {
  getNirmsIneligibleItems,
} = require("../../../app/services/mdm-service");
const logger = require("../../../app/utilities/logger");
const config = require("../../../app/config");
const mdmBlobCache = require("../../../app/services/cache/mdm-blob-cache-service");
const path = require("node:path");

jest.mock("../../../app/utilities/logger");
jest.mock("../../../app/services/cache/mdm-blob-cache-service");
jest.mock("../../../app/config", () => ({
  mdmConfig: {
    apiUrl: "https://test-api.example.com",
    subscriptionKey: "test-subscription-key",
    bearerTokenRequest: {
      url: "https://test-auth.example.com/token",
      tenant: "test-tenant.onmicrosoft.com",
      scope: "api://test-app/.default",
      grantType: "client_credentials",
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    },
  },
}));

const filenameForLogging = path.join("app", "services", "mdm-service.js");

describe("mdm-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // Default: cache returns null (cache miss)
    mdmBlobCache.get.mockResolvedValue(null);
    mdmBlobCache.set.mockResolvedValue(undefined);
  });

  afterEach(() => {
    delete global.fetch;
  });

  describe("getNirmsIneligibleItems", () => {
    it("should successfully retrieve NIRMS data on first attempt", async () => {
      const mockData = { items: ["item1", "item2"] };
      // Mock bearer token request
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token-123" }),
        })
        // Mock API data request
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockData),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        "https://test-api.example.com/trade/nirms/ineligible-items",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer mock-token-123",
            "Ocp-Apim-Subscription-Key": "test-subscription-key",
            "Content-Type": "application/json",
          },
        },
      );
    });

    it("should log info when successful after retries", async () => {
      const mockData = { items: ["item1"] };
      global.fetch
        .mockRejectedValueOnce(new Error("Network error"))
        // Second attempt: bearer token
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token-123" }),
        })
        // Second attempt: API data
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockData),
        });

      const result = await getNirmsIneligibleItems(3, 100);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(logger.logInfo).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Successfully retrieved NIRMS data after 2 attempts",
      );
    });

    it("should return null and log error on HTTP error response", async () => {
      global.fetch
        // Mock bearer token
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token-123" }),
        })
        // Mock error response
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          text: jest.fn().mockResolvedValue("Not Found"),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Request failed - HTTP 404: Not Found",
      );
    });

    it("should retry on network errors up to maxRetries", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Network error"));

      const result = await getNirmsIneligibleItems(3, 100);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledTimes(6);
      expect(logger.logError).toHaveBeenCalledTimes(3);
    });

    it("should log retry attempts correctly", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Network error"));

      await getNirmsIneligibleItems(3, 100);

      // Note: bearerTokenRequest succeeds, then API call fails, so check the API errors
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Attempt 1 failed with error: Network error, retrying in 100ms",
      );
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Attempt 2 failed with error: Network error, retrying in 100ms",
      );
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Final attempt failed with error: Network error",
      );
    });

    it("should succeed on second attempt after one failure", async () => {
      const mockData = { items: ["item1", "item2", "item3"] };
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockRejectedValueOnce(new Error("Timeout"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockData),
        });

      const result = await getNirmsIneligibleItems(3, 100);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(4);
      expect(logger.logError).toHaveBeenCalledTimes(1);
      expect(logger.logInfo).toHaveBeenCalledTimes(1);
    });

    it("should handle 401 unauthorized error", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: jest.fn().mockResolvedValue("Unauthorized"),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toBeNull();
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Request failed - HTTP 401: Unauthorized",
      );
    });

    it("should handle 500 server error", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: jest.fn().mockResolvedValue("Internal Server Error"),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toBeNull();
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Request failed - HTTP 500: Internal Server Error",
      );
    });

    it("should use custom retry parameters", async () => {
      const mockData = { data: "test" };
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockData),
        });

      const result = await getNirmsIneligibleItems(5, 500);

      expect(result).toEqual(mockData);
    });

    it("should return cached data when available", async () => {
      const cachedData = { items: ["cached-item1", "cached-item2"] };
      mdmBlobCache.get.mockResolvedValue(cachedData);

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(cachedData);
      expect(mdmBlobCache.get).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(logger.logInfo).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Returning cached NIRMS data",
      );
    });

    it("should fetch from API and cache on cache miss", async () => {
      const mockData = { items: ["item1", "item2"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.set.mockResolvedValue(undefined);

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockData),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(mockData);
      expect(mdmBlobCache.get).toHaveBeenCalled();
      expect(mdmBlobCache.set).toHaveBeenCalledWith(mockData);
    });

    it("should continue on cache write failure", async () => {
      const mockData = { items: ["item1", "item2"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.set.mockRejectedValue(new Error("Cache write failed"));

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockData),
        });

      const result = await getNirmsIneligibleItems();

      // Should still return data despite cache write failure
      expect(result).toEqual(mockData);
      expect(mdmBlobCache.set).toHaveBeenCalledWith(mockData);
    });
  });
});
