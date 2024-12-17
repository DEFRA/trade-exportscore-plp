const {
  hasMissingDescription,
  hasMissingIdentifier,
  hasMissingNetWeight,
  hasMissingPackages,
  wrongTypeForPackages,
  wrongTypeNetWeight,
  removeBadData,
  removeEmptyItems,
} = require("../../../../app/services/validators/packing-list-validator-utilities");

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
    ["", false]
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
