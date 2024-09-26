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
  emptyModel: {
    PackingList_Extract: [{}],
  },
};
