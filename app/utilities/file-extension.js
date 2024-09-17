const MatcherResult = require("../services/matcher-result");

function matches(filename, extension) {
  const fileExtension = filename.split(".").pop();
  if (fileExtension.toLowerCase() !== extension.toLowerCase()) {
    return MatcherResult.WRONG_EXTENSION;
  } else {
    return MatcherResult.CORRECT;
  }
}

/**
 * Summary. Checks whether the filename is an Excel file.
 *
 * Description. Checks whether the filename is an Excel file - i.e.: XLS or XLSX.
 * @param {type}           filename The name of the file that will be checked.
 */
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
