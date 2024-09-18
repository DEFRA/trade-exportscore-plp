const { findParser } = require('../services/parser-service')
const { createStorageAccountClient, getXlsPackingListFromBlob } = require('../services/storage-account')
const { createPackingList } = require('../packing-list')
const { patchPackingListCheck } = require('../services/dynamics-service')

async function processPlpMessage (message, receiver) {
  try {
    console.log('Starting the messaging.process-plp-message.processPlpMessage() method.')
    await receiver.completeMessage(message)
    console.info('messaging.process-plp-message.processPlpMessage() Received message: ', message.body)
    const blobClient = createStorageAccountClient(message.body.packing_list_blob)
    let result = {}
    let parsed = {
      isParsed: false
    }

    try {
      result = await getXlsPackingListFromBlob(blobClient)
    } catch (err) {
      console.error(`messaging.process-plp-message.processPlpMessage() Parsing the received message to getXlsPackingListFromBlob failed with: ${err}`)
    }

    try {
      parsed = findParser(result, message.body.packing_list_blob)
    } catch (err) {
      console.error(`messaging.process-plp-message.processPlpMessage() finding the parser for the packing list created by getXlsPackingListFromBlob failed with: ${err}`)
    }

    if (parsed.isParsed) {
      try {
        await createPackingList(parsed.packingList, message.body.application_id)
      } catch (err) {
        console.error(`messaging.process-plp-message.processPlpMessage.createPackingList() failed with: ${err}`)
      }
      try {
        await patchPackingListCheck(message.body.application_id, parsed.isParsed)
      } catch (err) {
        console.error(`messaging.process-plp-message.processPlpMessage.patchPackingListCheck() failed with: ${err}`)
      }
    }
  } catch (err) {
    console.error('messaging.process-plp-message.processPlpMessage() was unable to process the message. Error was:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processPlpMessage
