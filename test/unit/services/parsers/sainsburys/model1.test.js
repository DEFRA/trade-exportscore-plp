const parser = require("../../../../../app/services/parsers/sainsburys/model1");
const model = require("../../../test-data-and-results/models/sainsburys/model1");
const testResults = require("../../../test-data-and-results/results/sainsburys/model1");

describe("parseSainsburysModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(testResults.emptyModel);
  });
});
