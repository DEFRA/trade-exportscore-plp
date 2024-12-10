const parser = require("../../../../../app/services/parsers/boots/model1");
const model = require("../../../test-data-and-results/models/boots/model1");
const test_results = require("../../../test-data-and-results/results/boots/model1");

describe("parse a packing list using the BOOTS1 parser", () => {
    test.each([
        [model.validModel, test_results.validTestResult],
        [model.validModel_MissingFooter, test_results.validTestResult],
        [model.validHeadersNoData, test_results.emptyTestResult],
        [model.invalidModel_MissingHeaders, test_results.failedTestResult],
      ])("parses model", (testModel, expected) => {
        const result = parser.parse(testModel);
    
        expect(result).toEqual(expected);
      });
});
