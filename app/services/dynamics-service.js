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
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    return json.access_token;
  } catch (err) {
    logger.logError(filenameForLogging, "bearerTokenRequest()", err);
    return err.message;
  }
}

async function getDispatchLocation(applicationId) {
  const token = "Bearer " + (await bearerTokenRequest());
  const url = `${dsConfig.dynamicsUrl}/api/data/v9.2/trd_inspectionlocations(${applicationId})?$select=rms_remosid`;

  try {
    const response = fetch(encodeURI(url), {
      method: "Get",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const resp = await response;
    const status = resp.status;
    logger.logInfo(
      filenameForLogging,
      "patchPackingListCheck()",
      `Select ${applicationId}, status ${status}`,
    );

    const result = await resp.json();
    return result.rms_remosid;
  } catch (err) {
    logger.logError(filenameForLogging, "patchPackingListCheck()", err);
    throw err;
  }
}

module.exports = { getDispatchLocation, bearerTokenRequest };
