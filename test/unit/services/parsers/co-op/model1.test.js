const parser = require("../../../../../app/services/parsers/co-op/model1");
const model = require("../../../test-data-and-results/models/co-op/model1");
const testResults = require("../../../test-data-and-results/results/co-op/model1");

describe("parseCoopModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModelMultipleSheets);
    expect(result).toEqual(testResults.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toEqual(testResults.emptyTestResult);
  });
});
