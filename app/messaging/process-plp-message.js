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
  let filename = "not set";
  let messageBody = "not set";

  try {
    await receiver.completeMessage(message);
    messageBody = message.body;
    console.info(`Received message: ${messageBody}`);
    filename = messageBody.blob.packing_list_blob;
    const blobClient = createStorageAccountClient(filename);

    let rawPackingList = await getPackingListFromBlob(blobClient);
    const applicationId = messageBody.application_id;
    console.info(`Received filename: ${filename} for ${applicationId}`);
    const packingList = findParser(rawPackingList, filename);
    const allRequiredFieldsPresent =
      packingList.business_checks.all_required_fields_present;

    if (packingList.parserModel !== parserModel.NOMATCH) {
      await createPackingList(packingList, applicationId);
      console.info(
        `Business checks for ApplicationId: ${applicationId}, allRequiredFieldsPresent: ${allRequiredFieldsPresent}`,
      );

      if (config.isDynamicsIntegration) {
        await patchPackingListCheck(applicationId, allRequiredFieldsPresent);
      } else {
        await sendParsed(messageBody.application_id, allRequiredFieldsPresent);
      }
    }
  } catch (err) {
    console.error(`Unable to process message: ${messageBody} - error: ${err}`);
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
