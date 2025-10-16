const ParserModel = require("../../../app/services/parser-model");
const pdfNonAi = require("../../../app/routes/pdf-non-ai");
const { findParser } = require("../../../app/services/parser-service");
const logger = require("../../../app/utilities/logger");
const fs = require("node:fs");

// Mocking the necessary modules
jest.mock("../../../app/services/parser-service"); // Mock the entire parser-service module
jest.mock("../../../app/packing-list"); // Mock the entire packing-list module

describe("/pdf-non-ai route handler", () => {
  let mockRequest;
  let mockH;

  beforeEach(() => {
    mockRequest = {};
    mockH = {
      response: jest.fn(() => {
        return {
          code: jest.fn(), // Mock the code function to allow chaining
        };
      }),
    };
    mockRequest.query = { filename: "test" };
  });

  // Test case for successful execution
  test("should return success", async () => {
    // Mock readFileSync with successful data return
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return "parsedData";
    });

    findParser.mockImplementationOnce(() => {
      return {
        parserModel: ParserModel.ICELAND1, // Simulate a successful match with NISA1 parser
        business_checks: {
          all_required_fields_present: true,
        },
      };
    });

    // Call the handler with the mock request and mock response
    await pdfNonAi.handler(mockRequest, mockH);

    // Verify that the response function was called
    expect(mockH.response).toHaveBeenCalled();
  });

  // Test case for not parsed
  test("should return no match", async () => {
    // Mock readFileSync with successful data return
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return "parsedData";
    });

    findParser.mockImplementationOnce(() => {
      return {
        parserModel: ParserModel.NOMATCH, // Simulate a successful match with NISA1 parser
        business_checks: {
          all_required_fields_present: false,
        },
      };
    });

    // Call the handler with the mock request and mock response
    await pdfNonAi.handler(mockRequest, mockH);

    // Verify that the response function was called
    expect(mockH.response).toHaveBeenCalled();
  });

  // Test case for handling an readFileSync error
  test("should handle readFileSync error", async () => {
    // Mock readFileSync to throw an error
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      throw new Error("Read file error"); // Simulate an error during read file
    });

    // Spy on console.error to check if errors are being logged
    const consoleErrorSpy = jest
      .spyOn(logger, "logError")
      .mockImplementation(() => {}); // Prevent actual error logging during tests

    // Call the handler with the mock request and mock response
    await pdfNonAi.handler(mockRequest, mockH);

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
