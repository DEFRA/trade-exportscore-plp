const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    KEPAK: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { A: "RMS-GB-000280" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      {
        C: "RS DOUBLE DECKER STD",
        E: "1602509590",
        G: 32,
        H: 30.336,
      },
      {
        C: "RS BBQ RIB STD 8X157G",
        E: "1602493000",
        G: 22,
        H: 27.632,
      },
    ],
  },
  invalidModel_IncorrectEstablishmentNumber: {
    KEPAK: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, { A: "INCORRECT" }],
  },
  invalidModel_IncorrectHeaders: {
    KEPAK: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { A: "RMS-GB-000280" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    KEPAK: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { A: "RMS-GB-000280" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      {
        C: "RS DOUBLE DECKER STD",
        E: "1602509590",
        G: null,
        H: 30.336,
      },
      {
        C: null,
        E: "1602493000",
        G: 22,
        H: 27.632,
      },
    ],
  },
  emptyModel: {
    KEPAK: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "DESCRIPTION",
        E: "Commodity Code",
        G: "Quantity",
        H: "Net Weight (KG)",
      },
      {
        C: null,
      },
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "1602509590",
        description: "RS DOUBLE DECKER STD",
        nature_of_products: null,
        number_of_packages: 32,
        total_net_weight_kg: 30.336,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602493000",
        description: "RS BBQ RIB STD 8X157G",
        nature_of_products: null,
        number_of_packages: 22,
        total_net_weight_kg: 27.632,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: ParserModel.KEPAK1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "1602509590",
        description: "RS DOUBLE DECKER STD",
        nature_of_products: null,
        number_of_packages: null,
        total_net_weight_kg: 30.336,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602493000",
        description: null,
        nature_of_products: null,
        number_of_packages: 22,
        total_net_weight_kg: 27.632,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: ParserModel.KEPAK1,
  },
};