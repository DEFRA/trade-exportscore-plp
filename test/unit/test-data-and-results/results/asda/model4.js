const parserModel = require("../../../../../app/services/parser-model");

const validTestResult = {
  business_checks: {
    all_required_fields_present: true,
    failure_reasons: null,
  },
  items: [
    {
      commodity_code: "1234567890",
      description: "Test Product 1",
      nature_of_products: "Fresh",
      type_of_treatment: "Chilled",
      number_of_packages: "10",
      total_net_weight_kg: "5.5",
      country_of_origin: "GB",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 4,
        sheetName: "CSV",
      },
    },
    {
      commodity_code: "9876543210",
      description: "Test Product 2",
      nature_of_products: "Processed",
      type_of_treatment: "Ambient",
      number_of_packages: "20",
      total_net_weight_kg: "12.3",
      country_of_origin: "FR",
      nirms: "NON-NIRMS",
      row_location: {
        rowNumber: 5,
        sheetName: "CSV",
      },
    },
  ],
  registration_approval_number: "RMS-GB-000015-001",
  parserModel: parserModel.ASDA4,
};

const invalidTestResult_MissingCells = {
  business_checks: {
    all_required_fields_present: false,
    failure_reasons: expect.stringContaining("Product description is missing"),
  },
  items: expect.any(Array),
  registration_approval_number: "RMS-GB-000015-001",
  parserModel: parserModel.ASDA4,
};

const invalidTestResult_MultipleRms = {
  business_checks: {
    all_required_fields_present: false,
    failure_reasons: expect.stringContaining("Multiple GB Place of Dispatch"),
  },
  items: expect.any(Array),
  registration_approval_number: expect.any(String),
  parserModel: parserModel.ASDA4,
};

module.exports = {
  validTestResult,
  invalidTestResult_MissingCells,
  invalidTestResult_MultipleRms,
};
