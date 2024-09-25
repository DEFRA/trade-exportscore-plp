const { sequelize } = require("../../app/services/database-service");
const createServer = require("../../app/server");
const hapi = require("@hapi/hapi");

jest.mock("../../app/services/database-service", () => ({
  sequelize: {
    authenticate: jest.fn(),
  },
}));

jest.mock("../../app/messaging", () => ({
  start: jest.fn(),
}));

jest.mock("../../app/config", () => ({
  isDev: true,
}));

console.error = jest.fn();

describe("cresteServer", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });

  test("should create server", async () => {
    sequelize.authenticate.mockResolvedValue();

    const result = await createServer();

    expect(result.registrations.router).toBeDefined();
    expect(result.registrations.blipp).toBeDefined();
  });

  test("should log the exception when an error occurs when authenticating to sequelize", async () => {
    sequelize.authenticate.mockImplementation(() => {
      throw new Error();
    });

    await createServer();

    expect(console.error.mock.calls[0][0]).toBe(
      "Whilst running the 'createServer > sequelize.authenticate()' method in 'app/server.js', the PLP application encounterd: Error",
    );
  });

  // test("should log the exception when an error occurs when configuring the hapi server", async () => {
  //   jest.mock("@hapi/hapi", () => ({
  //     server: jest.fn(),
  //   }));

  //   hapi.server.mockImplementation(() => {
  //     throw new Error();
  //   });

  //   await createServer();

  //   expect(console.error.mock.calls[0][0]).toBe(
  //     "Whilst running the 'createServer > hapi.server()' method in 'app/server.js', the PLP application encounterd: Error",
  //   );
  // });
});
