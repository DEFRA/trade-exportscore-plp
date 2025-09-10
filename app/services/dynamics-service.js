const config = require("../config");
const logger = require("../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const dsConfig = config.dynamicsConfig;

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

async function getDispatchLocation(
  applicationId,
  maxRetries = 3,
  retryDelayMs = 2000,
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const bearerToken = await bearerTokenRequest();

      // Check if token request failed
      if (
        !bearerToken ||
        (typeof bearerToken === "string" && bearerToken.includes("Error"))
      ) {
        const error = new Error(
          `Failed to obtain bearer token: ${bearerToken}`,
        );
        logger.logError(filenameForLogging, "getDispatchLocation()", error);
        return null;
      }

      const token = "Bearer " + bearerToken;
      const url = `${dsConfig.dynamicsUrl}/api/data/v9.2/trd_inspectionlocations(${applicationId})?$select=rms_remosid`;

      const response = await fetch(encodeURI(url), {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const status = response.status;

      if (response.ok) {
        const result = await response.json();
        if (attempt > 1) {
          logger.logInfo(
            filenameForLogging,
            "getDispatchLocation()",
            `Successfully retrieved record for ${applicationId} after ${attempt} attempts`,
          );
        }
        return result.rms_remosid;
      }

      const errorText = await response.text();

      if (attempt === maxRetries) {
        logger.logError(
          filenameForLogging,
          "getDispatchLocation()",
          `Final attempt failed - HTTP ${status}: ${errorText}`,
        );
        return null;
      } else {
        logger.logError(
          filenameForLogging,
          "getDispatchLocation()",
          `HTTP ${status}: ${errorText}, retrying in ${retryDelayMs}ms (attempt ${attempt}/${maxRetries})`,
        );
      }

      // Wait before retrying (except on last attempt)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    } catch (err) {
      if (attempt === maxRetries) {
        logger.logError(
          filenameForLogging,
          "getDispatchLocation()",
          `Final attempt failed with error: ${err.message}`,
        );
        return null;
      } else {
        logger.logError(
          filenameForLogging,
          "getDispatchLocation()",
          `Attempt ${attempt} failed with error: ${err.message}, retrying in ${retryDelayMs}ms`,
        );
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  return null; // Should not reach here, but safety fallback
}

module.exports = { getDispatchLocation, bearerTokenRequest };
