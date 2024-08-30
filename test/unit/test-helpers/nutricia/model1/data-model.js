const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    DANONE: [
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
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000133" },
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
        C: "ACTIVIA DRK FRTS 6X8X115",
        E: "403209300",
        G: 2,
        H: 11.04,
      },
      {
        C: "ACT 00  YE&RD FRU 6X8X115",
        E: "403209100",
        G: 5,
        H: 27.6,
      },
    ],
  },
  invalidModel_IncorrectEstablishmentNumber: {
    DANONE: [
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
      { A: "NIRMS NUMBER" },
      { A: "INCORRECT" },
    ],
  },
  invalidModel_IncorrectHeaders: {
    DANONE: [
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
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000133" },
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
    DANONE: [
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
      { A: "NIRMS NUMBER" },
      { A: "RMS-GB-000133" },
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
        C: "ACTIVIA DRK FRTS 6X8X115",
        E: null,
        G: 2,
        H: 11.04,
      },
      {
        C: "ACT 00  YE&RD FRU 6X8X115",
        E: "403209100",
        G: 5,
        H: null,
      },
    ],
  },
  emptyModel: {
    DANONE: [
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
        commodity_code: "403209300",
        description: "ACTIVIA DRK FRTS 6X8X115",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 11.04,
        type_of_treatment: null,
      },
      {
        commodity_code: "403209100",
        description: "ACT 00  YE&RD FRU 6X8X115",
        nature_of_products: null,
        number_of_packages: 5,
        total_net_weight_kg: 27.6,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000133",
    parserModel: ParserModel.NUTRICIA1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "ACTIVIA DRK FRTS 6X8X115",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 11.04,
        type_of_treatment: null,
      },
      {
        commodity_code: "403209100",
        description: "ACT 00  YE&RD FRU 6X8X115",
        nature_of_products: null,
        number_of_packages: 5,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000133",
    parserModel: ParserModel.NUTRICIA1,
  },
};