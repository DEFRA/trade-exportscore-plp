const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matches(packingListJson, filename) {

  return MatcherResult.GENERIC_ERROR;
}

module.exports = {
  matches,
};
