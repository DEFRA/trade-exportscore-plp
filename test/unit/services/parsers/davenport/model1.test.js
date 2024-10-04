const Parser = require("../../../../../app/services/parsers/davenport/model1");
const model = require("../../../test-data-and-results/models/davenport/model1");
const testResults = require("../../../test-data-and-results/results/davenport/model1");

describe("parseDavenportModel1", () => {
  test("parses json", () => {
    const packingListJson = model.validModel;

    const result = Parser.parse(packingListJson);

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
