const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        B: "4PK X 17 PINK LADY APPLES",
        D: "TOP FRUIT",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 20,
        L: 12.75,
        N: 255,
      },
      {
        B: "ASDA BABY WATERMELON X10",
        D: "MELON HARD",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 5,
        L: 12,
        N: 60,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        B: "4PK X 17 PINK LADY APPLES",
        D: null,
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 20,
        L: 12.75,
        N: 255,
      },
      {
        B: "ASDA BABY WATERMELON X10",
        D: "MELON HARD",
        F: null,
        H: "RMS-GB-000015-010",
        J: 5,
        L: 12,
        N: 60,
      },
    ],
  },
  emptyModel: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        H: null,
      },
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "4PK X 17 PINK LADY APPLES",
        nature_of_products: "TOP FRUIT",
        number_of_packages: 20,
        total_net_weight_kg: 255,
        type_of_treatment: "PRODUCE",
      },
      {
        commodity_code: null,
        description: "ASDA BABY WATERMELON X10",
        nature_of_products: "MELON HARD",
        number_of_packages: 5,
        total_net_weight_kg: 60,
        type_of_treatment: "PRODUCE",
      },
    ],
    registration_approval_number: "RMS-GB-000015-010",
    parserModel: ParserModel.ASDA2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "4PK X 17 PINK LADY APPLES",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 255,
        type_of_treatment: "PRODUCE",
      },
      {
        commodity_code: null,
        description: "ASDA BABY WATERMELON X10",
        nature_of_products: "MELON HARD",
        number_of_packages: 5,
        total_net_weight_kg: 60,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000015-010",
    parserModel: ParserModel.ASDA2,
  },
  emptyTestResult: {
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
    parserModel: ParserModel.ASDA2,
  },
};
