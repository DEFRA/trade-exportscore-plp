const parser = require("../../../../../app/services/parsers/sainsburys/model1");
const model = require("../../../test-helpers/models/sainsburys/model1/model1");

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
