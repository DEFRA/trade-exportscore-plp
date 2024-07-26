const config = require("../config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("./create-message");

async function sendParsed(parsedResult) {
  const message = createMessage(parsedResult);
  const parsedSender = new MessageSender(config.parsedQueue);
  await parsedSender.sendMessage(message);
  await parsedSender.closeConnection();
  console.info("Sent parsed result for: ", parsedResult);
}

module.exports = { sendParsed };
