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
      // NIRMS blanket statement for CoO validation
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
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
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
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
  // CoO Validation Test Data Models - AB#591527
  validCooModel: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows
      {
        C: "SPINACH AND RICOTTA TORT",
        E: "1902209990",
        F: "IT",
        G: 17,
        H: 40.8,
      },
      {
        C: "FOUR CHEESE TORT",
        E: "1902209990",
        F: "DE",
        G: 10,
        H: 24,
      },
    ],
  },
  missingBlanketStatement: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows
      {
        C: "SPINACH AND RICOTTA TORT",
        E: "1902209990",
        F: "IT",
        G: 17,
        H: 40.8,
      },
      // No blanket statement
    ],
  },
  missingCooValues: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows with missing CoO
      {
        C: "SPINACH AND RICOTTA TORT",
        E: "1902209990",
        F: null, // Missing CoO
        G: 17,
        H: 40.8,
      },
      {
        C: "FOUR CHEESE TORT",
        E: "1902209990",
        F: "", // Empty CoO
        G: 10,
        H: 24,
      },
    ],
  },
  invalidCooFormat: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows with invalid CoO
      {
        C: "SPINACH AND RICOTTA TORT",
        E: "1902209990",
        F: "INVALID", // Invalid CoO
        G: 17,
        H: 40.8,
      },
      {
        C: "FOUR CHEESE TORT",
        E: "1902209990",
        F: "123", // Invalid CoO
        G: 10,
        H: 24,
      },
    ],
  },
  cooPlaceholderX: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows with X/x placeholders
      {
        C: "SPINACH AND RICOTTA TORT",
        E: "1902209990",
        F: "X", // Valid placeholder
        G: 17,
        H: 40.8,
      },
      {
        C: "FOUR CHEESE TORT",
        E: "1902209990",
        F: "x", // Valid placeholder
        G: 10,
        H: 24,
      },
    ],
  },
  multipleCooErrors: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows - more than 3 CoO errors
      {
        C: "ITEM 1",
        E: "1902209990",
        F: null, // Missing CoO Error 1
        G: 17,
        H: 40.8,
      },
      {
        C: "ITEM 2",
        E: "1902209990",
        F: "", // Missing CoO Error 2
        G: 10,
        H: 24,
      },
      {
        C: "ITEM 3",
        E: "1902209990",
        F: "INVALID", // Invalid CoO Error 1
        G: 15,
        H: 30,
      },
      {
        C: "ITEM 4",
        E: "1902209990",
        F: null, // Missing CoO Error 3
        G: 5,
        H: 12,
      },
      {
        C: "ITEM 5",
        E: "1902209990",
        F: "", // Missing CoO Error 4 - this will trigger "in addition to"
        G: 8,
        H: 18,
      },
      {
        C: "ITEM 6",
        E: "1902209990",
        F: null, // Missing CoO Error 5 - this will be in "in addition to"
        G: 12,
        H: 25,
      },
    ],
  },
  prohibitedItems: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Data rows with prohibited items
      {
        C: "PROHIBITED ITEM",
        E: "012", // Prohibited commodity code
        F: "PROHIBITED_ITEM_ISO", // Prohibited country
        G: 17,
        H: 40.8,
      },
    ],
  },
  prohibitedItemsWithTreatment: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {
        A: "Type of Treatment",
      },
      {
        A: "PROHIBITED_ITEM_TREATMENT",
      },
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      {
        C: "PROHIBITED ITEM WITH TREATMENT",
        E: "012", // Prohibited commodity code
        F: "PROHIBITED_ITEM_ISO", // Prohibited country
        G: 17,
        H: 40.8,
      },
    ],
  },
  prohibitedItemsMultiple: {
    RANA: [
      // NIRMS NUMBER
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000153-001" },
      // NIRMS blanket statement
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000153-001) declares that these products are intend for the Green lane and will remain in Northern Ireland.",
      },
      {},
      // Headers row
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        F: "Country of Origin",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      // Multiple prohibited items (>3)
      {
        C: "PROHIBITED ITEM 1",
        E: "012",
        F: "PROHIBITED_ITEM_ISO",
        G: 17,
        H: 40.8,
      },
      {
        C: "PROHIBITED ITEM 2",
        E: "012",
        F: "PROHIBITED_ITEM_ISO",
        G: 10,
        H: 24,
      },
      {
        C: "PROHIBITED ITEM 3",
        E: "012",
        F: "PROHIBITED_ITEM_ISO",
        G: 15,
        H: 30,
      },
      {
        C: "PROHIBITED ITEM 4",
        E: "012",
        F: "PROHIBITED_ITEM_ISO",
        G: 5,
        H: 12,
      },
    ],
  },
};
