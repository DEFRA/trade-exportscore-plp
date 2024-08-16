const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-helpers/asda/model2/data-model");
const filename = "packinglist-asda-model2.xls";

describe("matchesAsdaModel2", () => {
  test("returns isParsed as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Asda Model 2 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Asda Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(model.invalidModel_MissingColumnCells, filename,);

    expect(result).toEqual(model.invalidTestResult_MissingCells);
const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xls";
const packingListJson = {
  Sheet1: [
    {
      B: "[Description Of All Retail Go",
      D: "[Nature Of Product]",
      F: "[Treatment Ty",
      H: "Establishment Number",
      J: "Cases",
      L: "Case Weight",
      N: "NET Weight",
    },
    {
      H: "RMS-GB-000015-010",
    },
  ],
};

describe("matchesAsdaModel2", () => {
  test("matches valid Asda Model 2 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000015-010",
      parserModel: ParserModel.ASDA2,
    });
  });
});
