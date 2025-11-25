const bearerTokenRequest = {
  url: process.env.MDM_AUTH_URL,
  tenant: process.env.MDM_TENANT,
  scope: process.env.MDM_SCOPE,
  grantType: "client_credentials",
  clientId: process.env.MDM_CLIENT_ID,
  clientSecret: process.env.MDM_CLIENT_SECRET,
};

const cache = {
  enabled: process.env.MDM_CACHE_ENABLED === "true",
  ttlSeconds: parseInt(process.env.MDM_CACHE_TTL_SECONDS || "3600", 10),
  containerName: process.env.MDM_CACHE_CONTAINER || "mdm-cache",
};

const mdmConfig = {
  apiUrl: process.env.MDM_API_URL,
  subscriptionKey: process.env.MDM_SUBSCRIPTION_KEY,
  bearerTokenRequest,
  cache,
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
