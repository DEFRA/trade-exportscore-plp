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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeTruthy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeFalsy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(1);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(1);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(1);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(1);
    expect(result.invalidNetWeight.length).toBe(0);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(0);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(0);
    expect(result.invalidPackages.length).toBe(0);
    expect(result.invalidNetWeight.length).toBe(1);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
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
        },
        {
          description: 12345,
          nature_of_products: null,
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 2,
        },
        {
          description: 12345,
          nature_of_products: null,
          type_of_treatment: "Type C",
          commodity_code: "Text",
          number_of_packages: "Text",
          total_net_weight_kg: "Text",
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result =
      packingListValidator.validatePackingListByIndexAndType(packingList);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.missingIdentifier.length).toBe(1);
    expect(result.missingDescription.length).toBe(0);
    expect(result.missingPackages.length).toBe(0);
    expect(result.missingNetWeight.length).toBe(1);
    expect(result.invalidPackages.length).toBe(1);
    expect(result.invalidNetWeight.length).toBe(1);
    expect(result.hasRemos).toBeTruthy();
    expect(result.isEmpty).toBeFalsy();
  });
});

describe("generateFailuresByIndexAndTypes", () => {
  test("valid data", () => {
    const validationResult = {
      hasAllFields: true,
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeTruthy();
    expect(result.failureReasons).toBeFalsy();
  });

  test("no data", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: true,
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toBe("No product line data found.");
  });

  test("missing identifier", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [1],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Identifier is missing");
  });

  test("missing description", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      missingDescription: [1],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Product description is missing");
  });

  test("missing packages", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      missingDescription: [],
      missingPackages: [1],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("No of packages is missing");
  });

  test("missing net weight", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [1],
      invalidPackages: [],
      invalidNetWeight: [],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Total net weight is missing");
  });

  test("invalid packages", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [1],
      invalidNetWeight: [],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("No of packages is invalid");
  });

  test("invalid net weight", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      missingDescription: [],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [1],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

    expect(result.hasAllFields).toBeFalsy();
    expect(result.failureReasons).toContain("Total net weight is invalid");
  });

  test("multiple failures", () => {
    const validationResult = {
      hasAllFields: false,
      isEmpty: false,
      missingIdentifier: [],
      missingDescription: [1, 2],
      missingPackages: [],
      missingNetWeight: [],
      invalidPackages: [],
      invalidNetWeight: [1],
    };

    const result =
      packingListValidator.generateFailuresByIndexAndTypes(validationResult);

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
    ["description", [1], "description in row 1.\n"],
    ["description", [1, 2], "description in rows 1 and 2.\n"],
    ["description", [1, 2, 3], "description in rows 1, 2 and 3.\n"],
    [
      "description",
      [1, 2, 3, 4],
      "description in rows 1, 2, 3 in addition to 1 other rows.\n",
    ],
  ])("generateFailureReasonFromRows", (description, rows, expected) => {
    const result = packingListValidator.generateFailureReasonFromRows(
      description,
      rows,
    );
    expect(result).toBe(expected);
  });
});
