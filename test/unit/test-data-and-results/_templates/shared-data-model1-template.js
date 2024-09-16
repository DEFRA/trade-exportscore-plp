const validModel = {
  SheetNameHere: [
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "header",
      E: "here",
      F: "[Number of Packages]",
      G: "[Net Weight]",
      H: "[kilograms/grams]",
    },
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "data",
      E: "here",
      F: "and here",
      G: "here",
      H: "and here",
    },
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "data",
      E: "here",
      F: "and here",
      G: "here",
      H: "and here",
    },
  ],
};
const missingColumnData = {
  SheetNameHere: [
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "header",
      E: "here",
      F: "[Number of Packages]",
      G: "[Net Weight]",
      H: "[kilograms/grams]",
    },
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "data",
      E: "here",
      F: null,
      G: "here",
      H: "and here",
    },
    {
      A: "Add",
      B: "the",
      C: null,
      D: "data",
      E: "here",
      F: "and here",
      G: "here",
      H: "and here",
    },
  ],
};
const incorrectEstablishmentNumber = {
  SheetNameHere: [
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "header",
      E: "here",
      F: "[Number of Packages]",
      G: "[Net Weight]",
      H: "[kilograms/grams]",
    },
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "data",
      E: "here",
      F: "and here",
      G: "here",
      H: "and here",
    },
    {
      A: "Add",
      B: "the",
      C: "valid",
      D: "data",
      E: "here",
      F: "and here",
      G: "here",
      H: "and here",
    },
  ],
};
const incorrectHeader = {
  SheetNameHere: [
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
};
const headerButNoData = {
  SheetNameHere: [
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
  ],
};
const emptyModel = {
  SheetNameHere: [
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
  ],
};

module.exports = {
  validModel,
  missingColumnData,
  incorrectEstablishmentNumber,
  incorrectHeader,
  headerButNoData,
  emptyModel,
};
