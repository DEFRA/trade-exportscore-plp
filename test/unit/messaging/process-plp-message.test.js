const messageAction = require('../../../app/messaging/process-plp-message')

jest.mock('adp-messaging')
const { MessageReceiver } = require('adp-messaging')

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
    const message = { }
    await messageAction(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
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
