/**
 * Gousto Model 1 test data
 *
 * Provides mock packing list data for Gousto parser testing.
 * Includes valid models, edge cases, and failure scenarios.
 */

const validModel = {
  "Packing List": [
    { A: "Supplier Info", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    { A: "Date:", B: "15/12/2025", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon Fillets",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB",
      H: "",
    },
    {
      A: "Organic Chicken Breast",
      B: "02071410",
      C: "20",
      D: "12.0",
      E: "Poultry",
      F: "Frozen",
      G: "DE",
      H: "",
    },
    {
      A: "Mixed Vegetables",
      B: "07099990",
      C: "15",
      D: "8.3",
      E: "Vegetables",
      F: "Fresh",
      G: "NL",
      H: "",
    },
  ],
};

const validModelWithBoxNumber = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon Fillets",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB",
      H: "",
    },
    {
      A: "Box Contents Summary",
      B: "",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "BOX-001",
    },
    {
      A: "Organic Chicken Breast",
      B: "02071410",
      C: "20",
      D: "12.0",
      E: "Poultry",
      F: "Frozen",
      G: "DE",
      H: "",
    },
  ],
};

const missingDescription = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB",
      H: "",
    },
  ],
};

const missingCommodityCodeAndNature = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "",
      C: "10",
      D: "5.5",
      E: "",
      F: "",
      G: "GB",
      H: "",
    },
  ],
};

const missingCountryOfOrigin = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "",
      H: "",
    },
  ],
};

const invalidCountryOfOrigin = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "INVALID",
      H: "",
    },
  ],
};

const validCountryOfOriginPlaceholder = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "X",
      H: "",
    },
  ],
};

const multipleCountryOfOrigin = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB,DE,FR",
      H: "",
    },
  ],
};

const missingNirmsStatement = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB",
      H: "",
    },
  ],
};

const wrongEstablishmentNumber = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-999999-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "NET WEIGHT (KG)",
      E: "NATURE",
      F: "TYPE OF TREATMENT",
      G: "COUNTRY OF ORIGIN",
      H: "BOX NUMBER",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB",
      H: "",
    },
  ],
};

const missingHeaders = {
  "Packing List": [
    {
      A: "GB Establishment RMS Number",
      B: "RMS-GB-000483-001",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    { A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "" },
    {
      A: "DESCRIPTION",
      B: "COMMODITY CODE",
      C: "NUMBER OF PACKS",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
    },
    {
      A: "Fresh Salmon",
      B: "03021200",
      C: "10",
      D: "5.5",
      E: "Fish",
      F: "Chilled",
      G: "GB",
      H: "",
    },
  ],
};

const emptyFile = {};

module.exports = {
  validModel,
  validModelWithBoxNumber,
  missingDescription,
  missingCommodityCodeAndNature,
  missingCountryOfOrigin,
  invalidCountryOfOrigin,
  validCountryOfOriginPlaceholder,
  multipleCountryOfOrigin,
  missingNirmsStatement,
  wrongEstablishmentNumber,
  missingHeaders,
  emptyFile,
};
