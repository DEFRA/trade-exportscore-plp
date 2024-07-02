const config = require('../config')
const processPlpMessage = require('./process-plp-message')
const { MessageReceiver } = require('adp-messaging')
let plpReceiver

async function start () {
  const plpAction = message => processPlpMessage(message, plpReceiver)
  plpReceiver = new MessageReceiver(config.plpSubscription, plpAction)
  await plpReceiver.subscribe()

  console.info('Ready to receive messages')
}

async function stop () {
  await plpReceiver.closeConnection()
}

module.exports = { start, stop }
