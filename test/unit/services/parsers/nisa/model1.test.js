const parser = require("../../../../../app/services/parsers/nisa/model1");
const model = require("../../../test-helpers/nisa/model1/data-model");

describe("parseNisa1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel["Customer Order"]);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Customer Order"]);

    expect(result).toEqual(model.emptyTestResult);
  });
});
