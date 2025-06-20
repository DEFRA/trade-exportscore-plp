const packingList = require("../../../../app/models/packing-list");
const packingListValidator = require("../../../../app/services/validators/packing-list-column-validator");

describe("validatePackingListByIndexAndType", () => {
  test("valid data", () => {
    const packingList = {
      registration_approval_number: "RMS/2024/12345",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "type of treatment",
          commodity_code: "012345",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeTruthy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing remos number", () => {
    const packingList = {
      registration_approval_number: null,
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "type of treatment",
          commodity_code: "012345",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: [],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeFalsy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing commodity code", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing treatment type", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing nature of products", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: null,
          type_of_treatment: "treatment type",
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing description", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: null,
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(1);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing packages", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: null,
          total_net_weight_unit: "KG",
          total_net_weight_kg: 1.2,
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(1);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing net weight", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: null,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(1);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("missing net weight unit", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: 1,
          total_net_weight_unit: null,
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.missingNetWeightUnit.length).toBe(1);
  });

  test("invalid packages", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: "potato",
          total_net_weight_kg: 1.2,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(1);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("invalid net weight", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: "potato",
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.invalidProductCodes.length).toBe(0);
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(1);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });

  test("multiple failures", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: null,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 1,
          },
        },
        {
          description: 12345,
          nature_of_products: null,
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 2,
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 2,
          },
        },
        {
          description: 12345,
          nature_of_products: null,
          type_of_treatment: "Type C",
          commodity_code: "Text",
          number_of_packages: "Text",
          total_net_weight_kg: "Text",
          total_net_weight_unit: "KG",
          row_location: {
            rowNumber: 3,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      establishment_numbers: ["RMS-GB-000000-000"],
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.invalidProductCodes.length).toBe(1);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(1);
    expect(result.invalidPackages.length).toBe(1);
    expect(result.invalidNetWeight.length).toBe(1);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
    expect(result.hasSingleRms).toBeTruthy();
    expect(result.missingNetWeightUnit.length).toBe(0);
  });
});

describe("generateFailuresByIndexAndTypes", () => {
  test("valid data", () => {
    const validationResult = {
      hasAllFields: true,
      hasSingleRms: true,
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeTruthy();
    expect(result.failureReasons).toBeFalsy();
  });

  test("no data", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: true,
      hasSingleRms: true,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toBe("No product line data found.");
  });

  test("missing identifier", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [{ rowNumber: 1 }],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Identifier is missing");
  });

  test("missing description", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [{ rowNumber: 1 }],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Product description is missing");
  });

  test("missing packages", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [{ rowNumber: 1 }],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("No of packages is missing");
  });

  test("missing net weight", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [{ rowNumber: 1 }],
      invalidPackages: [],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Total net weight is missing");
  });

  test("missing net weight unit", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [{ rowNumber: 1 }],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );
    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain(
      "Net Weight Unit of Measure (kg) not found",
    );
  });

  test("invalid packages", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [{ rowNumber: 1 }],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("No of packages is invalid");
  });

  test("invalid net weight", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [{ rowNumber: 1 }],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Total net weight is invalid");
  });

  test("invalid product code", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [{ rowNumber: 1 }],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Product code is invalid");
  });

  test("multiple failures", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      invalidProductCodes: [],
      missingDescription: [{ rowNumber: 1 }, { rowNumber: 2 }],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [{ rowNumber: 1 }],
      hasSingleRms: true,
      missingNetWeightUnit: [],
    };

    const result = packingListValidator.generateFailuresByIndexAndTypes(
      validationResult,
      packingList,
    );

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain(
      "Total net weight is invalid in row 1.\n",
    );
    expect(result.failureReasons).toContain(
      "Product description is missing in rows 1 and 2.\n",
    );
  });
});

describe("generateFailureReasonFromRows", () => {
  test.each([
    ["description", [], ""],
    ["description", [{ rowNumber: 1 }], "description in row 1.\n"],
    [
      "description",
      [{ rowNumber: 1 }, { rowNumber: 2 }],
      "description in rows 1 and 2.\n",
    ],
    [
      "description",
      [{ rowNumber: 1 }, { rowNumber: 2 }, { rowNumber: 3 }],
      "description in rows 1, 2 and 3.\n",
    ],
    [
      "description",
      [{ rowNumber: 1 }, { rowNumber: 2 }, { rowNumber: 3 }, { rowNumber: 4 }],
      "description in rows 1, 2, 3 in addition to 1 other rows.\n",
    ],
    [
      "description",
      [{ rowNumber: 1, sheetName: "Sheet1" }],
      'description in sheet "Sheet1" row 1.\n',
    ],
    [
      "description",
      [
        { rowNumber: 1, sheetName: "Sheet1" },
        { rowNumber: 2, sheetName: "Sheet1" },
      ],
      'description in sheet "Sheet1" row 1 and sheet "Sheet1" row 2.\n',
    ],
    [
      "description",
      [
        { rowNumber: 1, sheetName: "Sheet1" },
        { rowNumber: 2, sheetName: "Sheet1" },
        { rowNumber: 3, sheetName: "Sheet1" },
      ],
      'description in sheet "Sheet1" row 1, sheet "Sheet1" row 2 and sheet "Sheet1" row 3.\n',
    ],
    [
      "description",
      [
        { rowNumber: 1, sheetName: "Sheet1" },
        { rowNumber: 2, sheetName: "Sheet1" },
        { rowNumber: 3, sheetName: "Sheet1" },
        { rowNumber: 4, sheetName: "Sheet1" },
      ],
      'description in sheet "Sheet1" row 1, sheet "Sheet1" row 2, sheet "Sheet1" row 3 in addition to 1 other locations.\n',
    ],
    [
      "description",
      [{ rowNumber: 1, pageNumber: 1 }],
      "description in page 1 row 1.\n",
    ],
    [
      "description",
      [
        { rowNumber: 1, pageNumber: 1 },
        { rowNumber: 2, pageNumber: 2 },
      ],
      "description in page 1 row 1 and page 2 row 2.\n",
    ],
    [
      "description",
      [
        { rowNumber: 1, pageNumber: 1 },
        { rowNumber: 2, pageNumber: 2 },
        { rowNumber: 3, pageNumber: 3 },
      ],
      "description in page 1 row 1, page 2 row 2 and page 3 row 3.\n",
    ],
    [
      "description",
      [
        { rowNumber: 1, pageNumber: 1 },
        { rowNumber: 2, pageNumber: 2 },
        { rowNumber: 3, pageNumber: 3 },
        { rowNumber: 4, pageNumber: 4 },
      ],
      "description in page 1 row 1, page 2 row 2, page 3 row 3 in addition to 1 other locations.\n",
    ],
  ])("generateFailureReasonFromRows", (description, rows, expected) => {
    const result = packingListValidator.generateFailureReasonFromRows(
      description,
      rows,
    );
    expect(result).toBe(expected);
  });
});
