const joi = require('joi')

const queueSchema = joi.object({
  name: joi.string(),
  address: joi.string().required(),
  username: joi.string().optional(),
  password: joi.string().optional(),
  type: joi.string().optional(),
  topic: joi.string()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    managedIdentityClientId: joi.string().optional(),
    type: joi.string(),
    appInsights: joi.object()
  },
  plpSubscription: queueSchema
})

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

console.log(mqConfig)

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const plpSubscription = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.plpSubscription
}

module.exports = {
  plpSubscription
}
