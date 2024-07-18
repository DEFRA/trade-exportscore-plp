const messageAction = require('../../../app/messaging/process-plp-message')

jest.mock('adp-messaging')
jest.mock('../../../app/services/parser-service')
jest.mock('../../../app/services/storage-account')
jest.mock('../../../app/packing-list')
jest.mock('../../../app/services/dynamics-service')

const { MessageReceiver } = require('adp-messaging')
const { findParser } = require('../../../app/services/parser-service')
const { createStorageAccountClient, getXlsPackingListFromBlob } = require('../../../app/services/storage-account')
const { createPackingList } = require('../../../app/packing-list')
const { patchPackingListCheck } = require('../../../app/services/dynamics-service')

createStorageAccountClient.mockImplementation(() => {
  return jest.fn()
})
getXlsPackingListFromBlob.mockImplementation(() => {
  return jest.fn()
})
findParser.mockImplementation(() => {
  return {
    isParsed: true
  }
})
createPackingList.mockImplementation(() => {
  return jest.fn()
})
patchPackingListCheck.mockImplementation(() => {
  return jest.fn()
})

MessageReceiver.mockImplementation(() => {
  return {
    subscribe: jest.fn(),
    deadLetterMessage: jest.fn(),
    completeMessage: jest.fn(),
    abandonMessage: jest.fn()
  }
})

describe('processPlpMessage', () => {
  let receiver

  beforeEach(() => {
    jest.clearAllMocks()
    receiver = new MessageReceiver()
    MessageReceiver.mockImplementation(() => receiver)
  })

  test('should process a message', async () => {
    const message = { body: { packing_list_blob: "https://example.com/path/doesnt/matter" } }
    await messageAction(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })

  test('should log warning message when parser cannot parse', async () => {
    // This test is not required - parsing failure is handled in the parser.
    // It is here to see if SonarCloud detects the additional code (and associated test) correctly.
    // ToDo: REMOVE before PR
    findParser.mockImplementation(() => {
      return {
        isParsed: false
      }
    })
    jest.spyOn(global.console, 'warn')
    const message = { body: { application_id: "id-doesnt-matter" } }
    await messageAction(message, receiver)
    expect(console.warn).toHaveBeenCalled()
  })

  test('handle error', async () => {
    const message = {
      body: {
        claimId: 'claim123'
      }
    }
    receiver.completeMessage.mockImplementation(() => {
      throw new Error('Error')
    })
    await messageAction(message, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalled()
  })
})
