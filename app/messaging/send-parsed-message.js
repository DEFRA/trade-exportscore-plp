const config = require('../config')
const { MessageSender } = require('adp-messaging')
const createMessage = require('./create-message')

async function sendParsed (parsedResult) {
  try {
    const message = createMessage(parsedResult)
    const parsedSender = new MessageSender(config.parsedQueue)
    await parsedSender.sendMessage(message)
    await parsedSender.closeConnection()
    console.info('Sent parsed result for: ', parsedResult)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { sendParsed }
