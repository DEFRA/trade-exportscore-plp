async function processPlpMessage (message, receiver) {
  try {
    await receiver.completeMessage(message)
    console.log(message.body)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processPlpMessage
