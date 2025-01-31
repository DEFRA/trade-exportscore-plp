const parser = require("../../../../../app/services/parsers/booker/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/booker/model1");
const test_results = require("../../../test-data-and-results/results/booker/model1");

describe("parseBooker", () => {
  test.each([
    [model.validModel, test_results.validTestResult],
    [model.emptyModel, test_results.emptyTestResult],
  ])("parses model", (testModel, expected) => {
    const result = parser.parse(testModel);

    expect(result).toMatchObject(expected);
  });

  test("should call logger.logError when an error is thrown", () => {
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});

describe("transformPackingList", () => {
  test.each([
    [model.validModel, "1"],
    [model.invalidModel_MissingColumnCells, null],
  ])("transforms boxes", (testModel, expected) => {
    const result = parser.transformPackingList(testModel);

    expect(
      result.fields.PackingListContents.values[0].properties.Boxes.value,
    ).toBe(expected);
  });
});
