const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/cds/model1");
const parserModel = require("../../../../../app/services/parser-model");
const testResults = require("../../../test-data-and-results/results/cds/model1");
const logger = require("../../../../../app/utilities/logger");

const trader = "CDS";
const modelNumber = 1;
const traderAndModelNumber = `${trader}-Model-${modelNumber}`;
const filename = `packinglist${traderAndModelNumber}.xls`;

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

  test("returns 'Wrong File Extension' for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };

    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });

  test("should call logger.log_error when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "log_error");

    parserService.findParser(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
