const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        description: "HAM AND CHEESE TORT",
        commodity_code: "1902209990",
        number_of_packages: "20",
        total_net_weight_kg: "48",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000149-002",
    parserModel: parser_model.GIOVANNI3,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000149-002",
    parserModel: parser_model.GIOVANNI3,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "No of packages is missing in page 1 row 1.\n",
    },
    items: [
      {
        description: "HAM AND CHEESE TORT",
        commodity_code: "1902209990",
        number_of_packages: null,
        total_net_weight_kg: "48",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000149-002",
    parserModel: parser_model.GIOVANNI3,
  },
};
