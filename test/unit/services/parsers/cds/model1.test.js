const parser = require("../../../../../app/services/parsers/cds/model1");
const model = require("../../../test-data-and-results/models/cds/model1");
const testResults = require("../../../test-data-and-results/results/cds/model1");

describe("parseCdsModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyModel);
  });
});
