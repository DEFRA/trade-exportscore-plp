const parser = require("../../../../../app/services/parsers/sainsburys/model1");
const model = require("../../../test-data-and-results/models/sainsburys/model1");
const test_results = require("../../../test-data-and-results/results/sainsburys/model1");

describe("parseSainsburysModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(test_results.emptyTestResult);
  });
});
