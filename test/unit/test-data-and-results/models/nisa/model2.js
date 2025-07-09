module.exports = {
  validModel: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: "0403209300",
        G: 1,
        I: 2,
      },
    ],
  },
  validModelWithTotals: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: "0403209300",
        G: 1,
        I: 2,
      },
      {
        G: 3,
        I: 4.5,
      },
    ],
  },
  validHeadersNoData: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "500 - VEGETABLES - F",
        E: "GREEN ISLE BATTERED ONION RING",
        F: "2004909880",
        G: 9,
        I: 63,
      },
    ],
    Sheet2: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "515 - F/P POTATOES - F",
        E: "MCCAIN READY BAKED JACKETS 4PK",
        F: "2004109900",
        G: 28,
        I: 176.4,
      },
    ],
  },
  wrongEstablishment: {
    Sheet1: [
      {},
      {
        A: "INCORRECT",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    Sheet1: [
      {},
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
    ],
    Sheet2: [
      {},
      {
        A: "INCORRECT",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
    ],
  },
  incorrectHeader: {
    sheet1: [
      {
        C: "NOT",
        F: "CORRECT",
        H: "NET WEIGHT PACKAGE KG",
        I: "HEADER",
      },
      {
        A: "RMS-GB-000025-003",
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
      {
        C: "PRODUCT TYPE CATEGORY",
        F: "TARIFF CODE EU",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        A: "RMS-GB-000025-003",
      },
    ],
    Sheet2: [
      {
        C: "NOT",
        F: "CORRECT",
        H: "NET WEIGHT PACKAGE KG",
        I: "HEADER",
      },
      {
        A: "RMS-GB-000025-003",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: null,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: null,
        G: 1,
        I: 2,
      },
    ],
  },
  emptyModel: {
    sheet: [
      {},
      {},
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
    ],
  },
  multipleRms: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
        B: "RMS-GB-000025-004",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE KG",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: "0403209300",
        G: 1,
        I: 2,
      },
    ],
  },
  missingKgunit: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        H: "NET WEIGHT PACKAGE",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: "0403209300",
        G: 1,
        I: 2,
      },
    ],
  },
};
