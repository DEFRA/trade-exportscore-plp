const matcher_result = require("./matcher-result");
const regex = require("../utilities/regex");
const logger = require("../utilities/logger");

function matchesHeader(regexHeader, packingListSheet) {
  try {
    for (const header in regexHeader) {
      if (!regex.test(regexHeader[header], packingListSheet)) {
        return matcher_result.WRONG_HEADER;
      }
    }
    return matcher_result.CORRECT;
  } catch (err) {
    logger.log_error("app/services/matches-header.js", "matchesHeader()", err);
    return matcher_result.GENERIC_ERROR;
  }
}
module.exports = {
  matchesHeader,
};
