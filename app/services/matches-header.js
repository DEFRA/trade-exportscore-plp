const matcherResult = require("./matcher-result");
const regex = require("../utilities/regex");
const logger = require("../utilities/logger");

function matchesHeader(regexHeader, packingListSheet) {
  try {
    for (const header in regexHeader) {
      if (!regex.test(regexHeader[header], packingListSheet)) {
        return matcherResult.WRONG_HEADER;
      }
    }
    return matcherResult.CORRECT;
  } catch (err) {
    logger.log_error("app/services/matches-header.js", "matchesHeader()", err);
    return matcherResult.GENERIC_ERROR;
  }
}
module.exports = {
  matchesHeader,
};
