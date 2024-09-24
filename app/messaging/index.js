const config = require("../config");
const processPlpMessage = require("./process-plp-message");
const { MessageReceiver } = require("adp-messaging");
const logger = require("./../utilities/logger");
let plpReceiver;

async function start() {
  try {
    if (config.plpSubscription.name) {
      const plpAction = (message) => processPlpMessage(message, plpReceiver);
      plpReceiver = new MessageReceiver(config.plpSubscription, plpAction);
      await plpReceiver.subscribe();

      logger.log_info(
        "app/messaging/index.js",
        "start()",
        "Ready to receive messages",
      );
    } else {
      logger.log_error(
        "app/messaging/index.js",
        "start()",
        "Service Bus connection has not been initialised because 'config.plpSubscription.name' is missing.",
      );
    }
  } catch (err) {
    logger.log_error("app/messaging/index.js", "start()", err);
  }
}

async function stop() {
  try {
    if (config.plpSubscription.name) {
      await plpReceiver.closeConnection();
    }
  } catch (err) {
    logger.log_error("app/messaging/index.js", "stop()", err);
  }
}

module.exports = { start, stop };
