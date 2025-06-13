module.exports = {
  validModel: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: 12,
        S: 12,
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Ripe And Ready To Eat Avocados 2S.",
        P: "0709601001",
        Q: 1,
        S: 1,
      },
    ],
  },
  validHeadersNoData: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: 12,
        S: 12,
      },
    ],
    sheet2: [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Whole Cucumber Each #",
        P: "0707000599",
        Q: 10,
        S: 58.8,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: null,
        S: 12,
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Ripe And Ready To Eat Avocados 2S.",
        P: null,
        Q: 1,
        S: 1,
      },
    ],
  },
  wrongEstablishmentMultiple: {
    sheet1: [
      {},
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
      },
    ],
    sheet2: [
      {},
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package KG",
        S: "NW total",
      },
      {
        E: "INCORRECT",
      },
    ],
  },
  wrongEstablishment: {
    sheet2: [
      {},
      {},
      {
        E: "INCORRECT",
      },
    ],
  },
  incorrectHeader: {
    sheet1: [
      {
        E: "NOT",
        L: "CORRECT",
        P: "HEADER",
        O: "Product/ Part Number description",
      },
      {
        E: "RMS-GB-000009-001",
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
      {
        E: "Dispatch RMS Establishment",
        L: "Product Type/ Category",
        P: "Tariff Code EU",
        O: "Product/ Part Number description",
      },
      {
        E: "RMS-GB-000009-001",
      },
    ],
    sheet2: [
      {
        E: "NOT",
        L: "CORRECT",
        P: "HEADER",
        O: "Product/ Part Number description",
      },
      {
        E: "RMS-GB-000009-001",
      },
    ],
  },
  emptyModel: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        R: "Net Weight/Package",
        S: "NW total",
      },
      {
        E: null,
      },
    ],
  },
};
