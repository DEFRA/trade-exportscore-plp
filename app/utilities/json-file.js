const logger = require("../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

// Function to trim and replace empty strings with null
function sanitiseValue(value) {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue === "" ? null : trimmedValue;
  }
  return value;
}

// Function to recursively sanitise objects and arrays
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

// Main sanitise function to handle parsing and logging
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
