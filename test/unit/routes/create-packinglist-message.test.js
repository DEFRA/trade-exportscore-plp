const createPackinglistMessage = require("../../../app/routes/create-packinglist-message");
const excelToJson = require("@boterop/convert-excel-to-json");
const { parsePackingList } = require("../../../app/services/parser-service");
const logger = require("../../../app/utilities/logger");

jest.mock("@boterop/convert-excel-to-json");
jest.mock("../../../app/services/parser-service");

describe("Tests for Route", () => {
  test("Successful request", async () => {
    excelToJson.mockImplementationOnce(() => {
      return { data: "parsedData" };
    });

    parsePackingList.mockImplementationOnce(() => {
      return {
        business_checks: {
          all_required_fields_present: true,
        },
      };
    });

    const mockH = {
      response: jest.fn((x) => {
        return {
          ...x,
          code: jest.fn((x) => x),
        };
      }),
    };
    const mockRequest = {
      query: {
        filename: "test",
        applicationId: "123",
      },
    };
    const res = await createPackinglistMessage.options.handler(
      mockRequest,
      mockH,
    );

    expect(mockH.response).toHaveBeenCalled();
    expect(res).toBe(200);
    const message = mockH.response.mock.results[0].value;
    expect(message.body.applicationId).toBe("123");
    expect(message.body.approvalStatus).toBe("approved");
  });

  test("should handle excelToJson error", async () => {
    // Mock excelToJson to throw an error
    excelToJson.mockImplementationOnce(() => {
      throw new Error("Excel conversion error"); // Simulate an error during Excel conversion
    });

    // Spy on console.error to check if errors are being logged
    const consoleErrorSpy = jest
      .spyOn(logger, "logError")
      .mockImplementation(() => {}); // Prevent actual error logging during tests

    // Call the handler with the mock request and mock response
    const mockRequest = {
      query: {
        filename: "test",
        applicationId: 123,
      },
    };
    const mockH = {
      response: jest.fn(() => {
        return {
          code: jest.fn(), // Mock the code function to allow chaining
        };
      }),
    };

    await createPackinglistMessage.options.handler(mockRequest, mockH);

    // Verify that the response function was called even when an error occurred
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Error),
    );

    // Restore the original console.error after the test
    consoleErrorSpy.mockRestore();
  });
});
