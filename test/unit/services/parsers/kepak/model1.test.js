const ParserModel = require("../../../../../app/services/parser-model");
const Parser = require("../../../../../app/services/parsers/kepak/model1");
const model = require("../../../test-data-and-results/models/kepak/model1");
const testResults = require("../../../test-data-and-results/results/kepak/model1");

describe("parseKepakModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = Parser.parse(model.validModel.KEPAK);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel.KEPAK);

    expect(result).toEqual(testResults.emptyModel);
  });
});
module.exports = {};
