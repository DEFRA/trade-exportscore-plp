/**
 * Process incoming PLP messages
 *
 * Workflow:
 * 1. Mark the message as completed on receipt.
 * 2. Download the packing list blob referenced by the message.
 * 3. Determine the dispatch location via Dynamics and run the parser
 *    discovery to produce a `packingList` result.
 * 4. If a parser matched, create a `PackingList` record and send a
 *    parsed/approval message downstream.
 *
 * Errors at any stage are logged and the message is abandoned so it can be
 * retried by the messaging infra.
 */

const { findParser } = require("../services/parser-service");
const {
  createStorageAccountClient,
  getPackingListFromBlob,
} = require("../services/storage-account");
const { createPackingList } = require("../packing-list");
const parserModel = require("../services/parser-model");
const { sendParsed } = require("../messaging/send-parsed-message");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const logProcessPlpMessageFunction = "processPlpMessage()";
const { getDispatchLocation } = require("../services/dynamics-service");

/**
 * Download and convert packing list blob from Azure Storage.
 * @param {Object} message - Incoming PLP message with blob URI
 * @returns {Promise<Object>} Parsed packing list data or empty object
 */
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

/**
 * Retrieve dispatch location and parse packing list data.
 * @param {Object} result - Converted packing list data
 * @param {Object} message - Incoming PLP message
 * @returns {Promise<Object>} Parsed packing list object or empty object
 */
async function getPackingList(result, message) {
  let packingList = {};
  try {
    const establishmentId =
      message.body.SupplyChainConsignment.DispatchLocation.IDCOMS
        .EstablishmentId;
    const dispatchLocation = await getDispatchLocation(establishmentId);
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

/**
 * Persist matched packing list and send parsed approval message.
 * @param {Object} packingList - Parsed packing list object
 * @param {Object} message - Incoming PLP message
 * @returns {Promise<void>}
 */
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

/**
 * Process incoming PLP message from Service Bus subscription.
 * @param {Object} message - Service Bus message
 * @param {Object} receiver - MessageReceiver instance
 * @returns {Promise<void>}
 */
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
