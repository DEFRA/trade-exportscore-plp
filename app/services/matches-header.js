const matcherResult = require("./matcher-result");
const regex = require("../utilities/regex");
const logger = require("../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function matchesHeader(regexHeader, packingListSheet) {
  try {
    for (const header in regexHeader) {
      if (!regex.test(regexHeader[header], packingListSheet)) {
        return matcherResult.WRONG_HEADER;
      }
    }
    return matcherResult.CORRECT;
  } catch (err) {
    logger.logError(filenameForLogging, "matchesHeader()", err);
    return matcherResult.GENERIC_ERROR;
  }
}
module.exports = {
  matchesHeader,
};
