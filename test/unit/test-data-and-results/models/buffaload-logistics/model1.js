const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    Tabelle1: [
      {
        A: "NIIRMS Dispatch number",
        B: "RMS-GB-000098-001",
        C: "Dispatch address",
        D: "Buffaload Logistics, Gateway Industrial Estate, Crewe, Cheshire, CW1 6YY",
      },
      {
        A: "Commodity code",
        B: "Description of goods",
        C: "Country of Origin",
        D: "No. of pkgs",
        E: "Type of pkgs",
        F: "Item Gross Weight (kgs)",
        G: "Item Net Weight (kgs)",
        H: "Treatment Type (Chilled /Ambient)",
        I: "NIRMS Lane (R/G)",
      },
      {
        A: "1905908000",
        B: "60008347 - Take-Out Club Classic Crust Kickin' Meat Feast",
        C: "Great Britain",
        D: 6,
        E: "Cases",
        F: 3.782,
        G: 3.552,
        H: "Chilled",
        I: "Green",
      },
      {
        A: "1905908000",
        B: "60008348 - Take-Out Club Classic Crust Smokin' BBQ Pulled Pork",
        C: "Great Britain",
        D: 5,
        E: "Cases",
        F: 3.788,
        G: 3.558,
        H: "Chilled",
        I: "Green",
      },
    ],
  },
  missingColumnData: {
    Tabelle1: [
      {
        A: "NIIRMS Dispatch number",
        B: "RMS-GB-000098-001",
        C: "Dispatch address",
        D: "Buffaload Logistics, Gateway Industrial Estate, Crewe, Cheshire, CW1 6YY",
      },
      {
        A: "Commodity code",
        B: "Description of goods",
        C: "Country of Origin",
        D: "No. of pkgs",
        E: "Type of pkgs",
        F: "Item Gross Weight (kgs)",
        G: "Item Net Weight (kgs)",
        H: "Treatment Type (Chilled /Ambient)",
        I: "NIRMS Lane (R/G)",
      },
      {
        A: "1905908000",
        B: "60008347 - Take-Out Club Classic Crust Kickin' Meat Feast",
        C: "Great Britain",
        D: 6,
        E: "Cases",
        F: 3.782,
        G: 3.552,
        H: null,
        I: "Green",
      },
      {
        A: "1905908000",
        B: "60008348 - Take-Out Club Classic Crust Smokin' BBQ Pulled Pork",
        C: "Great Britain",
        D: 5,
        E: "Cases",
        F: 3.788,
        G: null,
        H: "Chilled",
        I: "Green",
      },
    ],
  },
  incorrectEstablishmentNumber: {},
  incorrectHeader: {},
  emptyModel: {
    Tabelle1: [
      {
        A: "NIIRMS Dispatch number",
        B: null,
        C: "Dispatch address",
        D: "Buffaload Logistics, Gateway Industrial Estate, Crewe, Cheshire, CW1 6YY",
      },
      {
        A: "Commodity code",
        B: "Description of goods",
        C: "Country of Origin",
        D: "No. of pkgs",
        E: "Type of pkgs",
        F: "Item Gross Weight (kgs)",
        G: "Item Net Weight (kgs)",
        H: "Treatment Type (Chilled /Ambient)",
        I: "NIRMS Lane (R/G)",
      },
      {},
    ],
  },
};
