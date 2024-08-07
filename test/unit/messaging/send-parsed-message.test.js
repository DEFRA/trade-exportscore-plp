const { sendParsed } = require("../../../app/messaging/send-parsed-message");
const config = require("../../../app/config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("../../../app/messaging/create-message");

jest.mock("../../../app/config");
jest.mock("adp-messaging");
jest.mock("../../../app/messaging/create-message");

describe("sendParsed", () => {
  test("should send a message", async () => {
    // Arrange
    const message = {};
    createMessage.mockReturnValue(message);
    const sendMessage = jest.fn();
    const closeConnection = jest.fn();
    MessageSender.mockImplementation(() => ({ sendMessage, closeConnection }));

    // Act
    await sendParsed(true, "appid");

    // Assert
    expect(createMessage).toHaveBeenCalledWith(true, "appid");
    expect(MessageSender).toHaveBeenCalledWith(config.tpQueue);
    expect(sendMessage).toHaveBeenCalledWith(message);
    expect(closeConnection).toHaveBeenCalledTimes(1);
  });
});
