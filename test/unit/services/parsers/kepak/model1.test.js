const ParserModel = require("../../../../../app/services/parser-model");
const Parser = require("../../../../../app/services/parsers/kepak/model1");
const model = require("../../../test-data-and-results/models/kepak/model1");
const testResults = require("../../../test-data-and-results/results/kepak/model1");

describe("parseKepakModel1", () => {
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

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
module.exports = {};
