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
const logProcessPlpMessagePath = "app/messaging/process-plp-message.js";
const logProcessPlpMessageFunction = "processPlpMessage()";

async function processBlob(message) {
  const blobClient = createStorageAccountClient(message.body.packing_list_blob);

  let result = {};
  try {
    result = await getXlsPackingListFromBlob(blobClient);
  } catch (err) {
    logger.logError(
      logProcessPlpMessagePath,
      "processPlpMessage() > getXlsPackingListFromBlob",
      err,
    );
  }
  return result;
}

function getPackinList(result, message) {
  let packingList = {};
  try {
    packingList = findParser(result, message.body.packing_list_blob);
  } catch (err) {
    logger.logError(
      logProcessPlpMessagePath,
      "processPlpMessage() > findParser",
      err,
    );
  }
  return packingList;
}

async function processPackingList(packingList, message) {
  if (packingList.parserModel !== parserModel.NOMATCH) {
    try {
      await createPackingList(packingList, message.body.application_id);
      logger.log_info(
        logProcessPlpMessagePath,
        logProcessPlpMessageFunction,
        "Received message: ",
        `Business checks for ${message.body.application_id}: ${packingList.business_checks.all_required_fields_present}`,
      );
    } catch (err) {
      logger.logError(
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
        logger.logError(
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
        logger.logError(
          logProcessPlpMessagePath,
          "processPlpMessage() > sendParsed",
          err,
        );
      }
    }
  }
}

async function processPlpMessage(message, receiver) {
  try {
    await receiver.completeMessage(message);
    logger.log_info(
      logProcessPlpMessagePath,
      logProcessPlpMessageFunction,
      "Received message: ",
      message.body,
    );

    const result = await processBlob(message);
    const packingList = getPackinList(result, message);
    await processPackingList(packingList, message);
  } catch (err) {
    logger.logError(
      logProcessPlpMessagePath,
      logProcessPlpMessageFunction,
      err,
    );
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
