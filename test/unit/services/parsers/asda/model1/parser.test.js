const parser = require("../../../../../../app/services/parsers/asda/model1/model1");

const model = require("../../../../test-helpers/asda/model1/data-model");

describe("parseAsdaModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(model.emptyTestResult);
  });
});
