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
  ttlSeconds: Number.parseInt(process.env.MDM_CACHE_TTL_SECONDS || "3600", 10),
  containerName: process.env.MDM_CACHE_CONTAINER || "mdm-cache",
};

const mdmConfig = {
  apiUrl: process.env.MDM_API_URL,
  subscriptionKey: process.env.MDM_SUBSCRIPTION_KEY,
  bearerTokenRequest,
  cache,
  useLocalData: process.env.MDM_USE_LOCAL_DATA !== "false", // Defaults to true unless explicitly set to "false"
  maxRetries: Number.parseInt(process.env.MDM_MAX_RETRIES || "3", 10),
  retryDelayMs: Number.parseInt(process.env.MDM_RETRY_DELAY_MS || "2000", 10),
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
