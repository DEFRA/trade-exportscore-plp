module.exports = {
  validModel: {
    Customer_Order: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: "Total Net Weight(X)",
      },
      {
        C: "709200010",
        F: "ASPARAGUS BUNDLE",
        H: 160,
        K: 40.0,
      },
      {
        C: "709599000",
        F: "OYSTER MUSHROOM",
        H: 20,
        K: 30.0,
      },
    ],
  },
  validHeadersNoData: {
    Customer_Order: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: "Total Net Weight(X)",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: "Total Net Weight(X)",
      },
      {
        C: "709200010",
        F: "ASPARAGUS BUNDLE",
        H: 160,
        K: 40.0,
      },
    ],
    sheet2: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: "Total Net Weight(X)",
      },
      {
        C: "709599000",
        F: "OYSTER MUSHROOM",
        H: 20,
        K: 30.0,
      },
    ],
  },
  invalidModel_IncorrectEstablishmentNumber: {
    PackingList_Extract: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "Invalid" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: "Total Net Weight(X)",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    sheet1: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(X)",
        K: "Total Net Weight(X)",
      },
    ],
    sheet2: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "INCORRECT" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(X)",
        K: "Total Net Weight(X)",
      },
    ],
  },
  invalidModel_MissingHeaders: {
    Customer_Order: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: null,
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: null,
      },
      {
        C: "709200010",
        F: "ASPARAGUS BUNDLE",
        H: 160,
        K: 40.0,
      },
      {
        C: "709599000",
        F: "OYSTER MUSHROOM",
        H: 20,
        K: 30.0,
      },
    ],
  },
  invalidModel_IncorrectHeaders: {
    Customer_Order: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "THIS",
        F: "IS",
        H: "NoT",
        K: "VALID",
      },
      {
        C: "709200010",
        F: "ASPARAGUS BUNDLE",
        H: 160,
        K: 40.0,
      },
      {
        C: "709599000",
        F: "OYSTER MUSHROOM",
        H: 20,
        K: 30.0,
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        A: "Item",
        B: "Product Code",
        C: "Commodity Code",
      },
    ],
    sheet2: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Customer_Order: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: "RMS-GB-000323-001" },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        C: "Commodity Code",
        F: "Description of Goods",
        H: "No. of Pkgs(180)",
        K: "Total Net Weight(X)",
      },

      {
        C: null,
        F: "ASPARAGUS BUNDLE",
        H: 160,
        K: 40.0,
      },
      {
        C: "709599000",
        F: "OYSTER MUSHROOM",
        H: 20,
        K: null,
      },
    ],
  },
  emptyModel: {
    PackingList_Extract: [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { C: null },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},

      {
        C: null,
      },
    ],
  },
};
