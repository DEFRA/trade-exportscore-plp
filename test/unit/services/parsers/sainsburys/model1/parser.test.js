const parser = require("../../../../../../app/services/parsers/sainsburys/model1/model1");
const model = require("../../../../test-helpers/sainsburys/model1/data-model");

describe("parseSainsburysModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(model.emptyTestResult);
  });
});
