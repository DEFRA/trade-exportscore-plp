module.exports = {
  validModel: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
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
        S: "NW total",
      },
    ],
  },
  wrongEstablishment: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: "INVALID",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: 12,
        S: 12,
      },
      {
        E: "INVALID",
        O: "Co-op Ripe And Ready To Eat Avocados 2S.",
        P: "0709601001",
        Q: 1,
        S: 1,
      },
    ],
  },
  incorrectHeader: {
    "Input Packing Sheet": [
      {
        E: "THIS",
        O: "IS",
        P: "NOT",
        Q: "VALID",
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
  invalidModel_MissingColumnCells: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
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
  emptyModel: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: null,
      },
    ],
  },
};
