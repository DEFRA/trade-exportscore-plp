const ParserModel = require("../../../../../app/services/parser-model");
const { emptyModelResult } = require("../nutricia/model1");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "4015900000",
        description: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.437,
        type_of_treatment: "AMBIENT",
      },
      {
        commodity_code: "0401401090",
        description: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 5.396,
        type_of_treatment: "AMBIENT",
      },
    ],
    registration_approval_number: "RMS-GB-000022-999",
    parserModel: ParserModel.TESCO3,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "4015900000",
        description: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.437,
        type_of_treatment: null,
      },
      {
        commodity_code: "0401401090",
        description: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: null,
        type_of_treatment: "AMBIENT",
      },
    ],
    registration_approval_number: "RMS-GB-000022-999",
    parserModel: ParserModel.TESCO3,
  },
  emptyModelResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: null,
        nature_of_products: null,
        number_of_packages: null,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: null,
    parserModel: ParserModel.TESCO3,
  },
};
