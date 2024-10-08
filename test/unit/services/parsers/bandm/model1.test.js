const parser = require("../../../../../app/services/parsers/bandm/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/bandm/model1");
const json_file = require("../../../../../app/utilities/json-file");
const test_results = require("../../../test-data-and-results/results/bandm/model1");

describe("parseBandMModel1", () => {
  test("parses populated json", () => {
    const packingListJson = JSON.stringify(model.validModel);
    const sanitisedPackingListJson = json_file.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const packingListJson = JSON.stringify(model.validModelMultipleSheets);
    const sanitisedPackingListJson = json_file.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);
    const result = parser.parse(sanitisedPackingList);
    expect(result).toEqual(test_results.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const packingListJson = JSON.stringify(model.emptyModel);
    const sanitisedPackingListJson = json_file.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toEqual(test_results.emptyTestResult);
  });

  test("should call logger.log_error when an error is thrown", () => {
    // Spy on the log_error method
    const logErrorSpy = jest.spyOn(logger, "log_error");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.log_error has been called
    expect(logErrorSpy).toHaveBeenCalled();
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
