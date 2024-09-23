const parser = require("../../../../../app/services/parsers/asda/model1");
const model = require("../../../test-data-and-results/models/asda/model1");
const test_results = require("../../../test-data-and-results/results/asda/model1");

describe("parseAsdaModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(test_results.emptyTestResult);
  });
});
