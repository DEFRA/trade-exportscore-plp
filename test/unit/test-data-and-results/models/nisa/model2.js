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
  wrongEstablishment: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "INVALID",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
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
        I: "NET WEIGHT TOTAL",
      },
    ],
  },
  incorrectHeader: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "THIS",
        E: "IS",
        F: "NOT",
        G: "VALID",
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
        I: "NET WEIGHT TOTAL",
      },
      {
        A: null,
      },
    ],
  },
};
