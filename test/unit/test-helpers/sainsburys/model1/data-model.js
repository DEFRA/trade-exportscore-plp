const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    Sheet1: [
      {
        C: "Product Type / Category",
        E: "Product / Part Number Description",
        G: "Packages",
        H: "Net\r\nWeight / Package KG",
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
        H: "Net\r\nWeight / Package KG",
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
        H: "Net\r\nWeight / Package KG",
      },
      {
        N: null,
      },
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "0709991000",
        description: "JS Chicken Korma 400g",
        nature_of_products: "Chilled Indian Meals",
        number_of_packages: 1,
        total_net_weight_kg: 3.15,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602323090",
        description: "JS TTD Gunpowder Potatoes 250g",
        nature_of_products: "Chilled Indian Meals",
        number_of_packages: 2,
        total_net_weight_kg: 1.4,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000094-002",
    parserModel: ParserModel.SAINSBURYS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "0709991000",
        description: "JS Chicken Korma 400g",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 3.15,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602323090",
        description: "JS TTD Gunpowder Potatoes 250g",
        nature_of_products: "Chilled Indian Meals",
        number_of_packages: 2,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000094-002",
    parserModel: ParserModel.SAINSBURYS1,
  },
};
