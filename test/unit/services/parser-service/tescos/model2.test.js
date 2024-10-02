const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/tescos/model2");
const testResults = require("../../../test-data-and-results/results/tescos/model2");
const incorrectFileExtension = require("../../../test-data-and-results/results/no-match-for-incorrect-file-extension");
const parserModel = require("../../../../../app/services/parser-model");
const logger = require("../../../../../app/utilities/logger");

const traderAndModelNumber = parserModel.TESCO2;
const filename = `packinglist-${traderAndModelNumber}.xls`;

describe(`parser-service-parses-${traderAndModelNumber}`, () => {
  test(`matches valid ${traderAndModelNumber} file, calls parser and returns all_required_fields_present as true`, () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(testResults.validTestResult);
  });

  test(`matches valid ${traderAndModelNumber} file, calls parser, but returns all_required_fields_present as false when cells missing`, () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(testResults.invalidTestResult_MissingCells);
  });

  test("returns 'No Match' for incorrect file extension", () => {
    const filename = "packinglist.pdf";

    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(incorrectFileExtension.invalidFileExtension);
  });

  test("should call logger.log_error when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "log_error");

    parserService.findParser(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
