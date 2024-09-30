module.exports = {
  validModel: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        B: "4PK X 17 PINK LADY APPLES",
        D: "TOP FRUIT",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 20,
        L: 12.75,
        N: 255,
      },
      {
        B: "ASDA BABY WATERMELON X10",
        D: "MELON HARD",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 5,
        L: 12,
        N: 60,
      },
    ],
  },
  validHeadersNoData: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
    ],
  },
  wrongEstablishment: {
    PackingList_Extract: [
      {},
      {},
      {
        H: "INCORRECT",
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
  invalidModel_MissingColumnCells: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        B: "4PK X 17 PINK LADY APPLES",
        D: null,
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 20,
        L: 12.75,
        N: 255,
      },
      {
        B: "ASDA BABY WATERMELON X10",
        D: "MELON HARD",
        F: null,
        H: "RMS-GB-000015-010",
        J: 5,
        L: 12,
        N: 60,
      },
    ],
  },
  emptyModel: {
    Sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        H: null,
      },
    ],
  },
};
