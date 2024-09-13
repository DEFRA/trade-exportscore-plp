const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Customer Order": [
      {
        B: "RMS_ESTABLISHMENT_NO",
        J: "PRODUCT_TYPE_CATEGORY",
        L: "PART_NUMBER_DESCRIPTION",
        M: "TARIFF_CODE_EU",
        N: "PACKAGES",
        P: "NET_WEIGHT_TOTAL",
      },
      {
        B: "RMS-GB-000025-001",
        J: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        L: "DAIRYLEA DUNKERS JUMBO PM80P",
        M: "2005995090",
        N: 2,
        P: 2.5,
      },
      {
        B: "RMS-GB-000025-001",
        J: "900 - VEGETABLES PREPACK-C",
        L: "NISA BROCCOLI",
        M: "0403209300",
        N: 1,
        P: 2,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Customer Order": [
      {
        B: "RMS_ESTABLISHMENT_NO",
        J: "PRODUCT_TYPE_CATEGORY",
        L: "PART_NUMBER_DESCRIPTION",
        M: "TARIFF_CODE_EU",
        N: "PACKAGES",
        P: "NET_WEIGHT_TOTAL",
      },
      {
        B: "RMS-GB-000025-001",
        J: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        L: "DAIRYLEA DUNKERS JUMBO PM80P",
        M: "2005995090",
        N: 2,
        P: null,
      },
      {
        B: "RMS-GB-000025-001",
        J: "900 - VEGETABLES PREPACK-C",
        L: "NISA BROCCOLI",
        M: null,
        N: 1,
        P: 2,
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
