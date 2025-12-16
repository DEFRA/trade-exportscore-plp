// Set environment variable to use local data for ineligible items
process.env.MDM_USE_LOCAL_DATA = "true";

// Mock ineligible-items-service to always use local data in parser-service tests
jest.mock("../../../../app/services/ineligible-items-service", () => {
  const localData = require("../../../../app/services/data/data-ineligible-items.json");
  return {
    getIneligibleItems: jest.fn().mockResolvedValue(localData),
    getLocalIneligibleItems: jest.fn().mockReturnValue(localData),
  };
});

// Mock iso-codes-service to always use local data in parser-service tests
jest.mock("../../../../app/services/iso-codes-service", () => {
  const localData = require("../../../../app/services/data/data-iso-codes.json");
  return {
    getIsoCodes: jest.fn().mockResolvedValue(localData),
    getLocalIsoCodes: jest.fn().mockReturnValue(localData),
  };
});
