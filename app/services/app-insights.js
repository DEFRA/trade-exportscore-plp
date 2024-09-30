const appInsights = require("applicationinsights");
const logger = require("./../utilities/logger");
const logAppInsightsPath = "app/services/app-insights.js";

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
      logger.log_info(
        logAppInsightsPath,
        "setup()",
        "App Insights is running!"
      );
    } else {
      logger.log_error(
        logAppInsightsPath,
        "setup()",
        "App Insights is not running!"
      );
    }
  } catch (err) {
    logger.log_error(
      logAppInsightsPath,
      "setup()",
      `App Insights Setup encountered: ${err}`
    );
  }
}

module.exports = { setup };
