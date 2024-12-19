module.exports = {
  validModel: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        G: "CONTIGO AUTO-POP BOTTLE 720ML",
        L: "9617000000",
        AS: "Ambient",
        AT: "Y",
        BR: 1,
        BT: 1.49,
        BU: 1.4155,
      },
      {
        G: "JOIE MEASURING SPOONS",
        L: "3924100090",
        AS: "Ambient",
        AT: "Y",
        BR: 1,
        BT: 0.84,
        BU: 0.798,
      },
      {
        BU: 0,
      },
    ],
  },
  validHeadersNoData: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        G: "CONTIGO AUTO-POP BOTTLE 720ML",
        L: "9617000000",
        AS: "Ambient",
        AT: "Y",
        BR: 1,
        BT: 1.49,
        BU: 1.4155,
      },
    ],
    Sheet2: [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        G: "JOIE MEASURING SPOONS",
        L: "3924100090",
        AS: "Ambient",
        AT: "Y",
        BR: 1,
        BT: 0.84,
        BU: 0.798,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        G: "CONTIGO AUTO-POP BOTTLE 720ML",
        L: "9617000000",
        AS: "Ambient",
        AT: "Y",
        BR: 1,
        BT: 1.49,
        BU: null,
      },
      {
        G: "JOIE MEASURING SPOONS",
        L: "3924100090",
        AS: null,
        AT: "Y",
        BR: 1,
        BT: 0.84,
        BU: 0.798,
      },
    ],
  },
  wrongEstablishment: {
    Sheet1: [
      {},
      {},
      {},
      {
        AT: "INCORRECT",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    Sheet1: [
      {},
      {},
      {},
      {
        AT: "INCORRECT",
      },
    ],
    Sheet2: [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
    ],
  },
  incorrectHeader: {
    Sheet1: [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "NOT",
        L: "CORRECT",
        AS: "HEADER",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
    ],
  },
  incorrectHeaderMultiple: {
    Sheet1: [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
    ],
    Sheet2: [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "NOT",
        L: "CORRECT",
        AS: "HEADER",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
    ],
  },
  emptyModel: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        AT: null,
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
    ],
  },
};
