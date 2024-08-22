const MatcherResult = require("./matches-result");

function matchesHeader(matchHeader, packingListHeader) {
  for (const key in matchHeader) {
    if (!packingListHeader || packingListHeader[key] !== matchHeader[key]) {
      return MatcherResult.WRONG_HEADER;
    }
  }

  return MatcherResult.CORRECT;
}

module.exports = {
  matchesHeader,
};
