const { findParser } = require("../services/parser-service");
const {
  createStorageAccountClient,
  getXlsPackingListFromBlob,
} = require("../services/storage-account");
const { createPackingList } = require("../packing-list");
const { patchPackingListCheck } = require("../services/dynamics-service");
const config = require("../config");
const parserModel = require("../services/parser-model");
const { sendParsed } = require("../messaging/send-parsed-message");
const logger = require("./../utilities/logger");

async function processPlpMessage(message, receiver) {
  try {
    await receiver.completeMessage(message);
    logger.log_info(
      "app/messaging/process-plp-message.js",
      "processPlpMessage()",
      "Received message: ",
      message.body,
    );

    const blobClient = createStorageAccountClient(
      message.body.packing_list_blob,
    );

    let result = {};
    try {
      result = await getXlsPackingListFromBlob(blobClient);
    } catch (err) {
      logger.log_error(
        "app/messaging/process-plp-message.js",
        "processPlpMessage() > getXlsPackingListFromBlob",
        err,
      );
    }

    let packingList = {};
    try {
      packingList = findParser(result, message.body.packing_list_blob);
    } catch (err) {
      logger.log_error(
        "app/messaging/process-plp-message.js",
        "processPlpMessage() > findParser",
        err,
      );
    }

    if (packingList.parserModel !== parserModel.NOMATCH) {
      try {
        await createPackingList(packingList, message.body.application_id);
        logger.log_info(
          "app/messaging/process-plp-message.js",
          "processPlpMessage()",
          "Received message: ",
          `Business checks for ${message.body.application_id}: ${packingList.business_checks.all_required_fields_present}`,
        );
      } catch (err) {
        logger.log_error(
          "app/messaging/process-plp-message.js",
          "processPlpMessage() > createPackingList",
          err,
        );
      }

      if (config.isDynamicsIntegration) {
        try {
          await patchPackingListCheck(
            message.body.application_id,
            packingList.business_checks.all_required_fields_present,
          );
        } catch (err) {
          logger.log_error(
            "app/messaging/process-plp-message.js",
            "processPlpMessage() > patchPackingListCheck",
            err,
          );
        }
      } else {
        try {
          await sendParsed(
            message.body.application_id,
            packingList.business_checks.all_required_fields_present,
          );
        } catch (err) {
          logger.log_error(
            "app/messaging/process-plp-message.js",
            "processPlpMessage() > sendParsed",
            err,
          );
        }
      }
    }
  } catch (err) {
    logger.log_error(
      "app/messaging/process-plp-message.js",
      "processPlpMessage()",
      err,
    );
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
