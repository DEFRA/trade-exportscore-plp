/**
 * JSON sanitisation helpers
 *
 * Provides a small utility to parse a JSON string and normalise empty string
 * values to `null`. This is useful when external sources may provide empty
 * strings where downstream code expects `null` for absent values.
 */

const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Trim strings and convert empty strings to null.
 * @param {*} value - Value to sanitise
 * @returns {*} Trimmed string, null for empty strings, or original value
 */
function sanitiseValue(value) {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue === "" ? null : trimmedValue;
  }
  return value;
}

/**
 * Recursively walk objects/arrays and sanitise leaf values.
 * @param {Object|Array} obj - Object or array to sanitise
 * @returns {void}
 */
function sanitiseObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        // Recursively sanitise nested objects or arrays
        sanitiseObject(value);
      } else {
        // Sanitise non-object values
        obj[key] = sanitiseValue(value);
      }
    }
  }
}

/**
 * Parse JSON string, sanitise the object, and return JSON string.
 * @param {string} jsonString - JSON string to sanitise
 * @returns {string|null} Sanitised JSON string or null on parse error
 */
function sanitise(jsonString) {
  try {
    const jsonObj = JSON.parse(jsonString); // Parse the JSON string

    sanitiseObject(jsonObj); // Sanitise the parsed object

    return JSON.stringify(jsonObj); // Convert back to JSON string
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "sanitise()",
      `Invalid JSON string provided: ${err}`,
    );
    return null;
  }
}

module.exports = {
  sanitise,
};
