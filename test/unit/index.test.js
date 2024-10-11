jest.mock("../../app/services/app-insights");
jest.mock("../../app/server");
const appInsights = require("../../app/services/app-insights");
const createServer = require("../../app/server");

describe("Server setup", () => {
  let mockExit;
  let mockConsoleLog;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
  });

  test("should setup app insights and start the server", async () => {
    const mockStart = jest.fn();
    createServer.mockResolvedValue({ start: mockStart });

    require("../../app/index");

    expect(appInsights.setup).toHaveBeenCalled();
    expect(createServer).toHaveBeenCalled();
  });

  test("should log error and exit process when server start fails", async () => {
    const error = new Error("Server start failed");
    require("../../app/index");

    const mockStart = jest.fn().mockRejectedValue(error);

    createServer.mockResolvedValue({ start: mockStart });
  });
});
