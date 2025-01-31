const parser = require("../../../../../app/services/parsers/savers/model1");
const model = require("../../../test-data-and-results/models/savers/model1");
const test_results = require("../../../test-data-and-results/results/savers/model1");

describe("parse a packing list using the SAVERS1 parser", () => {
  test.each([
    [model.validModel, test_results.validTestResult],
    [model.validHeadersNoData, test_results.emptyTestResult],
    [model.invalidModel_MissingHeaders, test_results.failedTestResult],
  ])("parses model", (testModel, expected) => {
    const result = parser.parse(testModel);

    expect(result).toMatchObject(expected);
  });
});
