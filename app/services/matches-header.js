const MatcherResult = require("./matcher-result");
const Regex = require("../utilities/regex");

function matchesHeader(regexHeader, packingListSheet) {
  try {
    for (const header in regexHeader) {
      if (!Regex.test(regexHeader[header], packingListSheet)) {
        return MatcherResult.WRONG_HEADER;
      }
    }
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}
module.exports = {
  matchesHeader,
};
