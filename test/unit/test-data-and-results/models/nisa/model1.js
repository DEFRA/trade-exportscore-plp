module.exports = {
  validModel: {
    "Customer Order": [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: 2,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "NISA BROCCOLI",
        L: "0403209300",
        M: 1,
        O: 2,
      },
    ],
  },
  validModelWithFooter: {
    "Customer Order": [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: 2,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "NISA BROCCOLI",
        L: "0403209300",
        M: 1,
        O: 2,
      },
      {
        M: 3,
        O: 4.5,
      },
    ],
  },
  validHeadersNoData: {
    "Customer Order": [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "790 - PASTRY - C",
        K: "CO OP BRITISH CHICKEN POPPERS",
        L: "1602321990",
        M: 4,
        O: 2.4,
      },
    ],
    Sheet2: [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "710 - SANDWICHES - C",
        K: "CO OP TUNA MAYONNAISE SANDWICH",
        L: "1604207055",
        M: 4,
        O: 3.2,
      },
    ],
  },
  wrongEstablishmentMultiple: {
    sheet1: [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
      },
    ],
    Sheet2: [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "INCORRECT",
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
      {
        A: "RMS_ESTABLISHMENT_NO",
        B: "DISPATCH_ADDRESS",
        C: "DELIVERY_ADDRESS",
      },
      {
        A: "RMS-GB-000025-009",
      },
    ],
    Sheet2: [
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
      },
      {
        A: "RMS-GB-000025-009",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Customer Order": [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: null,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "NISA BROCCOLI",
        L: "0403209300",
        M: 1,
        O: null,
      },
    ],
  },
  emptyModel: {
    "Customer Order": [
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
