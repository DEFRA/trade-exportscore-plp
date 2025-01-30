const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        description: "SB* 220M CAPPUCI CHILLED CUP",
        commodity_code: "2202999990",
        nature_of_products: null,
        number_of_packages: 10,
        total_net_weight_kg: 2.3275,
        type_of_treatment: "Chilled",
      },
    ],
    registration_approval_number: "RMS-GB-000008-001",
    parserModel: parser_model.MANDS1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000008-001",
    parserModel: parser_model.MANDS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Identifier is missing in page 1 row 1.\n",
    },
    items: [
      {
        description: "SB* 220M CAPPUCI CHILLED CUP",
        commodity_code: null,
        nature_of_products: null,
        number_of_packages: 10,
        total_net_weight_kg: 2.3275,
        type_of_treatment: "Chilled",
      },
    ],
    registration_approval_number: "RMS-GB-000008-001",
    parserModel: parser_model.MANDS1,
  },
};
