module.exports = {
  validModel: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
      {
        A: "Fresh Lamb Steaks",
        B: "02041000",
        C: "5",
        D: "25.2",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  validHeadersNoData: {
    PackingList_Extract: [
      {
        I: "RMS-GB-000156-001",
      },
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NON-NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
    Sheet2: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Lamb Steaks",
        B: "02041000",
        C: "5",
        D: "25.2",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NON-NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    sheet1: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight",
        E: "Nature of Product",
        F: "Type of Treatment",
      },
      {
        I: "RMS-GB-000156-001",
      },
    ],
    sheet2: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight",
        E: "Nature of Product",
        F: "Type of Treatment",
      },
      {
        I: "INCORRECT",
      },
    ],
  },
  wrongEstablishment: {
    sheet2: [
      {},
      {
        I: "INCORRECT",
      },
    ],
  },
  incorrectHeaderMultiple: {
    sheet1: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight",
      },
      {
        I: "RMS-GB-000156-001",
      },
    ],
    sheet2: [
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
        D: "VALUES",
      },
      {
        I: "RMS-GB-000156-001",
      },
    ],
  },
  incorrectHeader: {
    sheet2: [
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
        D: "VALUES",
      },
      {
        I: "RMS-GB-000156-001",
      },
    ],
  },
  multipleRms: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        I: "RMS-GB-000156-001",
        H: "NON-NIRMS",
      },
      {
        A: "Fresh Lamb Steaks",
        B: "02041000",
        C: "5",
        D: "25.2",
        E: "Meat Products",
        F: "Chilled",
        I: "RMS-GB-000156-002",
        H: "NON-NIRMS",
      },
    ],
  },
  missingKgunit: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight", // Missing 'kg' unit in header
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NON-NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: null, // Missing description
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NON-NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  invalidModel_MissingHeaders: {
    PackingList_Extract: [
      {
        A: "WRONG",
        B: "HEADERS",
        C: "NOT",
        D: "MATCHING",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  invalidNirms: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "INVALID_NIRMS", // Invalid NIRMS value
        I: "RMS-GB-000156-001",
      },
      {
        A: "Fresh Lamb Steaks",
        B: "02041000",
        C: "5",
        D: "25.2",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "WRONG_VALUE", // Invalid NIRMS value
        I: "RMS-GB-000156-001",
      },
    ],
  },
  nonNirms: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: "NON NIRMS", // Valid non-NIRMS value
        I: "RMS-GB-000156-001",
      },
    ],
  },
  missingNirms: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "IE",
        H: null, // Missing NIRMS value
        I: "RMS-GB-000156-001",
      },
    ],
  },
  missingCoO: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: null, // Missing Country of Origin
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  invalidCoO: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "INVALID_ISO", // Invalid Country of Origin
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
      {
        A: "Fresh Lamb Steaks",
        B: "02041000",
        C: "5",
        D: "25.2",
        E: "Meat Products",
        F: "Chilled",
        G: "ZZ", // Invalid Country of Origin
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  xCoO: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Fresh Beef Mince",
        B: "02013000",
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "Chilled",
        G: "X", // Special X Country of Origin
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
  ineligibleItems: {
    PackingList_Extract: [
      {
        A: "Description of Goods",
        B: "Commodity code",
        C: "No. of pkgs",
        D: "Item Net Weight kg",
        E: "Nature of Product",
        F: "Type of Treatment",
        G: "Country of Origin",
        H: "NIRMS / NON NIRMS",
      },
      {
        A: "Prohibited Beef Product",
        B: "012", // Prohibited commodity code
        C: "10",
        D: "50.5",
        E: "Meat Products",
        F: "PROHIBITED_ITEM_TREATMENT", // Prohibited treatment
        G: "PROHIBITED_ITEM_ISO", // Prohibited origin
        H: "NIRMS",
        I: "RMS-GB-000156-001",
      },
    ],
  },
};
