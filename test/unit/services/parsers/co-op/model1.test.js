const parser = require("../../../../../app/services/parsers/co-op/model1");
const model = require("../../../test-data-and-results/models/co-op/model1");

describe("parseCoopModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel["Input Packing Sheet"]);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Input Packing Sheet"]);

    expect(result).toEqual(model.emptyTestResult);
  });
});
