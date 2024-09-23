const parser = require("../../../../../app/services/parsers/kepak/model1");
const model = require("../../../test-data-and-results/models/kepak/model1");
const test_results = require("../../../test-data-and-results/results/kepak/model1");

describe("parseKepakModel1", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel.KEPAK);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.KEPAK);

    expect(result).toEqual(test_results.emptyModelResult);
  });
});
module.exports = {};
