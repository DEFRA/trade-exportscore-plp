const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
        M: "NIIRMS Dispatch number",
        N: "Treatment Type (Chilled /Ambient)",
        O: "NIRMS Lane (R/G)",
        P: "Secondary Qty",
        Q: "Cert Type Req",
        R: "Cert Number",
      },
      {
        A: "1",
        B: "1582084",
        C: "0702000007",
        D: "Check - 0702000007",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "Morocco",
        H: "32",
        I: "Cases",
        J: "400",
        K: "336",
        L: "712.32",
        M: "RMS-GB-000216-004",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
      {
        A: "2",
        B: "3153779",
        C: "0702000007",
        D: "Check - 0702000007",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "Morocco",
        H: "39",
        I: "Cases",
        J: "429",
        K: "351",
        L: "889.2",
        M: "RMS-GB-000216-004",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  validModel_Multiple: {
    sheet: [
      {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      },
      {
        M: "RMS-GB-000216-002",
      },
    ],
    sheet2: [
      {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      },
      {
        M: "RMS-GB-000216-002",
      },
    ],
  },
  invalid_Model_IncorrectHeader: {
    sheet: [
      {
        C: "Incorrect",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      },
      {
        M: "RMS-GB-000216-002",
      },
    ],
  },
  invalid_Model_IncorrectHeaderMultiple: {
    sheet: [
      {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      },
      {
        M: "RMS-GB-000216-002",
      },
    ],
    sheet2: [
      {
        C: "Incorrect",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      },
      {
        M: "RMS-GB-000216-002",
      },
    ],
  },
  invalid_Model_IncorrectEstablishmentNumber: {
    sheet: [
      {
        F: "Description of goods",
      },
      {
        M: "Incorrect",
      },
    ],
  },
  invalid_Model_IncorrectEstablishmentNumberMultiple: {
    sheet: [
      {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      },
      {
        M: "RMS-GB-000216-123",
      },
    ],
    sheet2: [
      {
        F: "Description of goods",
      },
      {
        M: "Incorrect",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
        M: "NIIRMS Dispatch number",
        N: "Treatment Type (Chilled /Ambient)",
        O: "NIRMS Lane (R/G)",
        P: "Secondary Qty",
        Q: "Cert Type Req",
        R: "Cert Number",
      },
      {
        A: "1",
        B: "1582084",
        C: "0702000007",
        D: "Check - 0702000007",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "Morocco",
        H: "32",
        I: "Cases",
        J: "400",
        K: null,
        L: "712.32",
        M: "RMS-GB-000216-004",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
      {
        A: "2",
        B: "3153779",
        C: "0702000007",
        D: "Check - 0702000007",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "Morocco",
        H: "39",
        I: "Cases",
        J: "429",
        K: "351",
        L: "889.2",
        M: "RMS-GB-000216-004",
        N: null,
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  invalidModel_MissingHeaders: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        M: "NIIRMS Dispatch number",
      },
      {
        A: "1",
        B: "1582084",
        M: "RMS-GB-000216-004",
      },
    ],
  },
  emptyModel: {
    "Customer Order": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: null,
      },
    ],
  },
};
