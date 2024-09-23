/**
 * Log an error using the standard formatting.
 * @param {string} file_name - The file name (and path) which is logging the error message.
 * @param {string} method - The method name (and optional method call within the overall method) logging the error message.
 * @param {string} error - The actual error to log.
 */
function log_error(file_name, method, error) {
  console.error(
    `Whilst running the '${method}' method in '${file_name}', the PLP application encounterd: ${error}`,
  );
}

/**
 * Log an informationally message using the standard formatting.
 * @param {string} file_name - The file name (and path) which is logging the informationally message.
 * @param {string} method - The method name (and optional method call within the overall method) logging the informationally message.
 * @param {string} info_message - The actual informational message to log.
 */
function log_info(file_name, method, info_message) {
  console.info(
    `Whilst running the '${method}' method in '${file_name}', the PLP application logged info: ${info_message}`,
  );
}

module.exports = {
  log_error,
  log_info,
};