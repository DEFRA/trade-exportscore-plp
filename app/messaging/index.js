const config = require("../config");
const processPlpMessage = require("./process-plp-message");
const { MessageReceiver } = require("adp-messaging");
let plpReceiver;

async function start() {
  try {
    // test if not running locally
    if (config.plpSubscription.name) {
      const plpAction = (message) => processPlpMessage(message, plpReceiver);
      plpReceiver = new MessageReceiver(config.plpSubscription, plpAction);
      await plpReceiver.subscribe();

      console.info("Ready to receive messages");
    } else {
      console.error(
        "Service Bus connection has not been initialised because 'config.plpSubscription.name' is missing.",
      );
    }
  } catch (err) {
    console.error(`messaging.index.start() failed with: ${err}`);
  }
}

async function stop() {
  try {
    // test if not running locally
    if (config.plpSubscription.name) {
      await plpReceiver.closeConnection();
    }
  } catch (err) {
    console.error(`messaging.index.stop() failed with: ${err}`);
  }
}

module.exports = { start, stop };
