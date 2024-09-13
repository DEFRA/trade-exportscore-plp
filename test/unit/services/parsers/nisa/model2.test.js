const parser = require("../../../../../app/services/parsers/nisa/model2");
const model = require("../../../test-data-and-results/models/nisa/model2");
const testResults = require("../../../test-data-and-results/results/nisa/model2");

describe("parseNisa2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel["Customer Order"]);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Customer Order"]);

    expect(result).toEqual(testResults.emptyTestResult);
  });
});
