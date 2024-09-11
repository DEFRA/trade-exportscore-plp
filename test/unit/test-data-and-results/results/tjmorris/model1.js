const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "Description",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "CHILLED",
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: "8",
        type_of_treatment: "FRESH PRODUCTS",
      },
    ],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: ParserModel.TJMORRIS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "Description",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: null,
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: null,
        type_of_treatment: "FRESH PRODUCTS",
      },
    ],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: ParserModel.TJMORRIS1,
  },
};
