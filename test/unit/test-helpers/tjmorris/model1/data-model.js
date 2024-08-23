const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    Sheet1: [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "SANDWICHES",
        N: "28 TUNA CRUNCH TIGER ROLL",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {
        A: "RMS-GB-000010-001",
        J: "CHILLED",
        L: "Description",
        N: "Description",
        O: "0408192000",
        P: "2",
        R: "1.4",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        L: "LETTUCE & BAGGED SALADS",
        N: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: "8",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    Sheet1: [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "SANDWICHES",
        N: "28 TUNA CRUNCH TIGER ROLL",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {
        A: "RMS-GB-000010-001",
        J: null,
        L: "Description",
        N: "Description",
        O: "0408192000",
        P: "2",
        R: "1.4",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        L: "LETTUCE & BAGGED SALADS",
        N: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: null,
      },
    ],
  },
  emptyModel: {
    Sheet1: [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "SANDWICHES",
        N: "28 TUNA CRUNCH TIGER ROLL",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {
        A: null,
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
        description: "Description",
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
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: ParserModel.TJMORRIS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "0709991000",
        description: "Description",
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
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: ParserModel.TJMORRIS1,
  },
};
