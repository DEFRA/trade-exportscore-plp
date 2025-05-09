const path = require("path");
const getDispatch = require("../../../app/routes/get-dispatch-location");
const mockResponse = { response: 200, code: 200 };

jest.mock("../../../app/services/dynamics-service");

const {
  getDispatchLocation,
} = require("../../../app/services/dynamics-service");

getDispatchLocation.mockImplementation(() => {
  return mockResponse;
});
const mockApplicationId = 123;

const mockHandler = {
  response: jest.fn(() => ({
    code: jest.fn(() => 200),
  })),
};

console.error = jest.fn();

describe("get dispatch location", () => {
  afterAll(async () => {
    jest.resetAllMocks();
  });

  test("should not call the getDispatchLocation when application id is not specified", async () => {
    const mockHandler = {
      response: jest.fn(() => ({
        code: jest.fn((code) => code),
      })),
    };

    const response = await getDispatch.options.handler({}, mockHandler);

    expect(getDispatchLocation).not.toHaveBeenCalled();
    expect(response).toBe(503);
  });

  test("should log the exception when an error occurs", async () => {
    await getDispatch.options.handler({}, mockHandler);

    expect(getDispatchLocation).not.toHaveBeenCalled();
    const filePath = path.join("app", "routes", "get-dispatch-location.js");
    expect(console.error.mock.calls[0][0]).toBe(
      `Whilst running the 'get()' method in '${filePath}', the PLP application encounterd: TypeError: Cannot read properties of undefined (reading 'applicationId')`,
    );
  });

  test("should perform the getDispatchLocation when application id is specified", async () => {
    const response = await getDispatch.options.handler(
      { query: { applicationId: mockApplicationId } },
      mockHandler,
    );

    expect(response).toBe(200);
    expect(getDispatchLocation).toHaveBeenCalledWith(mockApplicationId);
  });
});
