const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  plpSubscription: {
    name: process.env.PLP_SUBSCRIPTION_NAME,
    address: process.env.PLP_SUBSCRIPTION_ADDRESS,
    topic: process.env.PLP_TOPIC_ADDRESS,
    type: 'subscription'
  },
  parsedQueue: {
    name: process.env.PARSED_QUEUE_NAME,
    address: process.env.PARSED_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  }
}

const plpSubscription = {
  ...mqConfig.messageQueue,
  ...mqConfig.plpSubscription
}

const parsedQueue = {
  ...mqConfig.messageQueue,
  ...mqConfig.parsedQueue
}

module.exports = {
  plpSubscription, parsedQueue
}
