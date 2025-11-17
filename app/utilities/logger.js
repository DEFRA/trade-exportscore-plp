/**
 * Logger utility
 *
 * Provides standardized logging functions for error and informational messages.
 * All logs include filename and method context for debugging.
 */

/**
 * Log an error using the standard formatting.
 * @param {string} fileName - File name and path logging the error
 * @param {string} method - Method name logging the error
 * @param {string} error - Error to log
 * @returns {void}
 */
function logError(fileName, method, error) {
  console.error(
    `Whilst running the '${method}' method in '${fileName}', the PLP application encounterd: ${error}`,
  );
}

/**
 * Log an informational message using the standard formatting.
 * @param {string} fileName - File name and path logging the message
 * @param {string} method - Method name logging the message
 * @param {string} infoMessage - Informational message to log
 * @returns {void}
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
