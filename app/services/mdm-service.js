const config = require("../config");
const logger = require("../utilities/logger");
const mdmBlobCache = require("./cache/mdm-blob-cache-service");
const { sleep, validateBearerToken } = require("../utilities/async-helpers");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const mdmConfig = config.mdmConfig;
const GET_NIRMS_METHOD = "getNirmsIneligibleItems()";

// Retry configuration from config with defaults
const MAX_RETRIES = mdmConfig.maxRetries || 3;
const RETRY_DELAY_MS = mdmConfig.retryDelayMs || 2000;

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

/**
 * Attempt to retrieve stale cache data with appropriate logging.
 * @param {string} logMessage - The log message to use if stale data is found.
 * @returns {Promise<Object|null>} Stale cache data or null.
 */
async function getStaleCacheFallback(logMessage) {
  const staleData = await mdmBlobCache.getStale();
  if (staleData) {
    logger.logInfo(filenameForLogging, GET_NIRMS_METHOD, logMessage);
  }
  return staleData;
}

/**
 * Handle bearer token validation failure.
 * @param {string} bearerToken - The invalid bearer token.
 * @returns {Promise<Object|null>} Stale cache data or null.
 */
async function handleTokenValidationFailure(bearerToken) {
  const error = new Error(`Failed to obtain bearer token: ${bearerToken}`);
  logger.logError(filenameForLogging, GET_NIRMS_METHOD, error);
  return getStaleCacheFallback(
    "MDM API unavailable - using stale cache as fallback",
  );
}

/**
 * Handle HTTP error response.
 * @param {number} status - HTTP status code.
 * @param {string} errorText - Error response text.
 * @returns {Promise<Object|null>} Stale cache data or null.
 */
async function handleHttpError(status, errorText) {
  logHttpError(status, errorText);
  return getStaleCacheFallback(
    "MDM API unavailable - using stale cache as fallback",
  );
}

/**
 * Handle final retry attempt failure.
 * @returns {Promise<Object|null>} Stale cache data or null.
 */
async function handleFinalRetryFailure() {
  return getStaleCacheFallback(
    "MDM API unavailable after retries - using stale cache as fallback",
  );
}

async function getNirmsIneligibleItems() {
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

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const bearerToken = await bearerTokenRequest();

      if (!validateBearerToken(bearerToken)) {
        return handleTokenValidationFailure(bearerToken);
      }

      const { response, status } = await makeMdmRequest(
        "/trade/nirms/ineligible-items",
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

      // Any HTTP error response - don't retry, return immediately with stale cache fallback
      const errorText = await response.text();
      return handleHttpError(status, errorText);
    } catch (err) {
      // Only retry on fetch failures (network errors)
      logCatchError(attempt, MAX_RETRIES, err.message, RETRY_DELAY_MS);

      if (attempt === MAX_RETRIES) {
        return handleFinalRetryFailure();
      }

      await sleep(RETRY_DELAY_MS);
    }
  }

  return null;
}

module.exports = { getNirmsIneligibleItems, bearerTokenRequest };
