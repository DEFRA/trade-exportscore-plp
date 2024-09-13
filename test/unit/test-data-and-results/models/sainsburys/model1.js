const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    Sheet1: [
      {
        C: "Product Type / Category",
        E: "Product / Part Number Description",
        G: "Packages",
        H: "Net\nWeight / Package KG",
        J: "Packaging Type",
        N: "RMS Number (based on depot)",
        O: "Commodity Code",
      },
      {
        E: "JS Chicken Korma 400g",
        C: "Chilled Indian Meals",
        O: "0709991000",
        G: 1,
        H: 3.15,
        N: "RMS-GB-000094-002​",
      },
      {
        E: "JS TTD Gunpowder Potatoes 250g",
        C: "Chilled Indian Meals",
        O: "1602323090",
        G: 2,
        H: 1.4,
        N: "RMS-GB-000094-002​",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Sheet1: [
      {
        C: "Product Type / Category",
        E: "Product / Part Number Description",
        G: "Packages",
        H: "Net\nWeight / Package KG",
        J: "Packaging Type",
        N: "RMS Number (based on depot)",
        O: "Commodity Code",
      },
      {
        E: "JS Chicken Korma 400g",
        C: null,
        O: "0709991000",
        G: 1,
        H: 3.15,
        N: "RMS-GB-000094-002​",
      },
      {
        E: "JS TTD Gunpowder Potatoes 250g",
        C: "Chilled Indian Meals",
        O: "1602323090",
        G: 2,
        H: null,
        N: "RMS-GB-000094-002​",
      },
    ],
  },
  emptyModel: {
    Sheet1: [
      {
        E: "Product / Part Number Description",
        C: "Product Type / Category",
        O: "Commodity Code",
        G: "Packages",
        H: "Net\nWeight / Package KG",
      },
      {
        N: null,
      },
    ],
  },
};
