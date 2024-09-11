const parser = require("../../../../../app/services/parsers/bandm/model1");
const model = require("../../../test-helpers/models/bandm/model1/data-model");
const JsonFile = require("../../../../../app/utilities/json-file");

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

describe("isEndOfRow", () => {
  test("returns true for undefined", () => {
    const row = {
      F: "end",
      G: "of",
      H: "file",
    };

    const result = parser.isEndOfRow(row);

    expect(result).toBeTruthy();
  });

  test("returns true for null", () => {
    const row = {
      A: null,
      B: null,
      C: null,
      D: null,
      E: null,
      F: "end",
      G: "of",
      H: "file",
    };

    const result = parser.isEndOfRow(row);

    expect(result).toBeTruthy();
  });

  test("returns false for data", () => {
    const row = {
      A: "not",
      F: "end",
      G: "of",
      H: "file",
    };

    const result = parser.isEndOfRow(row);

    expect(result).toBeFalsy();
  });
});
