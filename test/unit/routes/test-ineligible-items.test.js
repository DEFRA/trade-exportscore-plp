/**
 * Unit tests for test-ineligible-items route
 *
 * Tests the MDM connection test endpoint that verifies connectivity
 * to the Master Data Management API by fetching NIRMS ineligible items.
 */

const testIneligibleItemsRoute = require("../../../app/routes/test-ineligible-items");
const mdmService = require("../../../app/services/mdm-service");
const logger = require("../../../app/utilities/logger");
const { StatusCodes } = require("http-status-codes");

jest.mock("../../../app/services/mdm-service");
jest.mock("../../../app/utilities/logger");

describe("test-ineligible-items route", () => {
  let mockH;

  beforeEach(() => {
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("route configuration", () => {
    test("should have correct method", () => {
      expect(testIneligibleItemsRoute.method).toBe("GET");
    });

    test("should have correct path", () => {
      expect(testIneligibleItemsRoute.path).toBe("/test-ineligible-items");
    });

    test("should have handler in options", () => {
      expect(testIneligibleItemsRoute.options.handler).toBeDefined();
      expect(typeof testIneligibleItemsRoute.options.handler).toBe("function");
    });
  });

  describe("handler - successful data retrieval", () => {
    test("should return 200 with NIRMS data when successfully retrieved", async () => {
      const mockNirmsData = {
        items: [
          { commodity: "COMMODITY_1", description: "Test Item 1" },
          { commodity: "COMMODITY_2", description: "Test Item 2" },
        ],
      };

      mdmService.getNirmsIneligibleItems.mockResolvedValue(mockNirmsData);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logInfo).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        "Successfully retrieved NIRMS data from MDM API",
      );
      expect(mockH.response).toHaveBeenCalledWith(mockNirmsData);
      expect(mockH.code).toHaveBeenCalledWith(StatusCodes.OK);
    });

    test("should return 200 with empty array when data is empty", async () => {
      const mockNirmsData = { items: [] };

      mdmService.getNirmsIneligibleItems.mockResolvedValue(mockNirmsData);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logInfo).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        "Successfully retrieved NIRMS data from MDM API",
      );
      expect(mockH.response).toHaveBeenCalledWith(mockNirmsData);
      expect(mockH.code).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });

  describe("handler - null/undefined data", () => {
    test("should return 503 when NIRMS data is null", async () => {
      mdmService.getNirmsIneligibleItems.mockResolvedValue(null);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        "Failed to retrieve NIRMS data from MDM API",
      );
      expect(mockH.response).toHaveBeenCalledWith({
        error: "Failed to retrieve NIRMS data",
      });
      expect(mockH.code).toHaveBeenCalledWith(StatusCodes.SERVICE_UNAVAILABLE);
    });

    test("should return 503 when NIRMS data is undefined", async () => {
      mdmService.getNirmsIneligibleItems.mockResolvedValue(undefined);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        "Failed to retrieve NIRMS data from MDM API",
      );
      expect(mockH.response).toHaveBeenCalledWith({
        error: "Failed to retrieve NIRMS data",
      });
      expect(mockH.code).toHaveBeenCalledWith(StatusCodes.SERVICE_UNAVAILABLE);
    });
  });

  describe("handler - error handling", () => {
    test("should return 500 when mdm-service throws an error", async () => {
      const mockError = new Error("Network connection failed");
      mdmService.getNirmsIneligibleItems.mockRejectedValue(mockError);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        mockError,
      );
      expect(mockH.response).toHaveBeenCalledWith(mockError.message);
      expect(mockH.code).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });

    test("should return 500 when mdm-service throws error without message", async () => {
      const mockError = new Error();
      mdmService.getNirmsIneligibleItems.mockRejectedValue(mockError);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        mockError,
      );
      expect(mockH.response).toHaveBeenCalledWith("");
      expect(mockH.code).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });

    test("should return 500 when mdm-service rejects with string error", async () => {
      const mockError = new Error("API timeout");
      mdmService.getNirmsIneligibleItems.mockRejectedValue(mockError);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalledTimes(1);
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "get()",
        mockError,
      );
      expect(mockH.response).toHaveBeenCalledWith("API timeout");
      expect(mockH.code).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe("logging behavior", () => {
    test("should log with correct filename format", async () => {
      const mockNirmsData = { items: [] };
      mdmService.getNirmsIneligibleItems.mockResolvedValue(mockNirmsData);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(logger.logInfo).toHaveBeenCalledWith(
        expect.stringContaining("routes"),
        expect.any(String),
        expect.any(String),
      );
    });

    test("should log error with correct filename format", async () => {
      mdmService.getNirmsIneligibleItems.mockResolvedValue(null);

      await testIneligibleItemsRoute.options.handler({}, mockH);

      expect(logger.logError).toHaveBeenCalledWith(
        expect.stringContaining("routes"),
        expect.any(String),
        expect.any(String),
      );
    });
  });
});
