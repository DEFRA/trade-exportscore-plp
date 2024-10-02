const ParserModel = require("../../../app/services/parser-model");
const ai = require("../../../app/routes/ai");
const { findParser } = require("../../../app/services/parser-service");
const { createPackingList } = require("../../../app/packing-list/index");
const logger = require("../../../app/utilities/logger");
const fs = require("fs");

// Mocking the necessary modules
jest.mock("fs");
jest.mock("../../../app/services/parser-service"); // Mock the entire parser-service module
jest.mock("../../../app/packing-list"); // Mock the entire packing-list module

describe("/ai route handler", () => {
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

    // Mock findParser's default behaviour
    findParser.mockImplementation(() => {
      return {
        parserModel: ParserModel.ICELAND1, // Simulate a successful match with NISA1 parser
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
    // Mock readFileSync with successful data return
    fs.readFileSync.mockImplementationOnce(() => {
      return "parsedData";
    });

    // Call the handler with the mock request and mock response
    await ai.handler(mockRequest, mockH);

    // Verify that the response function was called
    expect(mockH.response).toHaveBeenCalled();
  });

  // Test case for handling an readFileSync error
  test("should handle readFileSync error", async () => {
    // Mock readFileSync to throw an error
    fs.readFileSync.mockImplementationOnce(() => {
      throw new Error("Read file error"); // Simulate an error during read file
    });

    // Spy on console.error to check if errors are being logged
    const consoleErrorSpy = jest
      .spyOn(logger, "log_error")
      .mockImplementation(() => {}); // Prevent actual error logging during tests

    // Call the handler with the mock request and mock response
    await ai.handler(mockRequest, mockH);

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
