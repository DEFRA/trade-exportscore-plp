const {
  hasMissingDescription,
  hasInvalidProductCode,
  hasMissingIdentifier,
  hasMissingNetWeight,
  hasMissingPackages,
  hasMissingNirms,
  hasInvalidNirms,
  hasMissingCoO,
  hasInvalidCoO,
  hasProhibitedItems,
  wrongTypeForPackages,
  wrongTypeNetWeight,
  removeBadData,
  removeEmptyItems,
} = require("../../../../app/services/validators/packing-list-validator-utilities");

jest.mock("../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
]);
jest.mock("../../../../app/services/data/data-prohibited-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "PROHIBITED_ITEM_COMMODITY_1",
    type_of_treatment: "PROHIBITED_ITEM_TREATMENT",
  },
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "PROHIBITED_ITEM_COMMODITY_2",
  },
]);

describe("validator function tests", () => {
  test.each([
    ["Pc", null, null, false],
    [null, "np", "tt", false],
    [null, null, null, true],
    [null, "np", null, true],
    [null, null, "tp", true],
  ])(
    "hasMissingIdentifier",
    (commodity_code, nature_of_products, type_of_treatment, expected) => {
      const item = { commodity_code, nature_of_products, type_of_treatment };
      expect(hasMissingIdentifier(item)).toBe(expected);
    },
  );

  test.each([
    [undefined, false],
    [null, false],
    ["text", true],
    ["1d1", true],
    ["1 1d1", true],
    ["0123", false],
    [" 12 3 ", false],
    [123, false],
  ])("hasInvalidProductCode", (commodity_code, expected) => {
    expect(hasInvalidProductCode({ commodity_code })).toBe(expected);
  });

  test.each([
    ["a description", false],
    [null, true],
  ])("hasMissingDescription", (description, expected) => {
    const item = { description };
    expect(hasMissingDescription(item)).toBe(expected);
  });

  test.each([
    [1, false],
    ["a string", false],
    [null, true],
  ])("hasMissingNetWeight", (total_net_weight_kg, expected) => {
    const item = { total_net_weight_kg };
    expect(hasMissingNetWeight(item)).toBe(expected);
  });

  test.each([
    [1, false],
    ["a string", false],
    [null, true],
  ])("hasMissingDescription", (number_of_packages, expected) => {
    const item = { number_of_packages };
    expect(hasMissingPackages(item)).toBe(expected);
  });

  test.each([
    [1, false],
    ["1", false],
    ["a string", true],
    [null, false],
    ["", false],
  ])("wrongTypeNetWeight", (total_net_weight_kg, expected) => {
    const item = { total_net_weight_kg };
    expect(wrongTypeNetWeight(item)).toBe(expected);
  });

  test.each([
    [1, false],
    ["1", false],
    ["a string", true],
    [null, false],
  ])("wrongTypeForPackages", (number_of_packages, expected) => {
    const item = { number_of_packages };
    expect(wrongTypeForPackages(item)).toBe(expected);
  });

  test.each([
    [null, true], // Null value
    ["", true], // Empty value
    ["NIRMS", false], // Value
  ])("hasMissingNirms", (nirms, expected) => {
    const item = { nirms };
    expect(hasMissingNirms(item)).toBe(expected);
  });

  test.each([
    ["INVALID ", true], // Invalid Value
    ["ni rms", true], // Invalid Value
    [1, true], // No string value
    ["Yes", false], // Valid Value
    ["NIRMS", false], // Valid Value
    ["Green", false], // Valid Value
    ["Y", false], // Valid Value
    ["G", false], // Valid Value
    ["No", false], // Valid Value
    ["Non-NIRMS", false], // Valid Value
    ["Non NIRMS", false], // Valid Value
    ["Red", false], // Valid Value
    ["N", false], // Valid Value
    ["R", false], // Valid Value
    ["nirms", false], // Case insensitive
    ["", false], // Empty value should be handled by hasMissingNirms
  ])("hasInvalidNirms", (nirms, expected) => {
    const item = { nirms };
    expect(hasInvalidNirms(item)).toBe(expected);
  });

  test.each([
    ["NIRMS", null, true], // Nirms, missing value
    ["NON-NIRMS", null, false], // Non-NIRMS, missing value
    ["NIRMS", "VALID_ISO", false], // Nirms, valid value
  ])("hasMissingCoO", (nirms, country_of_origin, expected) => {
    const item = { nirms, country_of_origin };
    expect(hasMissingCoO(item)).toBe(expected);
  });

  test.each([
    ["NIRMS", "INVALID_ISO", true], // Nirms, invalid value
    ["NIRMS", "VALID_ISO PROHIBITED_ITEM_ISO", true], // Nirms, Multiple ISO codes not comma separated
    ["NIRMS", "VALID_ISO, INVALID_ISO", true], // Nirms, Multiple ISO codes comma separated, one invalid
    ["NON-NIRMS", null, false], // Non-NIRMS, missing value, should be handled by hasMissingCoO
    ["NIRMS", "VALID_ISO", false], // Nirms, valid value
    ["NIRMS", "X", false], // Nirms, Specific 'X' value, should be ignored
    ["NIRMS", "x", false], // Nirms, Specific 'x' value, should be ignored
    ["NIRMS", "VALID_ISO, PROHIBITED_ITEM_ISO", false], // Nirms, Multiple ISO codes comma separated
  ])("hasInvalidCoO", (nirms, country_of_origin, expected) => {
    const item = { nirms, country_of_origin };
    expect(hasInvalidCoO(item)).toBe(expected);
  });

  test.each([
    [
      "NIRMS",
      "PROHIBITED_ITEM_ISO",
      "PROHIBITED_ITEM_COMMODITY_1",
      "PROHIBITED_ITEM_TREATMENT",
      true,
    ], // Exact matching value with treatment type
    [
      "NIRMS",
      "VALID_ISO, PROHIBITED_ITEM_ISO",
      "PROHIBITED_ITEM_COMMODITY_1",
      "PROHIBITED_ITEM_TREATMENT",
      true,
    ], // Matching value with multiple countries of origin
    [
      "NIRMS",
      "PROHIBITED_ITEM_ISO",
      "PROHIBITED_ITEM_COMMODITY_1_EXTRA",
      "PROHIBITED_ITEM_TREATMENT",
      true,
    ], // Matching value with longer commodity code that starts with value in prohibited item list
    [
      "nirms",
      "prohibited_item_iso",
      "prohibited_item_commodity_1",
      "prohibited_item_treatment",
      true,
    ], // Exact matching value with treatment type case insensitive
    ["NIRMS", "PROHIBITED_ITEM_ISO", "PROHIBITED_ITEM_COMMODITY_1", null, true], // no treatment type specified in packing list, treatment type specified in prohibited item list
    ["NIRMS", "PROHIBITED_ITEM_ISO", "PROHIBITED_ITEM_COMMODITY_2", null, true], // Exact matching value without treatment type specified in prohibited item list
    [
      "NIRMS",
      "PROHIBITED_ITEM_ISO",
      "PROHIBITED_ITEM_COMMODITY_2",
      "PROHIBITED_ITEM_TREATMENT",
      true,
    ], // Matching value with optional treatment type
    [
      "NON-NIRMS",
      "PROHIBITED_ITEM_ISO",
      "PROHIBITED_ITEM_COMMODITY_1",
      "PROHIBITED_ITEM_TREATMENT",
      false,
    ], // NON NIRMS entry
    [
      "NIRMS",
      "PROHIBITED_ITEM_ISO",
      "PROHIBITED_ITEM_COMMODITY_1",
      "VALID_TREATMENT",
      false,
    ], // Value not matching
  ])(
    "hasProhibitedItems",
    (nirms, country_of_origin, commodity_code, type_of_treatment, expected) => {
      const item = {
        nirms,
        country_of_origin,
        commodity_code,
        type_of_treatment,
      };
      expect(hasProhibitedItems(item)).toBe(expected);
    },
  );
});

