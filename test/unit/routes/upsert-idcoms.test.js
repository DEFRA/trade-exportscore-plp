const upsertIdcoms = require("../../../app/routes/upsert-idcoms");
const mockResponse = { response: 200, code: 200 };

jest.mock("../../../app/services/dynamics-service");
jest.mock("../../../app/messaging/send-parsed-message");

const {
  patchPackingListCheck,
} = require("../../../app/services/dynamics-service");

patchPackingListCheck.mockImplementation(() => {
  return mockResponse;
});

const { sendParsed } = require("../../../app/messaging/send-parsed-message");

const mockApplicationId = 123;

const mockHandler = {
  response: jest.fn(() => ({
    code: jest.fn(() => 200),
  })),
};

console.error = jest.fn();

jest.mock("../../../app/config", () => {
  return {
    ...jest.requireActual("../../../app/config"),
    get isDynamicsIntegration() {
      return mockIsDynamicsIntegration;
    },
  };
});

let mockIsDynamicsIntegration = true;

describe("upsert idcoms", () => {
  afterAll(async () => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    mockIsDynamicsIntegration = true;
  });

  test("should not call the upsert when application id is not specified", async () => {
    const mockHandler = {};

    await upsertIdcoms.options.handler({}, mockHandler);

    expect(patchPackingListCheck).not.toHaveBeenCalled();
  });

  test("should log the exception when an error occurs", async () => {
    await upsertIdcoms.options.handler({}, mockHandler);

    expect(patchPackingListCheck).not.toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toBe(
      "Whilst running the 'get()' method in 'app/routes/upsert-idcoms.js', the PLP application encounterd: TypeError: Cannot read properties of undefined (reading 'applicationId')",
    );
  });

  test("should perform the upsert when application id is specified and isApproved is true", async () => {
    const response = await upsertIdcoms.options.handler(
      { query: { applicationId: mockApplicationId, isApproved: true } },
      mockHandler,
    );

    expect(response).toBe(200);
    expect(patchPackingListCheck).toHaveBeenCalledWith(mockApplicationId, true);
  });

  test("should perform the upsert when application id is specified and isApproved is false", async () => {
    await upsertIdcoms.options.handler(
      { query: { applicationId: mockApplicationId, isApproved: false } },
      mockHandler,
    );

    expect(patchPackingListCheck).toHaveBeenCalledWith(
      mockApplicationId,
      false,
    );
  });

  test("should call sendParsed when isDynamicsIntegration is false", async () => {
    mockIsDynamicsIntegration = false;
    const response = await upsertIdcoms.options.handler(
      { query: { applicationId: mockApplicationId, isApproved: true } },
      mockHandler,
    );

    expect(response).toBe(200);
    expect(sendParsed).toHaveBeenCalledWith(mockApplicationId, true);
  });
});
