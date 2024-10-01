const matcherResult = require("../services/matcher-result");

function matches(filename, extension) {
  const fileExtension = filename.split(".").pop();
  if (fileExtension.toLowerCase() !== extension.toLowerCase()) {
    return matcherResult.WRONG_EXTENSION;
  } else {
    return matcherResult.CORRECT;
  }
}

function isExcel(filename) {
  // Check for both 'xls' and 'xlsx' extensions
  return (
    matches(filename, "xls") === matcherResult.CORRECT ||
    matches(filename, "xlsx") === matcherResult.CORRECT
  );
}

module.exports = {
  matches,
  isExcel,
};
