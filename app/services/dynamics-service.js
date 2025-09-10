const config = require("../config");
const logger = require("../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const dsConfig = config.dynamicsConfig;
const GET_DISPATCH_LOCATION_METHOD = "getDispatchLocation()";

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

// Helper function to validate bearer token
function validateBearerToken(bearerToken) {
  return (
    bearerToken &&
    typeof bearerToken === "string" &&
    !bearerToken.includes("Error")
  );
}

// Helper function to make HTTP request to Dynamics
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

// Helper function for retry delays
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to log success after retry
function logSuccessAfterRetry(attempt, applicationId) {
  logger.logInfo(
    filenameForLogging,
    GET_DISPATCH_LOCATION_METHOD,
    `Successfully retrieved record for ${applicationId} after ${attempt} attempts`,
  );
}

// Helper function to handle successful response
async function handleSuccessResponse(response, attempt, applicationId) {
  const result = await response.json();
  if (attempt > 1) {
    logSuccessAfterRetry(attempt, applicationId);
  }
  return result.rms_remosid;
}

// Helper function to log HTTP errors
function logHttpError(attempt, maxRetries, status, errorText, retryDelayMs) {
  const isLastAttempt = attempt === maxRetries;
  const message = isLastAttempt
    ? `Final attempt failed - HTTP ${status}: ${errorText}`
    : `HTTP ${status}: ${errorText}, retrying in ${retryDelayMs}ms (attempt ${attempt}/${maxRetries})`;

  logger.logError(filenameForLogging, GET_DISPATCH_LOCATION_METHOD, message);
}

// Helper function to log catch errors
function logCatchError(attempt, maxRetries, errorMessage, retryDelayMs) {
  const isLastAttempt = attempt === maxRetries;
  const message = isLastAttempt
    ? `Final attempt failed with error: ${errorMessage}`
    : `Attempt ${attempt} failed with error: ${errorMessage}, retrying in ${retryDelayMs}ms`;

  logger.logError(filenameForLogging, GET_DISPATCH_LOCATION_METHOD, message);
}

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

      const errorText = await response.text();
      logHttpError(attempt, maxRetries, status, errorText, retryDelayMs);

      if (attempt === maxRetries) {
        return null;
      }

      await sleep(retryDelayMs);
    } catch (err) {
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
