const Parser = require("../../../../../app/services/parsers/tescos/model3");
const model = require("../../../test-data-and-results/models/tescos/model3");
const testResults = require("../../../test-data-and-results/results/tescos/model3");

describe("parseTescoModel3", () => {
  test("parses valid json", () => {
    const result = Parser.parse(model.validModel["Input Data Sheet"]);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel["Input Data Sheet"]);

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
