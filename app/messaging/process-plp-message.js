const { findParser } = require("../services/parser-service");
const {
  createStorageAccountClient,
  getPackingListFromBlob,
} = require("../services/storage-account");
const { createPackingList } = require("../packing-list");
const parserModel = require("../services/parser-model");
const { sendParsed } = require("../messaging/send-parsed-message");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const logProcessPlpMessageFunction = "processPlpMessage()";
const { getDispatchLocation } = require("../services/dynamics-service");

async function processBlob(message) {
  const blobClient = createStorageAccountClient(message.body.packing_list_blob);

  let result = {};
  try {
    result = await getPackingListFromBlob(
      blobClient,
      message.body.packing_list_blob,
    );
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "processPlpMessage() > getPackingListFromBlob",
      err,
    );
  }
  return result;
}

async function getPackingList(result, message) {
  let packingList = {};
  try {
    const establishmentId =
      message.body.SupplyChainConsignment.DispatchLocation.IDCOMS
        .EstablishmentId;
    const dispatchLocation = getDispatchLocation(establishmentId);
    packingList = await findParser(
      result,
      message.body.packing_list_blob,
      dispatchLocation,
    );
  } catch (err) {
    logger.logError(
      filenameForLogging,
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
      logger.logInfo(
        filenameForLogging,
        logProcessPlpMessageFunction,
        `Business checks for ${message.body.application_id}: ${packingList.business_checks.all_required_fields_present}`,
      );
    } catch (err) {
      logger.logError(
        filenameForLogging,
        "processPlpMessage() > createPackingList",
        err,
      );
    }
  }

  if (packingList.parserModel !== parserModel.NOMATCH) {
    try {
      await sendParsed(
        message.body.application_id,
        packingList.business_checks.all_required_fields_present,
        packingList.business_checks.failure_reasons,
      );
    } catch (err) {
      logger.logError(
        filenameForLogging,
        "processPlpMessage() > sendParsed",
        err,
      );
    }
  }
}

async function processPlpMessage(message, receiver) {
  try {
    await receiver.completeMessage(message);
    logger.logInfo(
      filenameForLogging,
      logProcessPlpMessageFunction,
      "Received message: " + JSON.stringify(message.body),
    );

    const result = await processBlob(message);
    const packingList = await getPackingList(result, message);
    await processPackingList(packingList, message);
  } catch (err) {
    logger.logError(filenameForLogging, logProcessPlpMessageFunction, err);
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
