const parser = require("../../../../../app/services/parsers/tescos/model2");
const model = require("../../../test-data-and-results/models/tescos/model2");
const testResults = require("../../../test-data-and-results/results/tescos/model2");

describe("parseTescoModel2", () => {
  test("parses valid Model 2 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel.Sheet2);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet2);

    expect(result).toEqual(testResults.emptyModel);
  });
});
