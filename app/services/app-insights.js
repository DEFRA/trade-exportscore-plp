/**
 * Application Insights configuration
 *
 * Configures and initializes Azure Application Insights for monitoring and telemetry.
 * Sets cloud role name from environment variables and enables console auto-collection.
 */
const appInsights = require("applicationinsights");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Initialize and configure Application Insights.
 * Reads connection string from APPINSIGHTS_CONNECTIONSTRING environment variable.
 * @returns {void}
 */
function setup() {
  try {
    if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
      appInsights
        .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
        .setAutoCollectConsole(true, true)
        .start();

      const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole;
      const appName = process.env.APPINSIGHTS_CLOUDROLE;
      appInsights.defaultClient.context.tags[cloudRoleTag] = appName;

      logger.logInfo(filenameForLogging, "setup()", "App Insights is running!");
    } else {
      logger.logError(
        filenameForLogging,
        "setup()",
        "App Insights is not running!",
      );
    }
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "setup()",
      `App Insights Setup encountered: ${err}`,
    );
  }
}

module.exports = { setup };
