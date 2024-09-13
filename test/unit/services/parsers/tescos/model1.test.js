const parser = require("../../../../../app/services/parsers/tescos/model1");
const model = require("../../../test-data-and-results/models/tescos/model1");
const testResults = require("../../../test-data-and-results/results/tescos/model1");

describe("parseTescoModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel["Input Data Sheet"]);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Input Data Sheet"]);

    expect(result).toEqual(testResults.emptyModel);
  });
});
