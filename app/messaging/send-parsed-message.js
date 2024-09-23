const config = require("../config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("./create-message");
const { ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("./../utilities/logger");

async function sendParsedAdp(parsedResult, applicationId) {
  try {
    const message = createMessage(parsedResult, applicationId);
    const parsedSender = new MessageSender(config.tpQueue);
    await parsedSender.sendMessage(message);
    await parsedSender.closeConnection();
    console.info(
      `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
    );
  } catch (err) {
    logger.log_error(
      "messaging > send-parsed-message.js",
      "sendParsedAdp()",
      err,
    );
  }
}

async function sendParsed(applicationId, parsedResult) {
  try {
    if (config.tpQueue.managedIdentityClientId) {
      const credential = new DefaultAzureCredential({
        managedIdentityClientId: config.tpQueue.managedIdentityClientId,
        tenantId: config.tpQueue.tenantId,
      });

      const sbClient = new ServiceBusClient(config.tpQueue.host, credential);
      const sender = sbClient.createSender(config.tpQueue.address);

      const message = createMessage(parsedResult, applicationId);

      try {
        await sender.sendMessages(message);
        console.info(
          `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
        );
        await sender.close();
      } catch (err) {
        logger.log_error(
          "messaging > send-parsed-message.js",
          "sendParsed() > sender.sendMessages",
          err,
        );
      } finally {
        await sbClient.close();
      }
    } else {
      logger.log_error(
        "messaging > send-parsed-message.js",
        "sendParsed() > sender.sendMessages",
        "Service Bus connection to TP has not been initialised because 'config.tpQueue.managedIdentityClientId' is missing.",
      );
    }
  } catch (err) {
    logger.log_error("messaging > send-parsed-message.js", "sendParsed()", err);
  }
}

module.exports = { sendParsed, sendParsedAdp };
