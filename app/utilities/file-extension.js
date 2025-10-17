const matcherResult = require("../services/matcher-result");

function matches(filename, extension) {
  const fileExtension = filename.split(".").pop();
  if (fileExtension.toLowerCase() === extension.toLowerCase()) {
    return matcherResult.CORRECT;
  } else {
    return matcherResult.WRONG_EXTENSION;
  }
}

function isExcel(filename) {
  // Check for both 'xls' and 'xlsx' extensions
  return (
    matches(filename, "xls") === matcherResult.CORRECT ||
    matches(filename, "xlsx") === matcherResult.CORRECT
  );
}

function isPdf(filename) {
  return matches(filename, "pdf") === matcherResult.CORRECT;
}

function isCsv(filename) {
  return matches(filename, "csv") === matcherResult.CORRECT;
}

module.exports = {
  matches,
  isExcel,
  isPdf,
  isCsv,
};
