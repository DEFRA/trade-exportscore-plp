const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    managedIdentityClientId: joi.string().optional(),
    type: joi.string(),
    appInsights: joi.object()
  },
  plpSubscription: {
    name: joi.string().default('trade-exportscore-plp-plingestion'),
    address: joi.string().default('eutd-trade-exports-core-plp-subscription-01'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string().default('trade-exportscore-plp-plingestion')
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    type: 'subscription',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  plpSubscription: {
    name: process.env.PLP_SUBSCRIPTION_NAME,
    address: process.env.PLP_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.PLP_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const plpSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.plpSubscription }

console.log(plpSubscription)

module.exports = { plpSubscription }
