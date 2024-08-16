const { findParser } = require("../services/parser-service");
const {
  createStorageAccountClient,
  getXlsPackingListFromBlob,
} = require("../services/storage-account");
const { createPackingList } = require("../packing-list");
const { patchPackingListCheck } = require("../services/dynamics-service");
const MatchedModel = require("../services/matched-model");

async function processPlpMessage(message, receiver) {
  try {
    await receiver.completeMessage(message);
    console.info("Received message: ", message.body);
    const blobClient = createStorageAccountClient(
      message.body.packing_list_blob,
    );
    let result = {};
    result = await getXlsPackingListFromBlob(blobClient);
    const packingList = findParser(result, message.body.packing_list_blob);

    if (packingList.parserModel !== MatchedModel.NOMATCH) {
      await createPackingList(packingList, message.body.application_id);
      await patchPackingListCheck(
        message.body.application_id,
        parsed.packingList.business_checks.all_required_fields_present,
      );
    }
  } catch (err) {
    console.error("Unable to process message:", err);
    await receiver.abandonMessage(message);
  }
}

module.exports = processPlpMessage;
