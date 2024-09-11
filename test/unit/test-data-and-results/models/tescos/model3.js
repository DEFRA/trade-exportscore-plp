const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        E: "RMS-GB-000022-999",
      },
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        A: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        B: "4015900000",
        C: "AMBIENT",
        D: "Y",
        E: 1,
        F: 0.46,
        G: 0.437,
      },
      {
        A: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        B: "0401401090",
        C: "AMBIENT",
        D: "Y",
        E: 2,
        F: 5.68,
        G: 5.396,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        E: "RMS-GB-000022-999",
      },
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        A: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        B: "4015900000",
        C: null,
        D: "Y",
        E: 1,
        F: 0.46,
        G: 0.437,
      },
      {
        A: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        B: "0401401090",
        C: "AMBIENT",
        D: "Y",
        E: 2,
        F: 5.68,
        G: null,
      },
    ],
  },
  emptyModel: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {},
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        E: null,
      },
    ],
  },
};
