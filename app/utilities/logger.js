/**
 * Log an error using the standard formatting.
 * @param {string} fileName - The file name (and path - i.e. 'Copy relative path' option in VS Code Explorer window) which is logging the error message.
 * @param {string} method - The method name (and optional method call within the overall method) logging the error message.
 * @param {string} error - The actual error to log.
 */
function logError(fileName, method, error) {
  console.error(
    `Whilst running the '${method}' method in '${fileName}', the PLP application encounterd: ${error}`,
  );
}

/**
 * Log an informationally message using the standard formatting.
 * @param {string} fileName - The file name (and path - i.e. 'Copy relative path' option in VS Code Explorer window) which is logging the informationally message.
 * @param {string} method - The method name (and optional method call within the overall method) logging the informationally message.
 * @param {string} infoMessage - The actual informational message to log.
 */
function logInfo(fileName, method, infoMessage) {
  console.info(
    `Whilst running the '${method}' method in '${fileName}', the PLP application logged info: ${infoMessage}`,
  );
}

module.exports = {
  logError,
  logInfo,
};
