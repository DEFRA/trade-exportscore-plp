const Parser = require("../../../../../app/services/parsers/giovanni/model1");
const ParserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/giovanni/model1");
const testResults = require("../../../test-data-and-results/results/giovanni/model1");

describe("parseGiovanniModel1", () => {
  test("parses json", () => {
    const result = Parser.parse(model.validModel);
    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = Parser.parse(model.validModelMultipleSheets);
    expect(result).toEqual(testResults.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel);
    expect(result).toEqual(testResults.emptyTestResult);
  });
});
