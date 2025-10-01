const csvNonAi = require("../../../app/routes/csv-non-ai");
const config = require("../../../app/config");
const { convertCsvToJson } = require("../../../app/utilities/csv-utility");
const logger = require("../../../app/utilities/logger");
const { findParser } = require("../../../app/services/parser-service");
const { createPackingList } = require("../../../app/packing-list");

jest.mock("../../../app/utilities/csv-utility");
jest.mock("../../../app/config");
jest.mock("../../../app/utilities/logger");
jest.mock("../../../app/services/parser-service");
jest.mock("../../../app/packing-list");

describe("/csv-non-ai route handler", () => {
  let mockRequest;
  let mockH;

  beforeEach(() => {
    mockRequest = {};
    mockH = {
      response: jest.fn(() => ({ code: jest.fn() })),
    };

    // default config plDir
    config.plDir = "some/path/";

    mockRequest.query = { filename: "test.csv", dispatchlocation: "LOC" };

    // default convertCsvToJson behavior (processCsvFile wraps this)
    convertCsvToJson.mockImplementation(() => ({ items: [] }));

    // mock findParser and createPackingList to avoid heavy processing
    findParser.mockImplementation(async () => ({ parserModel: null }));
    createPackingList.mockImplementation(async () => {});
  });

  test("should return success and call processCsvFile with filename and dispatchlocation", async () => {
    await csvNonAi.handler(mockRequest, mockH);

    // processCsvFile uses convertCsvToJson internally; ensure convertCsvToJson was invoked by the file-processor
    expect(convertCsvToJson).toHaveBeenCalledWith(
      config.plDir + mockRequest.query.filename,
    );

    // processCsvFile returns the value returned by findParser (mocked above)
    expect(mockH.response).toHaveBeenCalledWith({ parserModel: null });
  });

  test("should handle processCsvFile error and still call response and log error", async () => {
    const err = new Error("CSV processing failed");
    // Make convertCsvToJson throw so processCsvFile catches and logs the error
    convertCsvToJson.mockImplementationOnce(() => {
      throw err;
    });

    const logErrorSpy = jest
      .spyOn(logger, "logError")
      .mockImplementation(() => {});

    await csvNonAi.handler(mockRequest, mockH);

    expect(mockH.response).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("processCsvFile"),
      expect.any(Error),
    );

    logErrorSpy.mockRestore();
  });
});
