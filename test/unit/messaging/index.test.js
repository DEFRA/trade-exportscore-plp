const { start, stop } = require("../../../app/messaging/index");
const processPlpMessage = require("../../../app/messaging/process-plp-message");
const { MessageReceiver } = require("adp-messaging");

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

jest.mock("../../../app/config", () => {
  return {
    plpSubscription: {
      name: "name",
      address: "address",
      topic: "topic",
      type: "subscription",
    },
  };
});

describe("messaging module", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    MessageReceiver.mockClear();
    processPlpMessage.mockClear();
  });

  test("start should create a new MessageReceiver and subscribe", async () => {
    await start();
    expect(MessageReceiver).toHaveBeenCalledTimes(1);
    expect(MessageReceiver.mock.results[0].value.subscribe).toHaveBeenCalled();
  });

  test("stop should close connection", async () => {
    await start();
    await stop();
    expect(
      MessageReceiver.mock.results[0].value.closeConnection,
    ).toHaveBeenCalledTimes(1);
  });
});
