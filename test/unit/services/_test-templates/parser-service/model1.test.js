const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model1"); // Update as required
const testResults = require("../../../test-data-and-results/results/asda/model1"); // Update as required
const incorrectFileExtension = require("../../../test-data-and-results/results/no-match-for-incorrect-file-extension");
const parserModel = require("../../../../../app/services/parser-model");
const logger = require("../../../../../app/utilities/logger");

const traderAndModelNumber = parserModel.ASDA1; // Update as required
const filename = `packinglist-${traderAndModelNumber}.xls`;

describe(`parser-service-parses-${traderAndModelNumber}`, () => {
  test(`matches valid ${traderAndModelNumber} file, calls parser and returns all_required_fields_present as true`, async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(testResults.validTestResultParserService);
  });

  test(`matches valid ${traderAndModelNumber} file, calls parser, but returns all_required_fields_present as false when cells missing`, async () => {
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toMatchObject(testResults.invalidTestResult_MissingCells);
  });

  test("returns 'No Match' for incorrect file extension", async () => {
    const filename = "packinglist.wrong";

    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(incorrectFileExtension.invalidFileExtension);
  });

  test("should call logger.logError when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "logError");

    parserService.findParser(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
