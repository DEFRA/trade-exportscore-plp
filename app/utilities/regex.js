// Helper function to validate string properties and create a search pattern
function createSearchPattern(regex) {
  return new RegExp(regex, "i"); // 'i' makes the search case-insensitive
}

function isValidStringProperty(obj, key) {
  return obj.hasOwnProperty(key) && typeof obj[key] === "string";
}

// Extracted function to get valid string properties
function getStringProperties(obj) {
  return Object.keys(obj).filter((key) => isValidStringProperty(obj, key));
}

// Test if any string in the array of objects matches the regex
function test(regex, array) {
  const searchPattern = createSearchPattern(regex);

  for (const obj of array) {
    const stringProperties = getStringProperties(obj);

    for (const key of stringProperties) {
      if (searchPattern.test(obj[key])) {
        return true;
      }
    }
  }

  return false;
}

// Find and return the matched substring in the array of objects
function findMatch(regex, array) {
  const searchPattern = createSearchPattern(regex);

  for (const obj of array) {
    const stringProperties = getStringProperties(obj);

    for (const key of stringProperties) {
      const value = obj[key];
      const match = value.match(searchPattern); // Use match to extract the part of the string that matches
      if (match) {
        return match[0]; // Return only the matching part of the string
      }
    }
  }

  return null;
}

// Check if ALL regex patterns from the array match any string property in the object
function testAllPatterns(regexArray, obj) {
  const searchPatterns = regexArray.map((regex) => createSearchPattern(regex));

  const stringProperties = getStringProperties(obj);

  for (const pattern of searchPatterns) {
    let foundMatch = false;
    for (const key of stringProperties) {
      const value = obj[key];
      if (pattern.test(value)) {
        foundMatch = true;
        break; // Stop searching if a match is found for this pattern
      }
    }

    if (!foundMatch) {
      return false; // If any regex doesn't find a match, return false
    }
  }

  return true; // All patterns have a match in the object
}

module.exports = {
  test,
  findMatch,
  testAllPatterns, // Export the new function
};
