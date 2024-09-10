function test(regex, array) {
  // Ensure the regex is a valid regular expression
  const searchPattern = new RegExp(regex, "i"); // 'i' makes the search case-insensitive

  // Loop through each object in the array
  for (const obj of array) {
    // Loop through the values of each object
    for (const key in obj) {
      // Skip inherited properties
      if (!obj.hasOwnProperty(key)) {
        continue;
      }

      const value = obj[key];

      // Skip non-string values
      if (typeof value !== "string") {
        continue;
      }

      // If the value matches the regular expression, return true
      if (searchPattern.test(value)) {
        return true;
      }
    }
  }

  // If no match was found, return false
  return false;
}

module.exports = {
  test,
};
