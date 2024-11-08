const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    Sheet1: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "RMS-GB-000213-001",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {
        C: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        D: 8,
        E: 24,
        G: "21032000",
      },
      {
        C: "BEN Mexican 6*220g GB",
        D: 336,
        E: 443.52,
        G: "19049010",
      },
    ],
  },
  validHeadersNoData: {
    Sheet1: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "RMS-GB-000213-001",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "RMS-GB-000213-001",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {
        C: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        D: 8,
        E: 24,
        G: "21032000",
      },
      {
        C: "BEN Mexican 6*220g GB",
        D: 336,
        E: 443.52,
        G: "19049010",
      },
    ],
    Sheet2: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "RMS-GB-000213-001",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {
        C: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        D: 8,
        E: 24,
        G: "21032000",
      },
      {
        C: "BEN Mexican 6*220g GB",
        D: 336,
        E: 443.52,
        G: "19049010",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Sheet1: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "RMS-GB-000213-001",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {
        C: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        D: null,
        E: 24,
        G: "21032000",
      },
      {
        C: "BEN Mexican 6*220g GB",
        D: 336,
        E: null,
        G: "19049010",
      },
    ],
  },
  incorrectEstablishmentNumber: {
    Sheet1: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "INVALID",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {
        C: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        D: 8,
        E: 24,
        G: "21032000",
      },
      {
        C: "BEN Mexican 6*220g GB",
        D: 336,
        E: 443.52,
        G: "19049010",
      },
    ],
  },
  incorrectHeader: {
    Sheet1: [
      {
        A: "Despatch Location : ",
      },
      {
        A: "RMS-GB-000213-001",
      },
      {
        C: "INVALID",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {
        C: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        D: 8,
        E: 24,
        G: "21032000",
      },
      {
        C: "BEN Mexican 6*220g GB",
        D: 336,
        E: 443.52,
        G: "19049010",
      },
    ],
  },
  emptyModel: {
    Sheet1: [
      {
        A: null,
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
      {},
    ],
  },
  wrongEstablishmentMultiple: {
    Sheet1: [
      {
        A: "RMS-GB-000213",
      },
    ],
    Sheet2: [
      {
        A: "INCORRECT",
      },
    ],
  },
  incorrectHeaderMultiple: {
    Sheet1: [
      {
        A: "RMS-GB-000213",
      },
      {
        C: "Description",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
    ],
    Sheet2: [
      {
        A: "RMS-GB-000213",
      },
      {
        C: "Invalid",
        D: "Case Qty",
        E: "Weight",
        G: "Commodity Code",
      },
    ],
  },
};
