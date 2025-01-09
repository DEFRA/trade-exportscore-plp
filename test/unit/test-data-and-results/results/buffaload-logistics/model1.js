const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    registration_approval_number: "RMS-GB-000098-001",
    items: [
      {
        description:
          "60008347 - Take-Out Club Classic Crust Kickin' Meat Feast",
        nature_of_products: null,
        type_of_treatment: "Chilled",
        commodity_code: "1905908000",
        number_of_packages: 6,
        total_net_weight_kg: 3.552,
      },
      {
        description:
          "60008348 - Take-Out Club Classic Crust Smokin' BBQ Pulled Pork",
        nature_of_products: null,
        type_of_treatment: "Chilled",
        commodity_code: "1905908000",
        number_of_packages: 5,
        total_net_weight_kg: 3.558,
      },
    ],
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    parserModel: parserModel.BUFFALOAD1,
  },
  validTestResultForMultipleSheets: {
    registration_approval_number: "RMS-GB-000098-001",
    items: [
      {
        description:
          "60008347 - Take-Out Club Classic Crust Kickin' Meat Feast",
        nature_of_products: null,
        type_of_treatment: "Chilled",
        commodity_code: "1905908000",
        number_of_packages: 6,
        total_net_weight_kg: 3.552,
      },
      {
        description: "51283907 - PizzaExpress 9 Classic American *4",
        nature_of_products: null,
        type_of_treatment: "Chilled",
        commodity_code: "1905908000",
        number_of_packages: 1,
        total_net_weight_kg: 3.08,
      },
    ],
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    parserModel: parserModel.BUFFALOAD1,
  },
  emptyModelResult: {
    registration_approval_number: null,
    items: [
      {
        description: null,
        nature_of_products: null,
        type_of_treatment: null,
        commodity_code: null,
        number_of_packages: null,
        total_net_weight_kg: null,
      },
    ],
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    parserModel: parserModel.BUFFALOAD1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Total net weight is missing in row 1.\n",
    },
    items: [
      {
        description:
          "60008347 - Take-Out Club Classic Crust Kickin' Meat Feast",
        nature_of_products: null,
        type_of_treatment: null,
        commodity_code: "1905908000",
        number_of_packages: 6,
        total_net_weight_kg: 3.552,
      },
      {
        description:
          "60008348 - Take-Out Club Classic Crust Smokin' BBQ Pulled Pork",
        nature_of_products: null,
        type_of_treatment: "Chilled",
        commodity_code: "1905908000",
        number_of_packages: 5,
        total_net_weight_kg: null,
      },
    ],
    registration_approval_number: "RMS-GB-000098-001",
    parserModel: parserModel.BUFFALOAD1,
  },
};
