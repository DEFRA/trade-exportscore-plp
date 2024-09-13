const Parser = require("../../../../../app/services/parsers/tjmorris/model1");
const model = require("../../../test-data-and-results/models/tjmorris/model1");
const testResults = require("../../../test-data-and-results/results/tjmorris/model1");

describe("parseTjmorrisModel1", () => {
  test("parses valid json", () => {
    const result = Parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
