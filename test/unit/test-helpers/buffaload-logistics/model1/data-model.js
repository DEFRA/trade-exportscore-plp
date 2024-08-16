module.exports = {
  validModel: {
    Sheet1: [
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
        H: "Treatment Type (Chilled /Ambient) ",
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
  invalidModel_MissingColumnCells: {
    Sheet1: [
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
        H: "Treatment Type (Chilled /Ambient) ",
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
  emptyModel: {
    Sheet1: [

    ],
  },
  validTestResult: {
    isParsed: true,
    packingList: {
      business_checks: {
        all_required_fields_present: true,
      },
      items: [
        {
          commodity_code: 16025095,
          description: "J/L JERKY 70G TERIYAKI",
          nature_of_products: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.15,
          type_of_treatment: null,
        },
        {
          commodity_code: 19053199,
          description: "MINI ROLLS 10PK",
          nature_of_products: null,
          number_of_packages: 1,
          total_net_weight_kg: 3.27,
          type_of_treatment: null,
        },
      ],
      registration_approval_number: "RMS-GB-000098-001",
    },
  },
  invalidTestResult_MissingCells: {
    isParsed: true,
    packingList: {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [
        {
          commodity_code: null,
          description: "J/L JERKY 70G TERIYAKI",
          nature_of_products: null,
          number_of_packages: 1,
          total_net_weight_kg: null,
          type_of_treatment: null,
        },
        {
          commodity_code: 19053199,
          description: "MINI ROLLS 10PK",
          nature_of_products: null,
          number_of_packages: 1,
          total_net_weight_kg: 3.27,
          type_of_treatment: null,
        },
      ],
      registration_approval_number: "RMS-GB-000098-001",
    },
  }
};
