const ParserModel = require("../../../app/services/parser-model");
const nonai = require("../../../app/routes/non-ai");
const excelToJson = require("@boterop/convert-excel-to-json");
const { findParser } = require("../../../app/services/parser-service");
const { createPackingList } = require("../../../app/packing-list/index");
const logger = require("../../../app/utilities/logger");

// Mocking the necessary modules
jest.mock("@boterop/convert-excel-to-json");
jest.mock("../../../app/services/parser-service"); // Mock the entire parser-service module
jest.mock("../../../app/packing-list"); // Mock the entire packing-list module

describe("/non-ai route handler", () => {
  let mockRequest;
  let mockH;

  // Run this before each test to avoid repetition
  beforeEach(() => {
    mockRequest = {}; // Mock the request object
    mockH = {
      response: jest.fn(() => {
        return {
          code: jest.fn(), // Mock the code function to allow chaining
        };
      }),
    };
    mockRequest.query = { filename: "test" }; // Set up the mock query parameters

    // Mock findParser's default behaviour
    findParser.mockImplementation(() => {
      return {
        parserModel: ParserModel.NISA1, // Simulate a successful match with NISA1 parser
        business_checks: {
          all_required_fields_present: true,
        },
      };
    });

    // Mock createPackingList's default behaviour
    createPackingList.mockImplementation(() => jest.fn()); // Simulate the packing list creation
  });

  // Test case for successful execution
  test("should return success", async () => {
    // Mock excelToJson with successful data return
    excelToJson.mockImplementationOnce(() => {
      return { data: "parsedData" };
    });

    // Call the handler with the mock request and mock response
    await nonai.handler(mockRequest, mockH);

    // Verify that the response function was called
    expect(mockH.response).toHaveBeenCalled();
  });

  // Test case for handling an excelToJson error
  test("should handle excelToJson error", async () => {
    // Mock excelToJson to throw an error
    excelToJson.mockImplementationOnce(() => {
      throw new Error("Excel conversion error"); // Simulate an error during Excel conversion
    });

    // Spy on console.error to check if errors are being logged
    const consoleErrorSpy = jest
      .spyOn(logger, "log_error")
      .mockImplementation(() => {}); // Prevent actual error logging during tests

    // Call the handler with the mock request and mock response
    await nonai.handler(mockRequest, mockH);

    // Verify that the response function was called even when an error occurred
    expect(mockH.response).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Error),
    );

    // Restore the original console.error after the test
    consoleErrorSpy.mockRestore();
  });
});
