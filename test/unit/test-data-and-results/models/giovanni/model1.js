const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    RANA: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "SPINACH AND RICOTTA TORT",
        F: "IT",
        G: 17,
        H: 40.8,
        E: "1902209990",
      },
      {
        C: "FOUR CHEESE TORT",
        F: "IT",
        G: 10,
        H: 24,
        E: "1902209990",
      },
    ],
  },
  validHeadersNoData: {
    RANA: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
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
  validModelMultipleSheets: {
    Sheet1: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "RANA CHICKEN&BACON TORT",
        F: "IT",
        G: 21,
        H: 31.5,
        E: "1902209990",
      },
    ],
    Sheet2: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "RANA HAM&CHEESE TORT",
        F: "IT",
        G: 10,
        H: 15,
        E: "1902209990",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    RANA: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "SPINACH AND RICOTTA TORT",
        F: "IT",
        G: null,
        H: 40.8,
        E: "1902209990",
      },
      {
        C: "FOUR CHEESE TORT",
        F: "IT",
        G: 10,
        H: null,
        E: "1902209990",
      },
    ],
  },
  incorrectEstablishmentNumber: {
    RANA: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "INVALID",
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
  incorrectHeader: {
    RANA: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "INVALID",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "INVALID",
        G: "INVALID",
        H: "INVALID",
        E: "INVALID",
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
  emptyModel: {
    RANA: [
      {
        A: null,
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
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
    parserModel: parserModel.GIOVANNI1,
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
    parserModel: parserModel.GIOVANNI1,
  },
  incorrectEstablishmentNumber: {
    RANA: [
      {
        A: "INCORRECT",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    sheet1: [
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
        F: "Country of Origin",
      },
    ],
    sheet2: [
      {
        A: "INCORRECT",
      },
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
        F: "Country of Origin",
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
        G: "INCORRECT",
        H: "HEADER",
        E: "Commodity Code",
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
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
    sheet2: [
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "INCORRECT",
        H: "HEADER",
        E: "Commodity Code",
      },
    ],
  },
  multipleRms: {
    RANA: [
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
        B: "RMS-GB-000153-001",
        C: "RMS-GB-000153-002",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
      {
        C: "SPINACH AND RICOTTA TORT",
        F: "IT",
        G: 17,
        H: 40.8,
        E: "1902209990",
      },
      {
        C: "FOUR CHEESE TORT",
        F: "IT",
        G: 10,
        H: 24,
        E: "1902209990",
      },
    ],
  },
  missingKgunit: {
    RANA: [
      {
        I: "NIRMS NUMBER",
      },
      {
        I: "RMS-GB-000149-005",
      },
      {
        A: "NIRMS NUMBER",
      },
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight",
        E: "Commodity Code",
      },
      {
        C: "SPINACH AND RICOTTA TORT",
        F: "IT",
        G: 17,
        H: 40.8,
        E: "1902209990",
      },
      {
        C: "FOUR CHEESE TORT",
        F: "IT",
        G: 10,
        H: 24,
        E: "1902209990",
      },
    ],
  },
};
