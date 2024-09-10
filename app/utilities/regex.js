function test(regex, array) {
  // Ensure the input regex is a valid regular expression
  const searchPattern = new RegExp(regex, "i"); // 'i' makes the search case-insensitive

  // Loop through each object in the array
  for (const obj of array) {
    // Loop through the values of each object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // If the value is a string, test it against the regular expression
        if (typeof value === "string" && searchPattern.test(value)) {
          return true;
        }
      }
    }
  }

  // If no match was found, return false
  return false;
}

module.exports = {
  test,
};
