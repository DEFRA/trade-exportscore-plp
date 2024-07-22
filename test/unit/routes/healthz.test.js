const health = require("../../../app/routes/healthz");

describe("health route", () => {
  test("should return 200 when handler is called", async () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
    };

    await health.options.handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith("ok");
    expect(mockH.code).toHaveBeenCalledWith(200);
  });
});
