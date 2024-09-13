const parser = require("../../../../../app/services/parsers/asda/model1");
const model = require("../../../test-data-and-results/models/asda/model1");
const testResults = require("../../../test-data-and-results/results/asda/model1");

describe("parseAsdaModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyModel);
  });
});
