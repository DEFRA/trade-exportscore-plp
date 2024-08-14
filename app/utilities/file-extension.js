const MatcherResult = require("../services/matches-result");

function matches(filename, extension) {
  const fileExtension = filename.split(".").pop();
  if (fileExtension.toLowerCase() !== extension.toLowerCase()) {
    return MatcherResult.WRONG_EXTENSIONS;
  } else {
    return MatcherResult.CORRECT;
  }
}

module.exports = {
  matches,
};
