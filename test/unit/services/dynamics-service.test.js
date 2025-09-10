const dynamicsService = require("../../../app/services/dynamics-service");
const logger = require("../../../app/utilities/logger");

jest.mock("../../../app/config", () => {
  return {
    dynamicsConfig: {
      bearerTokenRequest: {
        url: "test",
        grantType: "grant type",
        clientId: "test id",
        clientSecret: "test secret",
        resource: "test resource",
      },
      dynamicsUrl: "123",
    },
  };
});

jest.mock("../../../app/utilities/logger");

describe("bearerTokenRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns token successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ access_token: "abc" }),
        text: () => Promise.resolve(""),
      }),
    );

    const result = await dynamicsService.bearerTokenRequest();

    expect(result).toBe("abc");
    expect(fetch).toHaveBeenCalledWith("test", {
      method: "POST",
      body: expect.any(URLSearchParams),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  });

  test("throws error when response not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Bad Request"),
      }),
    );

    await expect(dynamicsService.bearerTokenRequest()).rejects.toThrow(
      "Bearer token request failed - Status: 400, Response: Bad Request",
    );
    expect(logger.logError).toHaveBeenCalled();
  });

  test("throws error when no access token in response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(""),
      }),
    );

    await expect(dynamicsService.bearerTokenRequest()).rejects.toThrow(
      "No access token in response",
    );
    expect(logger.logError).toHaveBeenCalled();
  });

  test("throws error when fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    await expect(dynamicsService.bearerTokenRequest()).rejects.toThrow(
      "Network error",
    );
    expect(logger.logError).toHaveBeenCalled();
  });
});

describe("getDispatchLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns rms_remosid successfully", async () => {
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
    const result = await dynamicsService.getDispatchLocation(applicationId);

    expect(result).toBe("RMS-GB-000000-000");
  });

  test("returns null when bearer token request fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Unauthorized"),
      }),
    );

    const applicationId = 123;
    const resultPromise = dynamicsService.getDispatchLocation(applicationId);

    // Fast-forward all timers to handle retry delays
    await jest.runAllTimersAsync();

    const result = await resultPromise;

    expect(result).toBeNull();
    expect(logger.logError).toHaveBeenCalled();
  });

  test("retries on HTTP error and succeeds", async () => {
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
          ok: false,
          status: 500,
          text: () => Promise.resolve("Internal Server Error"),
        }),
      )
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
    const resultPromise = dynamicsService.getDispatchLocation(applicationId);

    // Fast-forward all timers to handle retry delays
    await jest.runAllTimersAsync();

    const result = await resultPromise;

    expect(result).toBe("RMS-GB-000000-000");
    expect(logger.logInfo).toHaveBeenCalledWith(
      expect.any(String),
      "getDispatchLocation()",
      "Successfully retrieved record for 123 after 2 attempts",
    );
  });

  test("returns null after max retries exceeded", async () => {
    global.fetch = jest
      .fn()
      // First bearer token request (succeeds)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "abc" }),
        }),
      )
      // First API call (fails)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve("Internal Server Error"),
        }),
      )
      // Second bearer token request (succeeds)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "abc" }),
        }),
      )
      // Second API call (fails - final attempt)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve("Internal Server Error"),
        }),
      );

    const applicationId = 123;
    const resultPromise = dynamicsService.getDispatchLocation(
      applicationId,
      2,
      100,
    );

    // Fast-forward all timers to handle retry delays
    await jest.runAllTimersAsync();

    const result = await resultPromise;

    expect(result).toBeNull();
    expect(logger.logError).toHaveBeenCalledWith(
      expect.any(String),
      "getDispatchLocation()",
      "Final attempt failed - HTTP 500: Internal Server Error",
    );
  });

  test("handles network error and retries", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "abc" }),
        }),
      )
      .mockImplementationOnce(() => Promise.reject(new Error("Network error")))
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
    const resultPromise = dynamicsService.getDispatchLocation(applicationId);

    await jest.runAllTimersAsync();

    const result = await resultPromise;

    expect(result).toBe("RMS-GB-000000-000");
  });

  test("returns null when all attempts fail with network error", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error("Network error")));

    const applicationId = 123;
    const resultPromise = dynamicsService.getDispatchLocation(
      applicationId,
      2,
      100,
    );

    await jest.runAllTimersAsync();

    const result = await resultPromise;

    expect(result).toBeNull();
    expect(logger.logError).toHaveBeenCalledWith(
      expect.any(String),
      "getDispatchLocation()",
      "Final attempt failed with error: Network error",
    );
  });

  test("uses custom retry parameters", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Server Error"),
      }),
    );

    const applicationId = 123;
    const maxRetries = 1;
    const retryDelayMs = 500;

    const result = await dynamicsService.getDispatchLocation(
      applicationId,
      maxRetries,
      retryDelayMs,
    );

    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});