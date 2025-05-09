const dynamicsService = require("../../../app/services/dynamics-service");

jest.mock("../../../app/config", () => {
  return {
    dynamicsConfig: {
      bearerTokenRequest: {
        url: "test",
        grantType: "grant type",
        clientId: "test id",
        clientSecret: "test secret",
      },
      dynamicsUrl: "123",
    },
  };
});

describe("bearerTokenRequest", () => {
  test("returns token", async () => {
    // arrange
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ access_token: "abc" }),
      }),
    );

    // act
    const result = await dynamicsService.bearerTokenRequest();

    // assert
    expect(result).toBe("abc");
  });

  test("returns error", async () => {
    // arrange
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
      }),
    );

    // act
    const result = await dynamicsService.bearerTokenRequest();

    // assert
    expect(result).toBe("Response status: 400");
  });
});

describe("make a request", () => {
  test("getDispatchLocation", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "abc" }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ rms_remosid: "RMS-GB-000000-000" }),
        }),
      );

    const applicationId = 123;

    const res = await dynamicsService.getDispatchLocation(applicationId);

    expect(res).toBe("RMS-GB-000000-000");
  });

  test("getDispatchLocation fail", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "abc" }),
        }),
      )
      .mockImplementationOnce(() => {
        throw new Error("error");
      });

    const applicationId = 123;

    await expect(
      dynamicsService.getDispatchLocation(applicationId),
    ).rejects.toThrow();
  });
});
