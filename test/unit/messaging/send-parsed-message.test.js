const {
  sendParsedAdp,
  sendParsed,
} = require("../../../app/messaging/send-parsed-message");
const config = require("../../../app/config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("../../../app/messaging/create-message");
const { ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

jest.mock("adp-messaging");
jest.mock("../../../app/messaging/create-message");
jest.mock("@azure/identity");

jest.mock("../../../app/config", () => {
  return {
    tpQueue: {
      managedIdentityClientId: "123",
    },
  };
});

jest.mock("@azure/service-bus", () => {
  return {
    ServiceBusClient: jest.fn().mockImplementation(() => {
      return {
        createSender: jest.fn().mockImplementation(() => {
          return {
            sendMessages: mockSendMessages,
            close: mockClose,
          };
        }),
        close: mockSbClose,
      };
    }),
  };
});

let mockSendMessages = jest.fn();
let mockClose = jest.fn();
let mockSbClose = jest.fn();

describe("sendParsedAdp", () => {
  test("should send a message", async () => {
    // Arrange
    const message = {};
    createMessage.mockReturnValue(message);
    const sendMessage = jest.fn();
    const closeConnection = jest.fn();
    MessageSender.mockImplementation(() => ({ sendMessage, closeConnection }));

    // Act
    await sendParsedAdp(true, "appid");

    // Assert
    expect(createMessage).toHaveBeenCalledWith(true, "appid");
    expect(MessageSender).toHaveBeenCalledWith(config.tpQueue);
    expect(sendMessage).toHaveBeenCalledWith(message);
    expect(closeConnection).toHaveBeenCalledTimes(1);
  });
});

describe("sendParsed", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send message", async () => {
    // arrange
    const message = {};
    createMessage.mockReturnValue(message);

    // act
    await sendParsed(true, "123");

    //assert
    expect(createMessage).toHaveBeenCalledWith("123", true);
    expect(DefaultAzureCredential).toHaveBeenCalledTimes(1);
    expect(ServiceBusClient).toHaveBeenCalledTimes(1);
    expect(mockSendMessages).toHaveBeenCalledTimes(1);
    expect(mockSbClose).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test("should error", async () => {
    // arrange
    const message = {};
    createMessage.mockReturnValue(message);
    mockSendMessages.mockImplementationOnce(new Error());

    // act
    await sendParsed(true, "123");

    //assert
    expect(createMessage).toHaveBeenCalledWith("123", true);
    expect(DefaultAzureCredential).toHaveBeenCalledTimes(1);
    expect(ServiceBusClient).toHaveBeenCalledTimes(1);
    expect(mockSendMessages).toHaveBeenCalledTimes(1);
    expect(mockSbClose).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(0);
  });
});
