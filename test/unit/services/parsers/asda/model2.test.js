const parser = require("../../../../../app/services/parsers/asda/model2");
const model = require("../../../test-data-and-results/models/asda/model2");
const testResults = require("../../../test-data-and-results/results/asda/model2");

describe("parseAsdaModel2", () => {
  test("parses valid Model 2 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(testResults.emptyModel);
  });
});
