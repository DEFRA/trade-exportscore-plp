const parserModel = require("../../../../../app/services/parser-model");
const failureReasonsDescriptions = require("../../../../../app/services/validators/packing-list-failure-reasons");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NIRMS",
      },
      {
        commodity_code: "02041000",
        country_of_origin: "IE",
        description: "Fresh Lamb Steaks",
        nature_of_products: "Meat Products",
        number_of_packages: "5",
        total_net_weight_kg: "25.2",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
      {
        commodity_code: "02041000",
        country_of_origin: "IE",
        description: "Fresh Lamb Steaks",
        nature_of_products: "Meat Products",
        number_of_packages: "5",
        total_net_weight_kg: "25.2",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Product description is missing in sheet "PackingList_Extract" row 2.\nNo of packages is missing in sheet "PackingList_Extract" row 3.\n',
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: null,
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
      {
        commodity_code: null,
        country_of_origin: "IE",
        description: "Fresh Lamb Steaks",
        nature_of_products: "Meat Products",
        number_of_packages: null,
        total_net_weight_kg: "25.2",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: failureReasonsDescriptions.MULTIPLE_RMS,
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: null,
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
      {
        commodity_code: "02041000",
        country_of_origin: null,
        description: "Fresh Lamb Steaks",
        nature_of_products: "Meat Products",
        number_of_packages: "5",
        total_net_weight_kg: "25.2",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        failureReasonsDescriptions.NET_WEIGHT_UNIT_MISSING + ".\n",
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: null,
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  invalidTestResult_MissingColumnCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Product description is missing in sheet "PackingList_Extract" row 2.\n',
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: null,
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON-NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  failedTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  invalidNirmsTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        failureReasonsDescriptions.NIRMS_INVALID +
        ' in sheet "PackingList_Extract" row 2 and sheet "PackingList_Extract" row 3.\n',
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "INVALID_NIRMS",
      },
      {
        commodity_code: "02041000",
        country_of_origin: "IE",
        description: "Fresh Lamb Steaks",
        nature_of_products: "Meat Products",
        number_of_packages: "5",
        total_net_weight_kg: "25.2",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "WRONG_VALUE",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  nonNirmsTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NON NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  missingNirmsTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        failureReasonsDescriptions.NIRMS_MISSING +
        ' in sheet "PackingList_Extract" row 2.\n',
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "IE",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: null,
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  missingCoOTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        failureReasonsDescriptions.COO_MISSING +
        ' in sheet "PackingList_Extract" row 2.\n',
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: null,
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  invalidCoOTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        failureReasonsDescriptions.COO_INVALID +
        ' in sheet "PackingList_Extract" row 2 and sheet "PackingList_Extract" row 3.\n',
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "INVALID_ISO",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NIRMS",
      },
      {
        commodity_code: "02041000",
        country_of_origin: "ZZ",
        description: "Fresh Lamb Steaks",
        nature_of_products: "Meat Products",
        number_of_packages: "5",
        total_net_weight_kg: "25.2",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  xCoOTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "02013000",
        country_of_origin: "X",
        description: "Fresh Beef Mince",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "Chilled",
        nirms: "NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
  ineligibleItemsTestResult: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        failureReasonsDescriptions.INELIGIBLE_ITEM +
        ' in sheet "PackingList_Extract" row 2.\n',
    },
    items: [
      {
        commodity_code: "012",
        country_of_origin: "INELIGIBLE_ITEM_ISO",
        description: "Ineligible Beef Product",
        nature_of_products: "Meat Products",
        number_of_packages: "10",
        total_net_weight_kg: "50.5",
        total_net_weight_unit: "kg",
        type_of_treatment: "INELIGIBLE_ITEM_TREATMENT",
        nirms: "NIRMS",
      },
    ],
    registration_approval_number: "RMS-GB-000156-001",
    parserModel: parserModel.TURNERS1,
  },
};