describe("removeBadData", () => {
  test("Number of pkgs and total net weight are both NaN", () => {
    const packingList = {
      registration_approval_number: "RMS-GB-000022-999",
      items: [
        {
          description: 1234,
          nature_of_products: null,
          type_of_treatment: "Type C",
          commodity_code: "Text",
          number_of_packages: "Text",
          total_net_weight_kg: "Text",
        },
      ],
      business_checks: {
        all_required_fields_present: false,
      },
    };

    const result = removeBadData(packingList.items);

    expect(result[0].number_of_packages).toBeNull();
    expect(result[0].total_net_weight_kg).toBeNull();
  });

  test("Number of pkgs and total net weight are both numbers", () => {
    const packingList = {
      registration_approval_number: "RMS-GB-000022-998",
      items: [
        {
          description: "CONTIGO AUTO-POP BOTTLE 720ML",
          nature_of_products: null,
          type_of_treatment: "Ambient",
          commodity_code: "9617000000",
          number_of_packages: 1,
          total_net_weight_kg: 1.4155,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = removeBadData(packingList.items);

    expect(result[0].number_of_packages).toBe(1);
    expect(result[0].total_net_weight_kg).toBe(1.4155);
  });
});

describe("removeEmptyItems", () => {
  test("return true for length greater than 0", () => {
    const packingList = {
      registration_approval_number: "RMS-GB-000022-999",
      items: [
        {
          description: 1234,
          nature_of_products: null,
          type_of_treatment: "Type C",
          commodity_code: "Text",
          number_of_packages: "Text",
          total_net_weight_kg: "Text",
        },
      ],
      business_checks: {
        all_required_fields_present: false,
      },
    };

    const result = removeEmptyItems(packingList.items);

    expect(result.length).toBe(1);
  });

  test("return empty for null item", () => {
    const packingList = {
      registration_approval_number: "RMS-GB-000022-999",
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
        all_required_fields_present: false,
      },
    };

    const result = removeEmptyItems(packingList.items);

    expect(result.length).toBe(0);
  });

  test("return empty for null item with row_location", () => {
    const packingList = {
      registration_approval_number: "RMS-GB-000022-999",
      items: [
        {
          description: null,
          nature_of_products: null,
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: null,
          total_net_weight_kg: null,
          row_location: {
            rowNumber: 1,
          },
        },
      ],
      business_checks: {
        all_required_fields_present: false,
      },
    };

    const result = removeEmptyItems(packingList.items);

    expect(result.length).toBe(0);
  });

  test("multiple items", () => {
    const packingList = {
      registration_approval_number: "RMS-GB-000022-999",
      items: [
        {
          description: 1234,
          nature_of_products: null,
          type_of_treatment: "Type C",
          commodity_code: "Text",
          number_of_packages: "Text",
          total_net_weight_kg: "Text",
        },
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
        all_required_fields_present: false,
      },
    };

    const result = removeEmptyItems(packingList.items);

    expect(result.length).toBe(1);
  });
});
