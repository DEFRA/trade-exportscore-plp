const parser = require("../../../../../../app/services/parsers/nisa/model3");
const model = require("../../../../test-helpers/nisa/model3/data-model");

describe("parseNisa3", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.sheet);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.sheet);

    expect(result).toEqual(model.emptyTestResult);
  });
});
