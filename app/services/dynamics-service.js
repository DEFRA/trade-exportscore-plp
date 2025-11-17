/**
 * Dynamics 365 API integration
 *
 * Provides OAuth2 authentication and API access to Dynamics 365 for retrieving
 * dispatch location and REMOS information. Includes retry logic for resilience.
 */
const config = require("../config");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const dsConfig = config.dynamicsConfig;
const GET_DISPATCH_LOCATION_METHOD = "getDispatchLocation()";

/**
 * Request OAuth2 bearer token from Dynamics API.
 * @returns {Promise<string>} Access token for API authentication
 * @throws {Error} If token request fails
 */
async function bearerTokenRequest() {
  try {
    const response = await fetch(dsConfig.bearerTokenRequest.url, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: dsConfig.bearerTokenRequest.grantType,
        client_id: dsConfig.bearerTokenRequest.clientId,
        client_secret: dsConfig.bearerTokenRequest.clientSecret,
        resource: dsConfig.bearerTokenRequest.resource,
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
    throw err; // Re-throw instead of returning error message
  }
}

/**
 * Validate that bearer token is present and properly formatted.
 * @param {string} bearerToken - Token to validate
 * @returns {boolean} True if token is valid
 */
function validateBearerToken(bearerToken) {
  return (
    bearerToken &&
    typeof bearerToken === "string" &&
    !bearerToken.includes("Error")
  );
}

/**
 * Make authenticated HTTP request to Dynamics API.
 * @param {string} bearerToken - OAuth2 bearer token
 * @param {string} applicationId - Application/inspection location ID
 * @returns {Promise<Object>} Response object with status
 */
async function makeDynamicsRequest(bearerToken, applicationId) {
  const token = "Bearer " + bearerToken;
  const url = `${dsConfig.dynamicsUrl}/api/data/v9.2/trd_inspectionlocations(${applicationId})?$select=rms_remosid`;

  const response = await fetch(encodeURI(url), {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  return { response, status: response.status };
}

/**
 * Delay execution for specified milliseconds.
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Handle successful API response and extract REMOS ID.
 * @param {Object} response - HTTP response object
 * @param {number} attempt - Current attempt number for logging
 * @param {string} applicationId - Application ID for logging
 * @returns {Promise<string>} REMOS ID from response
 */
async function handleSuccessResponse(response, attempt, applicationId) {
  const result = await response.json();
  if (attempt > 1) {
    logger.logInfo(
      filenameForLogging,
      GET_DISPATCH_LOCATION_METHOD,
      `Successfully retrieved record for ${applicationId} after ${attempt} attempts`,
    );
  }
  return result.rms_remosid;
}

/**
 * Log HTTP error response without retrying.
 * @param {number} status - HTTP status code
 * @param {string} errorText - Error message text
 * @returns {void}
 */
function logHttpError(status, errorText) {
  const message = `Request failed - HTTP ${status}: ${errorText}`;
  logger.logError(filenameForLogging, GET_DISPATCH_LOCATION_METHOD, message);
}

/**
 * Log caught errors with retry information.
 * @param {number} attempt - Current attempt number
 * @param {number} maxRetries - Maximum retry attempts
 * @param {string} errorMessage - Error message to log
 * @param {number} retryDelayMs - Retry delay in milliseconds
 * @returns {void}
 */
function logCatchError(attempt, maxRetries, errorMessage, retryDelayMs) {
  const isLastAttempt = attempt === maxRetries;
  const message = isLastAttempt
    ? `Final attempt failed with error: ${errorMessage}`
    : `Attempt ${attempt} failed with error: ${errorMessage}, retrying in ${retryDelayMs}ms`;

  logger.logError(filenameForLogging, GET_DISPATCH_LOCATION_METHOD, message);
}

/**
 * Retrieve dispatch location REMOS ID from Dynamics with retry logic.
 * @param {string} applicationId - Application/inspection location ID
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @param {number} retryDelayMs - Delay between retries in ms (default: 2000)
 * @returns {Promise<string|null>} REMOS ID or null if not found
 */
async function getDispatchLocation(
  applicationId,
  maxRetries = 3,
  retryDelayMs = 2000,
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const bearerToken = await bearerTokenRequest();

      if (!validateBearerToken(bearerToken)) {
        const error = new Error(
          `Failed to obtain bearer token: ${bearerToken}`,
        );
        logger.logError(
          filenameForLogging,
          GET_DISPATCH_LOCATION_METHOD,
          error,
        );
        return null;
      }

      const { response, status } = await makeDynamicsRequest(
        bearerToken,
        applicationId,
      );

      if (response.ok) {
        return await handleSuccessResponse(response, attempt, applicationId);
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

module.exports = { getDispatchLocation, bearerTokenRequest };
