const config = require("../config");
const logger = require("../utilities/logger");
const mdmBlobCache = require("./cache/mdm-blob-cache-service");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const mdmConfig = config.mdmConfig;
const GET_NIRMS_METHOD = "getNirmsProhibitedItems()";

// Helper function for retry delays
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to request bearer token
async function bearerTokenRequest() {
  try {
    const response = await fetch(mdmConfig.bearerTokenRequest.url, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: mdmConfig.bearerTokenRequest.grantType,
        client_id: mdmConfig.bearerTokenRequest.clientId,
        client_secret: mdmConfig.bearerTokenRequest.clientSecret,
        scope: mdmConfig.bearerTokenRequest.scope,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Bearer token request failed - Status: ${response.status}, Response: ${errorText}`,
      );
    }

    const json = await response.json();

    if (!json.access_token) {
      throw new Error("No access token in response");
    }

    return json.access_token;
  } catch (err) {
    logger.logError(filenameForLogging, "bearerTokenRequest()", err);
    throw err;
  }
}

// Helper function to validate bearer token
function validateBearerToken(bearerToken) {
  return (
    bearerToken &&
    typeof bearerToken === "string" &&
    !bearerToken.includes("Error")
  );
}

// Helper function to make HTTP request to MDM API
async function makeMdmRequest(endpoint, bearerToken) {
  const url = `${mdmConfig.apiUrl}${endpoint}`;
  const token = "Bearer " + bearerToken;

  const response = await fetch(encodeURI(url), {
    method: "GET",
    headers: {
      Authorization: token,
      "Ocp-Apim-Subscription-Key": mdmConfig.subscriptionKey,
      "Content-Type": "application/json",
    },
  });

  return { response, status: response.status };
}

// Helper function to handle successful response
async function handleSuccessResponse(response, attempt) {
  const result = await response.json();
  if (attempt > 1) {
    logger.logInfo(
      filenameForLogging,
      GET_NIRMS_METHOD,
      `Successfully retrieved NIRMS data after ${attempt} attempts`,
    );
  }
  return result;
}

// Helper function to log HTTP errors (no retries)
function logHttpError(status, errorText) {
  const message = `Request failed - HTTP ${status}: ${errorText}`;
  logger.logError(filenameForLogging, GET_NIRMS_METHOD, message);
}

// Helper function to log catch errors
function logCatchError(attempt, maxRetries, errorMessage, retryDelayMs) {
  const isLastAttempt = attempt === maxRetries;
  const message = isLastAttempt
    ? `Final attempt failed with error: ${errorMessage}`
    : `Attempt ${attempt} failed with error: ${errorMessage}, retrying in ${retryDelayMs}ms`;

  logger.logError(filenameForLogging, GET_NIRMS_METHOD, message);
}

async function getNirmsProhibitedItems(maxRetries = 3, retryDelayMs = 2000) {
  // Check cache first
  const cachedData = await mdmBlobCache.get();
  if (cachedData) {
    logger.logInfo(
      filenameForLogging,
      GET_NIRMS_METHOD,
      "Returning cached NIRMS data",
    );
    return cachedData;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const bearerToken = await bearerTokenRequest();

      if (!validateBearerToken(bearerToken)) {
        const error = new Error(
          `Failed to obtain bearer token: ${bearerToken}`,
        );
        logger.logError(filenameForLogging, GET_NIRMS_METHOD, error);
        return null;
      }

      const { response, status } = await makeMdmRequest(
        "/trade/nirms/prohibited-items",
        bearerToken,
      );

      if (response.ok) {
        const result = await handleSuccessResponse(response, attempt);
        // Cache the result asynchronously (fire-and-forget)
        mdmBlobCache.set(result).catch((err) => {
          logger.logError(
            filenameForLogging,
            GET_NIRMS_METHOD,
            `Failed to cache response: ${err.message}`,
          );
        });
        return result;
      }

      // Any HTTP error response - don't retry, return immediately
      const errorText = await response.text();
      logHttpError(status, errorText);
      return null;
    } catch (err) {
      // Only retry on fetch failures (network errors)
      logCatchError(attempt, maxRetries, err.message, retryDelayMs);

      if (attempt === maxRetries) {
        return null;
      }

      await sleep(retryDelayMs);
    }
  }

  return null;
}

module.exports = { getNirmsProhibitedItems, bearerTokenRequest };
