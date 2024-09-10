const Regex = require("../../../app/utilities/regex");

describe("test function", () => {
  it("should return true when the regex matches a value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    // Regex should match "John"
    expect(Regex.test("John", array)).toBe(true);

    // Regex should match "Doe"
    expect(Regex.test("Doe", array)).toBe(true);

    // Regex should match case-insensitively
    expect(Regex.test("john", array)).toBe(true);

    // Regex should match "Smith"
    expect(Regex.test("Smith", array)).toBe(true);
  });

  it("should return false when the regex does not match any value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    // Regex should not match "Berlin"
    expect(Regex.test("Berlin", array)).toBe(false);

    // Regex should not match numbers (e.g., "30" or "25")
    expect(Regex.test("30", array)).toBe(false);

    // Regex should not match non-existent name
    expect(Regex.test("Michael", array)).toBe(false);
  });

  it("should return true when the regex matches the start or end of a string", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    // Regex should match names that start with "J"
    expect(Regex.test("^J", array)).toBe(true);

    // Regex should match names that end with "Doe"
    expect(Regex.test("Doe$", array)).toBe(true);
  });

  it("should handle arrays with mixed types of values", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
      { title: "Engineer", salary: null, active: true },
    ];

    // Regex should match string values, not other types like numbers, booleans, or nulls
    expect(Regex.test("Engineer", array)).toBe(true);
    expect(Regex.test("true", array)).toBe(false); // Should not match booleans
    expect(Regex.test("null", array)).toBe(false); // Should not match nulls
  });
});
