const matcher_result = require("../services/matcher-result");

function matches(filename, extension) {
  const fileExtension = filename.split(".").pop();
  if (fileExtension.toLowerCase() !== extension.toLowerCase()) {
    return matcher_result.WRONG_EXTENSION;
  } else {
    return matcher_result.CORRECT;
  }
}

function isExcel(filename) {
  // Check for both 'xls' and 'xlsx' extensions
  return (
    matches(filename, "xls") === matcher_result.CORRECT ||
    matches(filename, "xlsx") === matcher_result.CORRECT
  );
}

module.exports = {
  matches,
  isExcel,
};
