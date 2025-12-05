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
    maxRetries: 3,
    retryDelayMs: 100,
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

      const result = await getNirmsIneligibleItems();

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

      const result = await getNirmsIneligibleItems();

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

      await getNirmsIneligibleItems();

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

      const result = await getNirmsIneligibleItems();

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

      const result = await getNirmsIneligibleItems();

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

    it("should return stale cache when bearer token validation fails", async () => {
      const staleData = { items: ["stale-item1"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(staleData);

      // Mock all retry attempts - bearerTokenRequest throws on missing access_token
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: null }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: null }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: null }),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(staleData);
      expect(mdmBlobCache.getStale).toHaveBeenCalled();
      expect(logger.logInfo).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "MDM API unavailable after retries - using stale cache as fallback",
      );
    });

    it("should return null when bearer token validation fails and no stale cache", async () => {
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(null);

      // Mock all retry attempts - bearerTokenRequest throws on empty access_token
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "" }),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toBeNull();
      expect(mdmBlobCache.getStale).toHaveBeenCalled();
      // Should have logged errors during retries
      expect(logger.logError).toHaveBeenCalled();
    });

    it("should return stale cache on HTTP error when available", async () => {
      const staleData = { items: ["stale-item1", "stale-item2"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(staleData);

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({ access_token: "mock-token" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          text: jest.fn().mockResolvedValue("Service Unavailable"),
        });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(staleData);
      expect(mdmBlobCache.getStale).toHaveBeenCalled();
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Request failed - HTTP 503: Service Unavailable",
      );
      expect(logger.logInfo).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "MDM API unavailable - using stale cache as fallback",
      );
    });

    it("should return stale cache after all retries exhausted", async () => {
      const staleData = { items: ["stale-item1"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(staleData);

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

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(staleData);
      expect(mdmBlobCache.getStale).toHaveBeenCalled();
      expect(logger.logInfo).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "MDM API unavailable after retries - using stale cache as fallback",
      );
    });

    it("should handle bearer token request without access_token field", async () => {
      const staleData = { items: ["stale1"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(staleData);

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ token_type: "Bearer" }),
      });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(staleData);
      expect(logger.logError).toHaveBeenCalled();
    });

    it("should handle bearer token request that returns error string", async () => {
      const staleData = { items: ["stale1"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(staleData);

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest
          .fn()
          .mockResolvedValue({ access_token: "Error: Invalid credentials" }),
      });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(staleData);
      expect(logger.logError).toHaveBeenCalled();
    });

    it("should log error when caching fails asynchronously", async () => {
      const mockData = { items: ["item1", "item2"] };
      mdmBlobCache.get.mockResolvedValue(null);
      const cacheError = new Error("Blob storage unavailable");
      mdmBlobCache.set.mockRejectedValue(cacheError);

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

      // Wait for async cache operation to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "getNirmsIneligibleItems()",
        "Failed to cache response: Blob storage unavailable",
      );
    });

    it("should handle bearer token request failure", async () => {
      const staleData = { items: ["stale1"] };
      mdmBlobCache.get.mockResolvedValue(null);
      mdmBlobCache.getStale.mockResolvedValue(staleData);

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue("Bad Request"),
      });

      const result = await getNirmsIneligibleItems();

      expect(result).toEqual(staleData);
      expect(logger.logError).toHaveBeenCalledWith(
        filenameForLogging,
        "bearerTokenRequest()",
        expect.any(Error),
      );
    });
  });
});
