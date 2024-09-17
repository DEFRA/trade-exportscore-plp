const MatcherResult = require("./matcher-result");
const { rowFinder } = require("../utilities/row-finder");

function matchesHeader(matchHeader, packingListSheet, callback) {
  try {
    const headerRow = rowFinder(packingListSheet, callback);
    if (!packingListSheet[headerRow] || headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }

    for (const key in matchHeader) {
      if (!packingListSheet[headerRow][key]?.startsWith(matchHeader[key])) {
        return MatcherResult.WRONG_HEADER;
      }
    }

    return MatcherResult.CORRECT;
  } catch (err) {
    console.error(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matchesHeader,
};
