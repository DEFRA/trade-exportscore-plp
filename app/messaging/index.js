const config = require("../config");
const processPlpMessage = require("./process-plp-message");
const { MessageReceiver } = require("adp-messaging");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

let plpReceiver;

async function start() {
  try {
    if (config.plpSubscription.name) {
      const plpAction = (message) => processPlpMessage(message, plpReceiver);
      plpReceiver = new MessageReceiver(config.plpSubscription, plpAction);
      await plpReceiver.subscribe();

      logger.log_info(
        filenameForLogging,
        "start()",
        "Ready to receive messages",
      );
    } else {
      logger.log_error(
        filenameForLogging,
        "start()",
        "Service Bus connection has not been initialised because 'config.plpSubscription.name' is missing.",
      );
    }
  } catch (err) {
    logger.log_error(filenameForLogging, "start()", err);
  }
}

async function stop() {
  try {
    if (config.plpSubscription.name) {
      logger.log_info(
        filenameForLogging,
        "stop()",
        "Stopped receiving messages",
      );
      await plpReceiver.closeConnection();
    }
  } catch (err) {
    logger.log_error(filenameForLogging, "stop()", err);
  }
}

module.exports = { start, stop };
