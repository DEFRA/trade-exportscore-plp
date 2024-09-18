// Helper function to validate string properties and create a search pattern
function createSearchPattern(regex) {
  return new RegExp(regex, "i"); // 'i' makes the search case-insensitive
}

function isValidStringProperty(obj, key) {
  return obj.hasOwnProperty(key) && typeof obj[key] === "string";
}

// Test if any string in the array of objects matches the regex
function test(regex, array) {
  const searchPattern = createSearchPattern(regex);

  for (const obj of array) {
    const stringProperties = Object.keys(obj).filter((key) =>
      isValidStringProperty(obj, key),
    );

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
    const stringProperties = Object.keys(obj).filter((key) =>
      isValidStringProperty(obj, key),
    );

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

module.exports = {
  test,
  findMatch,
};
