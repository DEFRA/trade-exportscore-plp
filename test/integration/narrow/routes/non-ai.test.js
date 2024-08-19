const createServer = require("../../../../app/server");

describe("Non-ai test", () => {
  let server;

  beforeEach(async () => {
    server = await createServer();
    await server.initialize();
  });

  test("GET /non-ai route returns 200", async () => {
    const options = {
      method: "GET",
      url: "/non-ai?filename=abc&isApproved=true",
    };

    const response = await server.inject(options);
    expect(response.statusCode).toBe(200);
  });

  afterEach(async () => {
    await server.stop();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await server.stop();
  });
});
