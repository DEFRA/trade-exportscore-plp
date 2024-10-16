const appInsights = require("applicationinsights");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

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
