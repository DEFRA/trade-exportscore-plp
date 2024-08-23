const parser = require("../../../../../../app/services/parsers/bandm/model1/parser");
const model = require("../../../../test-helpers/bandm/model1/data-model");

describe("parseBandMModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(model.emptyTestResult);
  });
});
