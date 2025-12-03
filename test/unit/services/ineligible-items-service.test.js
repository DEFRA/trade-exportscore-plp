const {
  getIneligibleItems,
  getLocalIneligibleItems,
} = require("../../../app/services/ineligible-items-service");
const config = require("../../../app/config");
const logger = require("../../../app/utilities/logger");
const mdmService = require("../../../app/services/mdm-service");

jest.mock("../../../app/utilities/logger");
jest.mock("../../../app/services/mdm-service");
jest.mock("../../../app/config", () => ({
  mdmConfig: {
    useLocalData: false,
  },
}));

// Mock the local data file
jest.mock(
  "../../../app/services/data/data-prohibited-items.json",
  () => [
    {
      country_of_origin: "BR",
      commodity_code: "0207",
      type_of_treatment: null,
    },
    {
      country_of_origin: "UA",
      commodity_code: "0207",
      type_of_treatment: null,
    },
  ],
  { virtual: false },
);

describe("ineligible-items-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLocalIneligibleItems", () => {
    it("should return local ineligible items data", () => {
      const result = getLocalIneligibleItems();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("country_of_origin");
      expect(result[0]).toHaveProperty("commodity_code");
    });
  });

  describe("getIneligibleItems", () => {
    it("should return local data when MDM_USE_LOCAL_DATA is true", async () => {
      config.mdmConfig.useLocalData = true;

      const result = await getIneligibleItems();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mdmService.getNirmsIneligibleItems).not.toHaveBeenCalled();
      expect(logger.logInfo).toHaveBeenCalledWith(
        expect.any(String),
        "getIneligibleItems()",
        "Using local ineligible items data (MDM_USE_LOCAL_DATA=true)",
      );
    });

    it("should fetch from MDM API when MDM_USE_LOCAL_DATA is false", async () => {
      config.mdmConfig.useLocalData = false;
      const mockApiData = [
        {
          country_of_origin: "CN",
          commodity_code: "07061000",
          type_of_treatment: "Chilled",
        },
      ];
      mdmService.getNirmsIneligibleItems.mockResolvedValue(mockApiData);

      const result = await getIneligibleItems();

      expect(result).toEqual(mockApiData);
      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalled();
      expect(logger.logInfo).toHaveBeenCalledWith(
        expect.any(String),
        "getIneligibleItems()",
        "Fetching ineligible items from MDM API",
      );
    });

    it("should throw error when MDM API returns null", async () => {
      config.mdmConfig.useLocalData = false;
      mdmService.getNirmsIneligibleItems.mockResolvedValue(null);

      await expect(getIneligibleItems()).rejects.toThrow(
        "Failed to retrieve ineligible items - MDM API unavailable and no cache available",
      );

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalled();
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "getIneligibleItems()",
        "Failed to retrieve ineligible items - MDM API unavailable and no cache available",
      );
    });

    it("should throw error when MDM API throws error", async () => {
      config.mdmConfig.useLocalData = false;
      mdmService.getNirmsIneligibleItems.mockRejectedValue(
        new Error("Network error"),
      );

      await expect(getIneligibleItems()).rejects.toThrow("Network error");

      expect(mdmService.getNirmsIneligibleItems).toHaveBeenCalled();
      expect(logger.logError).toHaveBeenCalledWith(
        expect.any(String),
        "getIneligibleItems()",
        "Error fetching from MDM API: Network error",
      );
    });

    it("should handle MDM API success and return data", async () => {
      config.mdmConfig.useLocalData = false;
      const mockApiData = [
        {
          country_of_origin: "TR",
          commodity_code: "03028410",
          type_of_treatment: null,
        },
        {
          country_of_origin: "CN",
          commodity_code: "07061000",
          type_of_treatment: "Fresh",
        },
      ];
      mdmService.getNirmsIneligibleItems.mockResolvedValue(mockApiData);

      const result = await getIneligibleItems();

      expect(result).toEqual(mockApiData);
      expect(result.length).toBe(2);
      expect(result[0].country_of_origin).toBe("TR");
      expect(result[1].commodity_code).toBe("07061000");
    });
  });
});
