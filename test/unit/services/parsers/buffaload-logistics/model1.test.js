const parser = require("../../../../../app/services/parsers/buffaload-logistics/model1");
const model = require("../../../test-data-and-results/models/buffaload-logistics/model1");
const test_results = require("../../../test-data-and-results/results/buffaload-logistics/model1");

describe("parsesBuffaloadLogisticsModel1", () => {
  test("parses valid json", () => {
    const result = parser.parse(model.validModel.Tabelle1);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Tabelle1);

    expect(result).toEqual(test_results.emptyModelResult);
  });
});
