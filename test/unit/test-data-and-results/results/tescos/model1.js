const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: "1.4155",
        type_of_treatment: "Ambient",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: "0.798",
        type_of_treatment: "Ambient",
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: ParserModel.TESCO1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: null,
        type_of_treatment: "Ambient",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: "0.798",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: ParserModel.TESCO1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [],
    registration_approval_number: null,
    parserModel: ParserModel.TESCO1,
  },
};
