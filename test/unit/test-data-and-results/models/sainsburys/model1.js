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
  validHeadersNoData: {
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
    ],
  },
  validModelMultipleSheets: {
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
        E: "Jason's Sourdough The Great White 450g",
        C: "Bread",
        O: "1905903000",
        G: 1,
        H: 3.15,
        N: "RMS-GB-000094-002​",
      },
    ],
    Sheet2: [
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
        O: "1602323090",
        G: 1,
        H: 2.4,
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
  wrongEstablishmentMultiple: {
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
        N: "RMS-GB-000094-002​",
      },
    ],
    Sheet2: [
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
        N: "Incorrect",
      },
    ],
  },
  incorrectHeaderMultiple: {
    Sheet1: [
      {
        A: "Delivery Date",
        B: "Load Ref (Trailer Number)",
        C: "Product Type / Category",
        D: "Product / Part Number",
        E: "Product / Part Number Description",
        F: "Packed Singles",
        G: "Packages",
        H: "Net\nWeight / Package KG",
        I: "Gross\nWeight / Package KG",
        J: "Packaging Type",
        K: "Excise Code",
        L: "Final Destination ID",
        M: "Dispatch Unit ID",
        N: "RMS Number (based on depot)",
        O: "Commodity Code",
      },
      {
        N: "RMS-GB-000094-002​",
      },
    ],
    Sheet2: [
      {
        A: "NOT",
        B: "CORRECT",
        C: "HEADER",
        D: "Product / Part Number",
        E: "Product / Part Number Description",
        F: "Packed Singles",
        G: "Packages",
        H: "Net\nWeight / Package KG",
        I: "Gross\nWeight / Package KG",
        J: "Packaging Type",
        K: "Excise Code",
        L: "Final Destination ID",
        M: "Dispatch Unit ID",
        N: "RMS Number (based on depot)",
        O: "Commodity Code",
      },
      {
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
