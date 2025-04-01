const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        description: "Aero Melts Milk Bag PM135",
        commodity_code: "1806329000",
        number_of_packages: "1",
        total_net_weight_kg: "1.067",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000077-001",
    parserModel: parser_model.BOOKER1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000077-001",
    parserModel: parser_model.BOOKER1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "No of packages is missing in page 1 row 1.\n",
    },
    items: [
      {
        description: "Aero Melts Milk Bag PM135",
        commodity_code: "1806329000",
        number_of_packages: null,
        total_net_weight_kg: "1.067",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000077-001",
    parserModel: parser_model.BOOKER1,
  },
};
