const parser = require("../../../../../../app/services/parsers/tescos/model1/model1");
const model = require("../../../../test-helpers/tescos/model1/data-model");

describe("parseTescoModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel["Input Data Sheet"]);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Input Data Sheet"]);

    expect(result).toEqual(model.emptyTestResult);
  });
});
