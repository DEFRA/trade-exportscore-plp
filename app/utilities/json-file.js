/**
 * Summary. Sanitise JSON string
 *
 * Description. Applies the current rules for sanitising the JSON string: e.g. remove spaces and empty cells.
 * @param {type}           jsonString The JSON string to sanitise.
 */

function sanitise(jsonString) {
  try {
    // Parse the JSON string into a JavaScript object
    const jsonObj = JSON.parse(jsonString);
    // Recursively sanitise the JSON object
    function sanitiseObject(obj) {
      for (const key in obj) {
        // Ensure only properties directly on the object are being processed
        if (obj.hasOwnProperty(key)) {
          let value = obj[key];

          if (typeof value === "string") {
            // Trim trailing whitespaces
            value = value.trim();

            // Replace empty strings with null
            obj[key] = value === "" ? null : value;
          } else if (typeof value === "object" && value !== null) {
            // Recursively sanitise nested objects or arrays
            sanitiseObject(value);
          }
        }
      }
    }

    // Start sanitising the object
    sanitiseObject(jsonObj);

    // Convert the sanitised object back to a JSON string
    return JSON.stringify(jsonObj);
  } catch (error) {
    console.error("Invalid JSON string provided:", error);
    return null;
  }
}

module.exports = {
  sanitise,
};
