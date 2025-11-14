const parser = require("../../../../../app/services/parsers/turners/model1");
const model = require("../../../test-data-and-results/models/turners/model1");
const test_results = require("../../../test-data-and-results/results/turners/model1");

describe("parse a packing list using the TURNERS1 parser", () => {
  test.each([
    [model.validModel, test_results.validTestResult],
    [
      model.validModelMultipleSheets,
      test_results.validTestResultForMultipleSheets,
    ],
    [model.validHeadersNoData, test_results.emptyTestResult],
  ])("parses model", (testModel, expected) => {
    const result = parser.parse(testModel);

    expect(result).toMatchObject(expected);
  });
});

describe("turners model1 - isHeaderRow function", () => {
  const {
    isHeaderRow,
  } = require("../../../../../app/services/parsers/turners/model1");

  test.each([
    [
      true,
      "all headers match their patterns",
      {
        description: "Description of Goods",
        commodity_code: "Commodity code",
        number_of_packages: "No. of pkgs",
        total_net_weight_kg: "Item Net Weight",
        nature_of_products: "Nature of Product",
        type_of_treatment: "Type of Treatment",
      },
    ],
    [
      true,
      "headers match with case variations",
      {
        description: "DESCRIPTION OF GOODS",
        commodity_code: "commodity code",
        number_of_packages: "no. of pkgs",
        total_net_weight_kg: "item net weight",
        nature_of_products: "nature of product",
        type_of_treatment: "type of treatment",
      },
    ],
    [
      false,
      "one header doesn't match pattern",
      {
        description: "Description of Goods",
        commodity_code: "Invalid Header",
        number_of_packages: "No. of pkgs",
        total_net_weight_kg: "Item Net Weight",
        nature_of_products: "Nature of Product",
        type_of_treatment: "Type of Treatment",
      },
    ],
    [
      false,
      "multiple headers don't match patterns",
      {
        description: "Wrong Description",
        commodity_code: "Wrong Code",
        number_of_packages: "No. of pkgs",
        total_net_weight_kg: "Item Net Weight",
        nature_of_products: "Nature of Product",
        type_of_treatment: "Type of Treatment",
      },
    ],
    [
      false,
      "missing required properties",
      {
        description: "Description of Goods",
        commodity_code: "Commodity code",
        // missing other required fields
      },
    ],
    [false, "empty item object", {}],
    [
      false,
      "item with null values",
      {
        description: null,
        commodity_code: null,
        number_of_packages: null,
        total_net_weight_kg: null,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    [
      false,
      "item with undefined values",
      {
        description: undefined,
        commodity_code: undefined,
        number_of_packages: undefined,
        total_net_weight_kg: undefined,
        nature_of_products: undefined,
        type_of_treatment: undefined,
      },
    ],
  ])("returns %s when %s", (expected, _desc, item) => {
    const result = isHeaderRow(item);
    expect(result).toBe(expected);
  });

  test("handles non-string values gracefully", () => {
    const itemWithNumbers = {
      description: 123,
      commodity_code: "Commodity code",
      number_of_packages: "No. of pkgs",
      total_net_weight_kg: "Item Net Weight",
      nature_of_products: "Nature of Product",
      type_of_treatment: "Type of Treatment",
    };

    // Test that it doesn't throw an error when regex.test() is called on non-string values
    expect(() => {
      isHeaderRow(itemWithNumbers);
    }).not.toThrow();

    // Non-string description should not match the regex pattern
    expect(isHeaderRow(itemWithNumbers)).toBe(false);
  });

  test("validates with actual TURNERS1 header patterns", () => {
    const headers = require("../../../../../app/services/model-headers");

    // Test with the actual regex patterns from TURNERS1 headers
    const actualHeaderItem = {
      description: "Description of Goods",
      commodity_code: "Commodity code",
      number_of_packages: "No. of pkgs",
      total_net_weight_kg: "Item Net Weight",
      nature_of_products: "Nature of Product",
      type_of_treatment: "Type of Treatment",
    };

    // Verify the function returns true for valid headers
    expect(isHeaderRow(actualHeaderItem)).toBe(true);

    // Verify each pattern matches manually for documentation
    Object.entries(headers.TURNERS1.regex).forEach(([key, pattern]) => {
      expect(pattern.test(actualHeaderItem[key])).toBe(true);
    });
  });
});
