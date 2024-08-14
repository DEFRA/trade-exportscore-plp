const mqConfig = {
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
  ...mqConfig.messageQueue,
  ...mqConfig.plpSubscription,
};

const tpQueue = {
  address: process.env.PARSED_QUEUE_ADDRESS,
  managedIdentityClientId: process.env.TP_CLIENT_ID,
};

module.exports = {
  plpSubscription,
  tpQueue,
};
