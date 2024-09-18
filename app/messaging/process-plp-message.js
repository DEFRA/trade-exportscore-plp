const { findParser } = require("../services/parser-service");
const {
  createStorageAccountClient,
  getPackingListFromBlob,
} = require("../services/storage-account");
const { createPackingList } = require("../packing-list");
const { patchPackingListCheck } = require("../services/dynamics-service");
const config = require("../config");
const parserModel = require("../services/parser-model");
const { sendParsed } = require("../messaging/send-parsed-message");

async function processPlpMessage(message, receiver) {
  console.log(
    "Starting the messaging.process-plp-message.processPlpMessage() method.",
  );

  let filename = "not set";
  let messageBody = "not set";

  try {
    await receiver.completeMessage(message);
    messageBody = message.body;
    console.info(
      "messaging.process-plp-message.processPlpMessage() Received message: ",
      message.body,
    );
    filename = messageBody.blob.packing_list_blob;
    const blobClient = createStorageAccountClient(filename);

    let rawPackingList;
    try {
      rawPackingList = await getPackingListFromBlob(blobClient);
    } catch (err) {}
    const applicationId = messageBody.application_id;
    console.info(`Received filename: ${filename} for ${applicationId}`);
    let packingList;

    try {
      packingList = findParser(rawPackingList, filename);
    } catch (err) {
      console.error(
        `messaging.process-plp-message.processPlpMessage() finding the parser for the packing list created by getXlsPackingListFromBlob failed with: ${err}`,
      );
    }
    const allRequiredFieldsPresent =
      packingList.business_checks.all_required_fields_present;

    if (packingList.parserModel !== parserModel.NOMATCH) {
      try {
        await createPackingList(packingList, applicationId);
        console.info(
          `Business checks for ApplicationId: ${applicationId}, allRequiredFieldsPresent: ${allRequiredFieldsPresent}`,
        );
      } catch (err) {
        console.error(
          `messaging.process-plp-message.processPlpMessage.createPackingList() failed with: ${err}`,
        );
      }

      try {
        if (config.isDynamicsIntegration) {
          await patchPackingListCheck(applicationId, allRequiredFieldsPresent);
        } else {
          await sendParsed(applicationId, allRequiredFieldsPresent);
        }
      } catch (err) {
        console.error(
          `messaging.process-plp-message.processPlpMessage.patchPackingListCheck() failed with: ${err}`,
        );
      }
    }
  } catch (err) {
    console.error(
      "messaging.process-plp-message.processPlpMessage() was unable to process the message. Error was:",
      err,
    );
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
