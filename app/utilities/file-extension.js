const MatcherResult = require("../services/matcher-result");

function matches(filename, extension) {
  const fileExtension = filename.split(".").pop();
  if (fileExtension.toLowerCase() !== extension.toLowerCase()) {
    return MatcherResult.WRONG_EXTENSIONS;
  } else {
    return MatcherResult.CORRECT;
  }
}

function isExcel(filename) {
  // Check for both 'xls' and 'xlsx' extensions
  return (
    matches(filename, "xls") === MatcherResult.CORRECT ||
    matches(filename, "xlsx") === MatcherResult.CORRECT
  );
}

module.exports = {
  matches,
  isExcel,
};
