const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    PackingList_Extract: [
      {
        A: "TruckID",
        B: "Dept",
        C: "SubDept",
        D: "Product",
        E: "# Packages",
        F: "# Units",
        G: "GrossWeight",
        H: "NetWeight",
        I: "NatureOfProduct",
        J: "Treatment",
        K: "PlaceOfDispatch",
      },
      {
        A: "51270",
        B: "0001 - Gardens",
        C: "0101 - Garden Care",
        D: "002541 - Tapered Slate Small Planter Ash",
        E: "2",
        F: "2",
        G: "2",
        H: "1.9",
        I: "General Retail Goods",
        J: "Ambient Goods",
        K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
      },
      {
        A: "51250",
        B: "0003 - Home Decor",
        C: "0322 - Home Fragrance",
        D: "070398 - Amber Wood / Velvet Rose Oud Candle",
        E: "4",
        F: "24",
        G: "26",
        H: "24.7",
        I: "General Retail Goods",
        J: "Ambient Goods",
        K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    PackingList_Extract: [
      {
        A: "TruckID",
        B: "Dept",
        C: "SubDept",
        D: "Product",
        E: "# Packages",
        F: "# Units",
        G: "GrossWeight",
        H: "NetWeight",
        I: "NatureOfProduct",
        J: "Treatment",
        K: "PlaceOfDispatch",
      },
      {
        A: "51270",
        B: "0001 - Gardens",
        C: "0101 - Garden Care",
        D: "002541 - Tapered Slate Small Planter Ash",
        E: "2",
        F: "2",
        G: "2",
        H: null,
        I: "General Retail Goods",
        J: "Ambient Goods",
        K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
      },
      {
        A: "51250",
        B: "0003 - Home Decor",
        C: "0322 - Home Fragrance",
        D: "070398 - Amber Wood / Velvet Rose Oud Candle",
        E: "4",
        F: "24",
        G: "26",
        H: "24.7",
        I: "General Retail Goods",
        J: null,
        K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
      },
    ],
  },
  emptyModel: {
    PackingList_Extract: [
      {
        A: "TruckID",
        B: "Dept",
        C: "SubDept",
        D: "Product",
        E: "# Packages",
        F: "# Units",
        G: "GrossWeight",
        H: "NetWeight",
        I: "NatureOfProduct",
        J: "Treatment",
        K: "PlaceOfDispatch",
      },
      {
        K: null,
      },
    ],
  },
};
