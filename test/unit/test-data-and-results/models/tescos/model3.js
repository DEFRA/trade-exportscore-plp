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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
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
        G: "Product Description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight (KG)",
        BU: "Net Weight (KG)",
      },
    ],
  },
};
