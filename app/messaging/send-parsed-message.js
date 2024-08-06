const config = require("../config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("./create-message");

async function sendParsed(parsedResult, applicationId) {
  const message = createMessage(parsedResult, applicationId);
  const parsedSender = new MessageSender(config.tpQueue);
  await parsedSender.sendMessage(message);
  await parsedSender.closeConnection();
  console.info(
    `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
  );
}

module.exports = { sendParsed };
