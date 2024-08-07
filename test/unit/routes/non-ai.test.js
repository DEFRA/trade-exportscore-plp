const nonai = require("../../../app/routes/non-ai");
jest.mock("convert-excel-to-json");

describe("/non-ai", () => {
  test("should return success", async () => {
    const mockRequest = {};
    const mockH = {
      response: jest.fn(() => {
        return {
          code: jest.fn(),
        };
      }),
    };
    mockRequest.query = "?filename=test";

    await nonai.handler(mockRequest, mockH);

    expect(mockH.response).toHaveBeenCalled();
  });
});
