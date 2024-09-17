const parser = require("../../../../../app/services/parsers/tescos/model2");
const model = require("../../../test-data-and-results/models/tescos/model2");
const testResults = require("../../../test-data-and-results/results/tescos/model2");

describe("parseTescoModel2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet2);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet2);

    expect(result).toEqual(testResults.emptyTestResult);
  });
});