const bearerTokenRequest = {
  url: process.env.MDM_AUTH_URL,
  tenant: process.env.MDM_TENANT,
  scope: process.env.MDM_SCOPE,
  grantType: "client_credentials",
  clientId: process.env.MDM_CLIENT_ID,
  clientSecret: process.env.MDM_CLIENT_SECRET,
};

const mdmConfig = {
  apiUrl: process.env.MDM_API_URL,
  subscriptionKey: process.env.MDM_SUBSCRIPTION_KEY,
  bearerTokenRequest,
};

// Debug logging - remove after testing
console.log("MDM Config loaded:", {
  apiUrl: mdmConfig.apiUrl,
  subscriptionKey: mdmConfig.subscriptionKey ? "***set***" : "undefined",
  authUrl: bearerTokenRequest.url,
  clientId: bearerTokenRequest.clientId,
  scope: bearerTokenRequest.scope,
});

module.exports = mdmConfig;
