module.exports = {
  validModel: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
        J: "RAW",
        L: "2 WEB LICK-E-LIX 5S BEEF",
        B: "PET FOOD & HEALTHCARE",
        O: "0408192000",
        P: "2",
        R: "1.4",
        T: "GB",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        B: "LETTUCE & BAGGED SALADS",
        L: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: "8",
        T: "GB",
      },
    ],
  },
  validHeadersNoData: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
    ],
  },
  validModelMultipleSheets: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
        J: "RAW",
        L: "2 WEB LICK-E-LIX 5S BEEF",
        B: "PET FOOD & HEALTHCARE",
        O: "0408192000",
        P: "2",
        R: "1.4",
        T: "GB",
      },
    ],
    Sheet2: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        B: "LETTUCE & BAGGED SALADS",
        L: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: "8",
        T: "GB",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
        J: "RAW",
        L: "2 WEB LICK-E-LIX 5S BEEF",
        B: "PET FOOD & HEALTHCARE",
        O: "0408192000",
        P: "2",
        R: "1.4",
        T: "GB",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        B: "LETTUCE & BAGGED SALADS",
        L: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        T: "GB",
      },
    ],
  },
  wrongEstablishmentNumber: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "Incorrect",
      },
    ],
  },
  wrongEstablishmentMultiple: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
      },
    ],
    Sheet2: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "Incorrect",
      },
    ],
  },
  incorrectHeader: {
    Sheet1: [
      {
        L: "NOT",
        O: "CORRECT",
        P: "HEADER",
      },
      {
        A: "RMS-GB-000010-001",
      },
    ],
  },
  incorrectHeaderMultiple: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
      },
    ],
    Sheet2: [
      {
        L: "NOT",
        O: "CORRECT",
        P: "HEADER",
      },
      {
        A: "RMS-GB-000010-001",
      },
    ],
  },
  emptyModel: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: null,
      },
    ],
  },
  multipleRms: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight Kg",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
        C: "RMS-GB-000010-002",
        J: "RAW",
        L: "2 WEB LICK-E-LIX 5S BEEF",
        B: "PET FOOD & HEALTHCARE",
        O: "0408192000",
        P: "2",
        R: "1.4",
        T: "GB",
      },
    ],
  },
  missingKgunit: {
    Sheet1: [
      {
        B: "Nature of Products",
        J: "Treatment Type",
        L: "Description",
        O: "Tariff/Commodity",
        P: "Number of packages",
        R: "Net Weight",
        T: "Country of Origin",
      },
      {
        A: "RMS-GB-000010-001",
        J: "RAW",
        L: "2 WEB LICK-E-LIX 5S BEEF",
        B: "PET FOOD & HEALTHCARE",
        O: "0408192000",
        P: "2",
        R: "1.4",
        T: "GB",
      },
    ],
  },
};
