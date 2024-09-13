const Parser = require("../../../../../app/services/parsers/nutricia/model1");
const model = require("../../../test-data-and-results/models/nutricia/model1");
const testResults = require("../../../test-data-and-results/results/nutricia/model1");

describe("parseNutricaModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = Parser.parse(model.validModel.DANONE);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel.DANONE);

    expect(result).toEqual(testResults.emptyModel);
  });
});
module.exports = {};
