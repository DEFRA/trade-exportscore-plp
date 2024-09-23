const mq_config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === "production",
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    type: "queue",
    appInsights:
      process.env.NODE_ENV === "production"
        ? require("applicationinsights")
        : undefined,
  },
  plpSubscription: {
    name: process.env.PLP_SUBSCRIPTION_NAME,
    address: process.env.PLP_SUBSCRIPTION_ADDRESS,
    topic: process.env.PLP_TOPIC_ADDRESS,
    type: "subscription",
  },
};

const plpSubscription = {
  ...mq_config.messageQueue,
  ...mq_config.plpSubscription,
};

const tpQueue = {
  useCredentialChain: process.env.NODE_ENV === "production",
  host: process.env.TP_QUEUE_HOST,
  address: process.env.TP_QUEUE_ADDRESS,
  managedIdentityClientId: process.env.TP_CLIENT_ID,
  tenantId: process.env.TP_TENANT_ID,
};

module.exports = {
  plpSubscription,
  tpQueue,
};
