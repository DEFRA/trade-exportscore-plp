const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    registration_approval_number: "RMS-GB-000247-001",
    items: [
      {
        description: "CARESS MASSAGE SPONGE 3 PACK",
        nature_of_products: null,
        type_of_treatment: null,
        commodity_code: 3924900090,
        number_of_packages: 1,
        total_net_weight_kg: 0.3,
      },
      {
        description: "PEPSI MAX 500ML.",
        nature_of_products: null,
        type_of_treatment: null,
        commodity_code: 3004900000,
        number_of_packages: 2,
        total_net_weight_kg: 6.4,
      },
      {
        description: "DRI-PAK SODA CRYSTALS 1KG.",
        nature_of_products: null,
        type_of_treatment: null,
        commodity_code: 3306900000,
        number_of_packages: 2,
        total_net_weight_kg: 12.16,
      },
    ],
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    parserModel: parserModel.SAVERS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Product description is missing in row 6.\n",
    },
    items: [
      {
        description: null,
        commodity_code: 3924900090,
        number_of_packages: 1,
        total_net_weight_kg: 0.3,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000247-001",
    parserModel: parserModel.SAVERS1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000247-001",
    parserModel: parserModel.SAVERS1,
  },
  failedTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000247-001",
    parserModel: parserModel.SAVERS1,
  },
};
