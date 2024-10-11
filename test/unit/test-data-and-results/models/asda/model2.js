const ParserModel = require("../../../../../app/services/parser-model");
const {
  validModelMultipleSheets,
  wrongEstablishmentMultiple,
  incorrectHeaderMultiple,
} = require("./model1");

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
  validModelMultipleSheets: {
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
    ],
    sheet2: [
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
        B: "ASDA BERRIES TWIN PACK 12X200G",
        D: "BERRIES",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 1,
        L: 3,
        N: 3,
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
  wrongEstablishmentMultiple: {
    sheet1: [
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
        H: "RMS-GB-000015-010",
      },
    ],
    sheet2: [
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
        H: "INCORRECT",
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
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
    ],
    sheet2: [
      {
        B: "NOT",
        D: "CORRECT",
        F: "HEADER",
      },
      {
        B: "ASDA BERRIES TWIN PACK 12X200G",
        D: "BERRIES",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 1,
        L: 3,
        N: 3,
      },
    ],
  },
  incorrectHeader: {
    sheet1: [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
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
