const config = require("../config");
const processPlpMessage = require("./process-plp-message");
const { MessageReceiver } = require("adp-messaging");
const logger = require("./../utilities/logger");
const logIndexPath = "app/messaging/index.js";

let plpReceiver;

async function start() {
  try {
    if (config.plpSubscription.name) {
      const plpAction = (message) => processPlpMessage(message, plpReceiver);
      plpReceiver = new MessageReceiver(config.plpSubscription, plpAction);
      await plpReceiver.subscribe();

      logger.log_info(logIndexPath, "start()", "Ready to receive messages");
    } else {
      logger.log_error(
        logIndexPath,
        "start()",
        "Service Bus connection has not been initialised because 'config.plpSubscription.name' is missing."
      );
    }
  } catch (err) {
    logger.log_error(logIndexPath, "start()", err);
  }
}

async function stop() {
  try {
    if (config.plpSubscription.name) {
      logger.log_info(logIndexPath, "stop()", "Stopped receiving messages");
      await plpReceiver.closeConnection();
    }
  } catch (err) {
    logger.log_error(logIndexPath, "stop()", err);
  }
}

module.exports = { start, stop };
