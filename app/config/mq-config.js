const joi = require('joi')

const queueSchema = joi.object({
  name: joi.string(),
  address: joi.string().required(),
  username: joi.string().optional(),
  password: joi.string().optional(),
  type: joi.string().optional()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    managedIdentityClientId: joi.string().optional(),
    type: joi.string(),
    appInsights: joi.object()
  },
  plpTopic: queueSchema
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  plpTopic: {
    name: process.env.PLP_TOPIC_NAME || 'eutd-trade-exports-core-plingestion',
    address: process.env.PLP_TOPIC_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    type: 'topic'
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

const plpTopic = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.plpTopic
}

module.exports = {
  plpTopic
}