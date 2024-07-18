const { findParser } = require('../services/parser-service')
const { createStorageAccountClient, getXlsPackingListFromBlob } = require('../services/storage-account')
const { createPackingList } = require('../packing-list')
const { patchPackingListCheck } = require('../services/dynamics-service')

async function processPlpMessage(message, receiver) {
  try {
    await receiver.completeMessage(message)
    console.info('Received message: ', message.body)
    const blobClient = createStorageAccountClient(message.body.packing_list_blob)
    let result = {}
    result = await getXlsPackingListFromBlob(blobClient)
    const parsed = findParser(result, message.body.packing_list_blob)

    if (parsed.isParsed) {
      await createPackingList(parsed.packingList, message.body.application_id)
      await patchPackingListCheck(message.body.application_id, parsed.isParsed)
    } else {
      // This else branch is not required - parsing failure is handled in the parser.
      // It is here to see if SonarCloud detects the additional code (and associated test) correctly.
      // ToDo: REMOVE before PR
      console.warn('Unable to process message: ', message.body.application_id)
    }
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processPlpMessage
