const parser = require("../../../../../../app/services/parsers/asda/model2/parser");

const model = require("../../../../test-helpers/asda/model2/data-model");

describe("parseAsdaModel2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(model.emptyTestResult);
  });
});
