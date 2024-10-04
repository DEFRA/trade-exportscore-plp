const Parser = require("../../../../../app/services/parsers/tjmorris/model1");
const model = require("../../../test-data-and-results/models/tjmorris/model1");
const testResults = require("../../../test-data-and-results/results/tjmorris/model1");

describe("parseTjmorrisModel1", () => {
  test("parses valid json", () => {
    const result = Parser.parse(model.validModel);

    expect(result).toEqual(testResults.validTestResult);
  });
  test("parses multiple sheets", () => {
    const result = Parser.parse(model.validModelMultipleSheets);
    expect(result).toEqual(testResults.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel);

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
