module.exports = {
  validModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
      },
      {
        B: "100000859 ASDA CREPES TOFFEE 180G",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.204,
        I: "kgs",
      },
    ],
  },
  validHeadersNoData: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
    ],
  },
  validModelMultipleSheets: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
      },
    ],
    Page2_2: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        B: "100000859 ASDA CREPES TOFFEE 180G",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.204,
        I: "kgs",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        E: "RMS-GB-000015-006",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: null,
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
      },
      {
        B: "100000859 ASDA CREPES TOFFEE 180G",
        C: "Bakery Bought In",
        D: null,
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.204,
        I: "kgs",
      },
    ],
  },
  wrongEstablishment: {
    Page1_1: [
      {},
      {},
      {
        E: "INCORRECT",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: null,
        D: "Ambient Grocery",
        E: "INVALID",
        F: "INVALID",
        G: 1,
        H: 0.059,
        I: "kgs",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        E: "RMS-GB-000015-006",
      },
    ],
    Page2_2: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        E: "INCORRECT",
      },
    ],
  },
  incorrectHeader: {
    Page1_1: [
      {
        B: "NOT",
        C: "CORRECT",
        D: "HEADER",
      },
      {
        E: "RMS-GB-000015-006",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
      },
    ],
  },
  incorrectHeaderMultiple: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
      },
    ],
    Page2_2: [
      {
        B: "NOT",
        C: "CORRECT",
        D: "HEADER",
      },
      {
        B: "100000859 ASDA CREPES TOFFEE 180G",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.204,
        I: "kgs",
      },
    ],
  },
  emptyModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {},
    ],
  },
  multipleRms: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        J: "RMS-GB-000015-005",
      },
      {
        B: "100000859 ASDA CREPES TOFFEE 180G",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.204,
        I: "kgs",
      },
    ],
  },
  missingKgunit: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "Nature of Product",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
      },
      {
        B: "100000261 DAILY CROISSANT CHOCO 1PK",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: null,
      },
      {
        B: "100000859 ASDA CREPES TOFFEE 180G",
        C: "Bakery Bought In",
        D: "Ambient Grocery",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.204,
        I: null,
      },
    ],
  },
};
