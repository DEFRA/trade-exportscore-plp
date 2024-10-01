const parser = require("../../../../../app/services/parsers/davenport/model1");
const model = require("../../../test-data-and-results/models/davenport/model1");
const testResults = require("../../../test-data-and-results/results/davenport/model1");

describe("parseDavenportModel1", () => {
  test("parses json", () => {
    const packingListJson = model.validModel.Customer_Order;

    const result = parser.parse(packingListJson);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
