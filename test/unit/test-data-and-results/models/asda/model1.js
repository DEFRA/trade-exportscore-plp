const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    PackingList_Extract: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        A: "169 STOREY TREEHOUSE",
        B: "BOOKS",
        C: "GM",
        D: "RMS-GB-000015-006",
        E: "RMS-NI-000008-017",
        F: 2,
        G: 0.38,
        H: "kgs",
      },
      {
        A: "19 CRIMES",
        B: "WINES",
        C: "AMBIENT",
        D: "RMS-GB-000015-006",
        E: "RMS-NI-000008-017",
        F: 1,
        G: 0.3457,
        H: "kgs",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        A: "A BESSIES APPLE PIE",
        B: "DESSERTS & ICE CREAM",
        C: "FROZEN",
        D: "RMS-GB-000015-005",
        E: "RMS-NI-000008-015",
        F: 1,
        G: 4.2,
        H: "kgs",
      },
      {
        A: "A BESSIES ROASTS",
        B: "CHIPS/POTATOES & VEG",
        C: "FROZEN",
        D: "RMS-GB-000015-005",
        E: "RMS-NI-000008-009",
        F: 1,
        G: 10.3,
        H: "kgs",
      },
    ],
    Sheet2: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        A: "ASDA BROOKIE BITES",
        B: "CAKES IS",
        C: "FRESH",
        D: "RMS-GB-000015-005",
        E: "RMS-NI-000008-001",
        F: 2,
        G: 4.32,
        H: "kgs",
      },
      {
        A: "ASDA BROWNIE CAKE",
        B: "CAKES/CHILLED BI",
        C: "FRESH",
        D: "RMS-GB-000015-005",
        E: "RMS-NI-000008-001",
        F: 1,
        G: 2.68,
        H: "kgs",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    PackingList_Extract: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        D: "RMS-GB-000015-001",
      },
      {
        A: "169 STOREY TREEHOUSE",
        B: null,
        C: "GM",
        D: "RMS-GB-000015-006",
        E: "RMS-NI-000008-017",
        F: 2,
        G: 0.38,
        H: "kgs",
      },
      {
        A: "19 CRIMES",
        B: "WINES",
        C: null,
        D: "RMS-GB-000015-006",
        E: "RMS-NI-000008-017",
        F: 1,
        G: 0.3457,
        H: "kgs",
      },
    ],
  },
  wrongEstablishment: {
    PackingList_Extract: [
      {},
      {},
      {
        D: "INCORRECT",
      },
      {
        A: "169 STOREY TREEHOUSE",
        B: null,
        C: "GM",
        D: "INVALID",
        E: "INVALID",
        F: 2,
        G: 0.38,
        H: "kgs",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    Sheet1: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        D: "RMS-GB-000015-005",
      },
    ],
    Sheet2: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        D: "INCORRECT",
      },
    ],
  },
  incorrectHeader: {
    PackingList_Extract: [
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
      },
      {
        D: "RMS-GB-000015-006",
      },
      {
        A: "169 STOREY TREEHOUSE",
        B: null,
        C: "GM",
        D: "RMS-GB-000015-006",
        E: "INVALID",
        F: 2,
        G: 0.38,
        H: "kgs",
      },
    ],
  },
  incorrectHeaderMultiple: {
    Sheet1: [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
      },
      {
        A: "A BESSIES ROASTS",
        B: "CHIPS/POTATOES & VEG",
        C: "FROZEN",
        D: "RMS-GB-000015-005",
        E: "RMS-NI-000008-009",
        F: 1,
        G: 10.3,
        H: "kgs",
      },
    ],
    Sheet2: [
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
      },
      {
        A: "ASDA BROOKIE BITES",
        B: "CAKES IS",
        C: "FRESH",
        D: "RMS-GB-000015-005",
        E: "RMS-NI-000008-001",
        F: 2,
        G: 4.32,
        H: "kgs",
      },
    ],
  },
  emptyModel: {
    PackingList_Extract: [{}],
  },
};
