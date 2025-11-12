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
