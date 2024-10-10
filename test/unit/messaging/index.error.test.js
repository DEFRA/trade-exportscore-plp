const { start, stop } = require("../../../app/messaging/index");
const processPlpMessage = require("../../../app/messaging/process-plp-message");
const { MessageReceiver } = require("adp-messaging");
const logger = require("../../../app/utilities/logger");
const config = require("../../../app/config");

jest.mock("adp-messaging", () => {
  return {
    MessageReceiver: jest.fn().mockImplementation(() => {
      return {
        subscribe: jest.fn(),
        closeConnection: jest.fn(),
      };
    }),
  };
});

jest.mock("../../../app/messaging/process-plp-message", () => jest.fn());

const console_error_spy = jest
  .spyOn(logger, "logError")
  .mockImplementation(() => {});
const console_info_spy = jest
  .spyOn(logger, "log_info")
  .mockImplementation(() => {});

describe("messaging module", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    MessageReceiver.mockClear();
    processPlpMessage.mockClear();
  });

  afterEach(() => {
    console_error_spy.mockRestore();
    console_info_spy.mockRestore();
  });

  test("should log error message when config.plpSubscription.name is not set", async () => {
    console.log(config);
    config.plpSubscription.name = undefined;
    await start();

    expect(console_error_spy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      "Service Bus connection has not been initialised because 'config.plpSubscription.name' is missing.",
    );
  });
});
