/**
 * Async utility functions for service operations
 *
 * Provides reusable helpers for async operations, delays, and token validation.
 */

/**
 * Sleep for a specified duration.
 * @param {number} ms - Duration in milliseconds.
 * @returns {Promise<void>} Promise that resolves after the delay.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate OAuth bearer token format and content.
 * @param {string} bearerToken - The bearer token to validate.
 * @returns {boolean} True if token is valid, false otherwise.
 */
function validateBearerToken(bearerToken) {
  return (
    bearerToken &&
    typeof bearerToken === "string" &&
    !bearerToken.includes("Error")
  );
}

module.exports = {
  sleep,
  validateBearerToken,
};
