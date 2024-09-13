const parser = require("../../../../../app/services/parsers/nisa/model3");
const model = require("../../../test-data-and-results/models/nisa/model3");
const testResults = require("../../../test-data-and-results/results/nisa/model3");

describe("parseNisa3", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.sheet);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.sheet);

    expect(result).toEqual(testResults.emptyTestResult);
  });
});
