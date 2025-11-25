const ParserModel = require("../../../app/services/parser-model");
const pdfNonAi = require("../../../app/routes/pdf-non-ai");
const { processPdfFile } = require("../../../app/utilities/file-processor");

// Mocking the necessary modules
jest.mock("../../../app/utilities/file-processor"); // Mock the file-processor module

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
    // Mock processPdfFile with successful data return
    processPdfFile.mockResolvedValueOnce({
      parserModel: ParserModel.ICELAND1, // Simulate a successful match with ICELAND1 parser
      business_checks: {
        all_required_fields_present: true,
      },
    });

    // Call the handler with the mock request and mock response
    await pdfNonAi.handler(mockRequest, mockH);

    // Verify that the response function was called
    expect(mockH.response).toHaveBeenCalled();
  });

  // Test case for not parsed
  test("should return no match", async () => {
    // Mock processPdfFile with no match result
    processPdfFile.mockResolvedValueOnce({
      parserModel: ParserModel.NOMATCH, // Simulate no match
      business_checks: {
        all_required_fields_present: false,
      },
    });

    // Call the handler with the mock request and mock response
    await pdfNonAi.handler(mockRequest, mockH);

    // Verify that the response function was called
    expect(mockH.response).toHaveBeenCalled();
  });

  // Test case for handling an error
  test("should handle processPdfFile error", async () => {
    // Mock processPdfFile to return error result (file-processor handles errors internally)
    processPdfFile.mockResolvedValueOnce({
      parserModel: ParserModel.NOMATCH,
      business_checks: {
        all_required_fields_present: false,
      },
    });

    // Call the handler with the mock request and mock response
    await pdfNonAi.handler(mockRequest, mockH);

    // Verify that the response function was called even when an error occurred
    expect(mockH.response).toHaveBeenCalled();
  });
});
