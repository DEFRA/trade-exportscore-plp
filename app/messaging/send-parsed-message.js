/**
 * Send parsed/approval messages to the TP queue
 *
 * Two sending paths are supported:
 *  - `sendParsedAdp()` uses the in-house `adp-messaging` helper which
 *    encapsulates connection management.
 *  - `sendParsed()` uses `@azure/service-bus` directly and supports
 *    managed identity authentication (DefaultAzureCredential).
 */

const config = require("../config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("./create-message");
const { ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Send parsed message using adp-messaging helper.
 * @param {boolean} parsedResult - Whether parsing succeeded
 * @param {string} applicationId - Application identifier
 * @returns {Promise<void>}
 */
async function sendParsedAdp(parsedResult, applicationId) {
  try {
    const message = createMessage(parsedResult, applicationId);
    const parsedSender = new MessageSender(config.tpQueue);
    await parsedSender.sendMessage(message);
    await parsedSender.closeConnection();
    logger.logInfo(
      filenameForLogging,
      "sendParsedAdp()",
      `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "sendParsedAdp()", err);
  }
}

/**
 * Send parsed message using Azure Service Bus SDK with managed identity.
 * @param {string} applicationId - Application identifier
 * @param {boolean} parsedResult - Whether parsing succeeded
 * @param {Array|null} failureReason - Failure reasons when parsing failed
 * @returns {Promise<void>}
 */
async function sendParsed(applicationId, parsedResult, failureReason) {
  try {
    if (config.tpQueue.managedIdentityClientId) {
      const credential = new DefaultAzureCredential({
        managedIdentityClientId: config.tpQueue.managedIdentityClientId,
        tenantId: config.tpQueue.tenantId,
      });

      const sbClient = new ServiceBusClient(config.tpQueue.host, credential);
      const sender = sbClient.createSender(config.tpQueue.address);

      const message = createMessage(parsedResult, applicationId, failureReason);

      try {
        await sender.sendMessages(message);
        logger.logInfo(
          filenameForLogging,
          "sendParsed()",
          `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
        );
        await sender.close();
      } catch (err) {
        logger.logError(
          filenameForLogging,
          "sendParsed() > sender.sendMessages",
          err,
        );
      } finally {
        await sbClient.close();
      }
    } else {
      logger.logError(
        filenameForLogging,
        "sendParsed() > sender.sendMessages",
        "Service Bus connection to TP has not been initialised because 'config.tpQueue.managedIdentityClientId' is missing.",
      );
    }
  } catch (err) {
    logger.logError(filenameForLogging, "sendParsed()", err);
  }
}

module.exports = { sendParsed, sendParsedAdp };
