const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
        H: "Net Weight (KG)",
      },
    ],
  },
  validModelMultipleSheets: {
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    "SUMMARY FOR GC 2": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    "SUMMARY FOR GC": [
      {
        A: "INVALID",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006)",
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
    "SUMMARY FOR GC": [
      {
        A: null,
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    registration_approval_number: "RMS-GB-000149-006",
    parserModel: parserModel.GIOVANNI2,
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
    registration_approval_number: "RMS-GB-000149-006",
    parserModel: parserModel.GIOVANNI2,
  },
  incorrectEstablishmentNumber: {
    "SUMMARY FOR GC": [
      {
        A: "INCORRECT",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    sheet1: [
      {
        A: "RMS-GB-000149-003",
      },
      {
        C: "DESCRIPTION",
        G: "Qauntity",
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
        G: "Qauntity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
        F: "Country of Origin",
      },
    ],
  },
  incorrectHeader: {
    "SUMMARY FOR GC": [
      {
        A: "RMS-GB-000149-006",
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
        A: "RMS-GB-000149-006",
      },
      {
        C: "DESCRIPTION",
        G: "Qauntity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
    ],
    sheet2: [
      {
        A: "RMS-GB-000149-006",
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
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
        B: "(NIRMS RMS-GB-000149-007)",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
    "SUMMARY FOR GC": [
      {
        A: "The exporter of the products covered by this document (NIRMS RMS-GB-000149-006) \
            declares that these products are intend for the Green lane and will remain \
            in Northern Ireland. ",
      },
      {
        C: "DESCRIPTION",
        F: "Country of Origin",
        G: "Qauntity",
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
