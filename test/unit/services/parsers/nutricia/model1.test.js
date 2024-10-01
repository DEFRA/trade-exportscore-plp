const parser = require("../../../../../app/services/parsers/nutricia/model1");
const model = require("../../../test-data-and-results/models/nutricia/model1");
const testResults = require("../../../test-data-and-results/results/nutricia/model1");

describe("parseNutricaModel1", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel.DANONE);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.DANONE);

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
module.exports = {};
