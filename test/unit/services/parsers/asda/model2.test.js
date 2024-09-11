const parser = require("../../../../../app/services/parsers/asda/model2");
const model = require("../../../test-data-and-results/models/asda/model2");
const testResults = require("../../../test-data-and-results/results/asda/model2");

describe("parseAsdaModel2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(testResults.emptyTestResult);
  });
});
