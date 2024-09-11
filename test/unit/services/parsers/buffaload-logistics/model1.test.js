const Parser = require("../../../../../app/services/parsers/buffaload-logistics/model1");
const ParserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/buffaload-logistics/model1");
const testResults = require("../../../test-data-and-results/results/buffaload-logistics/model1");

describe("parsesBuffaloadLogisticsModel1", () => {
  test("parses valid json", () => {
    const result = Parser.parse(model.validModel.Tabelle1);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = Parser.parse(model.emptyModel.Tabelle1);

    expect(result).toEqual(testResults.emptyModelResult);
  });
});
