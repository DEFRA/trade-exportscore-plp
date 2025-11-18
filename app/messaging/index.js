/**
 * Messaging bootstrap
 *
 * Starts and stops the PLP message receiver used to read incoming PLP
 * messages from the Service Bus subscription. The `start()` function binds
 * `processPlpMessage` as the handler for each incoming message and ensures
 * the receiver is only created when a subscription name is present in the
 * configuration (useful for local development where Service Bus may be
 * disabled).
 */

const config = require("../config");
const processPlpMessage = require("./process-plp-message");
const { MessageReceiver } = require("adp-messaging");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

let plpReceiver;

/**
 * Start the PLP message receiver and subscribe to incoming messages.
 * @returns {Promise<void>}
 */
async function start() {
  try {
    if (config.plpSubscription.name) {
      const plpAction = (message) => processPlpMessage(message, plpReceiver);
      plpReceiver = new MessageReceiver(config.plpSubscription, plpAction);

      await plpReceiver.subscribe();

      logger.logInfo(
        filenameForLogging,
        "start()",
        "Ready to receive messages",
      );
    } else {
      logger.logError(
        filenameForLogging,
        "start()",
        "Service Bus connection has not been initialised because 'config.plpSubscription.name' is missing.",
      );
    }
  } catch (err) {
    logger.logError(filenameForLogging, "start()", err);
  }
}

/**
 * Stop the PLP message receiver and close connections.
 * @returns {Promise<void>}
 */
async function stop() {
  try {
    if (config.plpSubscription.name) {
      logger.logInfo(
        filenameForLogging,
        "stop()",
        "Stopped receiving messages",
      );
      await plpReceiver.closeConnection();
    }
  } catch (err) {
    logger.logError(filenameForLogging, "stop()", err);
  }
}

module.exports = { start, stop };
