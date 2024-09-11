const parser = require("../../../../../app/services/parsers/nisa/model3");
const model = require("../../../test-helpers/models/nisa/model3/model3");

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
