const parser = require("../../../../../app/services/parsers/tescos/model2");
const model = require("../../../test-helpers/models/tescos/model2/model2");

describe("parseTescoModel2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet2);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet2);

    expect(result).toEqual(model.emptyTestResult);
  });
});
