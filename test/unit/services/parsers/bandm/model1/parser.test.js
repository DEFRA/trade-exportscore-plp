const parser = require("../../../../../../app/services/parsers/bandm/model1/parser");
const model = require("../../../../test-helpers/bandm/model1/data-model");
const JsonFile = require("../../../../../../app/utilities/json-file");

describe("parseBandMModel1", () => {
  test("parses populated json", () => {
    const packingListJson = JSON.stringify(model.validModel.Sheet1);
    const sanitisedPackingListJson = JsonFile.sanitises(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toEqual(model.validTestResult);
  });

  test("parses empty json", () => {
    const packingListJson = JSON.stringify(model.emptyModel.Sheet1);
    const sanitisedPackingListJson = JsonFile.sanitises(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toEqual(model.emptyTestResult);
  });
});
