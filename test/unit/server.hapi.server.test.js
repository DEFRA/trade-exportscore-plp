const createServer = require("../../app/server");
const hapi = require("@hapi/hapi");
const logger = require("../../app/utilities/logger");

const consoleErrorSpy = jest
  .spyOn(logger, "log_error")
  .mockImplementation(() => {});

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

jest.mock("@hapi/hapi", () => ({
  server: jest.fn(),
}));

console.error = jest.fn();

describe("cresteServer", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });

  test("should log the exception when an error occurs when configuring the hapi server", async () => {
    hapi.server.mockImplementation(() => {
      throw new Error();
    });

    await createServer();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Error),
    );
  });
});
