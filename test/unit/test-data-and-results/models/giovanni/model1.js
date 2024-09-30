const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    RANA: [
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "SPINACH AND RICOTTA TORT",
        G: 17,
        H: 40.8,
        E: "1902209990",
      },
      {
        C: "FOUR CHEESE TORT",
        G: 10,
        H: 24,
        E: "1902209990",
      },
    ],
  },
  validHeadersNoData: {
    RANA: [
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    RANA: [
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "SPINACH AND RICOTTA TORT",
        G: null,
        H: 40.8,
        E: "1902209990",
      },
      {
        C: "FOUR CHEESE TORT",
        G: 10,
        H: null,
        E: "1902209990",
      },
    ],
  },
  emptyModel: {
    RANA: [
      {
        A: null,
      },
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {},
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "1902209990",
        description: "SPINACH AND RICOTTA TORT",
        number_of_packages: 17,
        total_net_weight_kg: 40.8,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "1902209990",
        description: "FOUR CHEESE TORT",
        number_of_packages: 10,
        total_net_weight_kg: 24,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000153",
    parserModel: parser_model.GIOVANNI1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "1902209990",
        description: "SPINACH AND RICOTTA TORT",
        number_of_packages: null,
        total_net_weight_kg: 40.8,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "1902209990",
        description: "FOUR CHEESE TORT",
        number_of_packages: 10,
        total_net_weight_kg: null,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000153",
    parserModel: parser_model.GIOVANNI1,
  },
  incorrectEstablishmentNumber: {
    RANA: [
      {
        A: "INCORRECT",
      },
    ],
  },
  incorrectHeader: {
    RANA: [
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "CORRECT",
        H: "HEADER",
        E: "Commodity Code",
      },
    ],
  },
};
