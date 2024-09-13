const parser = require("../../../../../app/services/parsers/nisa/model1");
const model = require("../../../test-data-and-results/models/nisa/model1");
const testResults = require("../../../test-data-and-results/results/nisa/model1");

describe("parseNisa1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = parser.parse(model.validModel["Customer Order"]);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Customer Order"]);

    expect(result).toEqual(testResults.emptyModel);
  });
});
