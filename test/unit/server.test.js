const { sequelize } = require("../../app/services/database-service");
const createServer = require("../../app/server");
const logger = require("../../app/utilities/logger");
const { start } = require("../../app/messaging");

const consoleErrorSpy = jest
  .spyOn(logger, "logError")
  .mockImplementation(() => {});

jest.mock("../../app/services/database-service", () => ({
  sequelize: {
    authenticate: jest.fn(),
  },
}));

jest.mock("../../app/messaging", () => ({
  start: jest.fn(),
  stop: jest.fn(),
}));

jest.mock("../../app/config", () => ({
  isDev: true,
}));

describe("createServer", () => {
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

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Error),
    );
  });

  test("should log the exception when an error occurs when starting the messaging server", async () => {
    start.mockImplementation(() => {
      throw new Error();
    });

    await createServer();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      "createServer > messageService.start()",
      expect.any(Error),
    );
  });
});
