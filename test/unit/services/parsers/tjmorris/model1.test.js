const parser = require("../../../../../app/services/parsers/tjmorris/model1");
const model = require("../../../test-data-and-results/models/tjmorris/model1");
const test_results = require("../../../test-data-and-results/results/tjmorris/model1");

describe("parseTjmorrisModel1", () => {
  test("parses valid json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(test_results.emptyModelResult);
  });
});
