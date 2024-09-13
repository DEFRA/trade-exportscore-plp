const Parser = require("../../../../../app/services/parsers/davenport/model1");
const model = require("../../../test-data-and-results/models/davenport/model1");
const testResults = require("../../../test-data-and-results/results/davenport/model1");

describe("parseDavenportModel1", () => {
  test("matches valid Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const packingListJson = model.validModel.Customer_Order;

    const result = Parser.parse(packingListJson);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyModel);
  });
});
