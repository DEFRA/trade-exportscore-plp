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
  validModelMultipleSheets: {
    Sheet1: [
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
    ],
    Sheet2: [
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
  wrongEstablishmentMultiple: {
    Sheet1: [
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
    ],
    Sheet2: [
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
  incorrectHeaderMultiple: {
    Sheet1: [
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
        G: "Quantity",
        H: "Net Weight (KG)",
      },
    ],
    Sheet2: [
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
        C: "NOT",
        G: "CORRECT",
        H: "HEADER",
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
};
