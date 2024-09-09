const packingList = require("../models/packing-list");
const MatcherResult = require("./matches-result");

function matchesHeader(matchHeader, packingListHeader) {
  for (const key in matchHeader) {
    console.log(packingListHeader[key]);
    if (!packingListHeader || packingListHeader[key] !== matchHeader[key]) {
      console.log(packingListHeader[key]);
      return MatcherResult.WRONG_HEADER;
    }
  }

  return MatcherResult.CORRECT;
}

module.exports = {
  matchesHeader,
};
