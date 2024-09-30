const { findParser } = require("../services/parser-service");
const {
  createStorageAccountClient,
  getXlsPackingListFromBlob,
} = require("../services/storage-account");
const { createPackingList } = require("../packing-list");
const { patchPackingListCheck } = require("../services/dynamics-service");
const config = require("../config");
const parser_model = require("../services/parser-model");
const { sendParsed } = require("../messaging/send-parsed-message");
const logger = require("./../utilities/logger");
const logProcessPlpMessagePath = "app/messaging/process-plp-message.js";
const logProcessPlpMessageFunction = "processPlpMessage()";

async function processPlpMessage(message, receiver) {
  try {
    await receiver.completeMessage(message);
    logger.log_info(
      logProcessPlpMessagePath,
      logProcessPlpMessageFunction,
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
        logProcessPlpMessagePath,
        "processPlpMessage() > getXlsPackingListFromBlob",
        err,
      );
    }

    let packingList = {};
    try {
      packingList = findParser(result, message.body.packing_list_blob);
    } catch (err) {
      logger.log_error(
        logProcessPlpMessagePath,
        "processPlpMessage() > findParser",
        err,
      );
    }

    if (packingList.parserModel !== parser_model.NOMATCH) {
      try {
        await createPackingList(packingList, message.body.application_id);
        logger.log_info(
          logProcessPlpMessagePath,
          logProcessPlpMessageFunction,
          "Received message: ",
          `Business checks for ${message.body.application_id}: ${packingList.business_checks.all_required_fields_present}`,
        );
      } catch (err) {
        logger.log_error(
          logProcessPlpMessagePath,
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
            logProcessPlpMessagePath,
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
            logProcessPlpMessagePath,
            "processPlpMessage() > sendParsed",
            err,
          );
        }
      }
    }
  } catch (err) {
    logger.log_error(
      logProcessPlpMessagePath,
      logProcessPlpMessageFunction,
      err,
    );
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
