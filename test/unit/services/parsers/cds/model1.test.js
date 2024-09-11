const parser = require("../../../../../app/services/parsers/cds/model1");
const model = require("../../../test-data-and-results/models/cds/model1");
const testResults = require("../../../test-data-and-results/results/cds/model1");

describe("parseCdsModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyTestResult);
  });
});
