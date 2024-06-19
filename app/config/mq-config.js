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
    username: 'test',
    password: 'test',
    topic: process.env.PLP_TOPIC_ADDRESS,
    type: 'subscription'
  }
}

const plpSubscription = {
  ...mqConfig.messageQueue,
  ...mqConfig.plpSubscription
}

module.exports = {
  plpSubscription
}
