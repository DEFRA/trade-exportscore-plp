const Regex = require("../../../app/utilities/regex");

describe("test function", () => {
  it("should return true when the regex matches a value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(Regex.test("John", array)).toBe(true); // Matches 'John Doe'
    expect(Regex.test("Doe", array)).toBe(true); // Matches 'John Doe'
    expect(Regex.test("Smith", array)).toBe(true); // Matches 'Jane Smith'
  });

  it("should return false when the regex does not match any value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(Regex.test("Berlin", array)).toBe(false); // No match
    expect(Regex.test("Michael", array)).toBe(false); // No match
  });

  it("should skip non-string values and still find matches in string values", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
      { job: "Engineer", salary: 50000, active: true },
    ];

    expect(Regex.test("John", array)).toBe(true); // Matches 'John Doe'
    expect(Regex.test("Engineer", array)).toBe(true); // Matches 'Engineer'
    expect(Regex.test("50000", array)).toBe(false); // Should not match number values
    expect(Regex.test("true", array)).toBe(false); // Should not match boolean values
  });

  it("should return true when regex matches the beginning or end of a string", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(Regex.test("^John", array)).toBe(true); // Matches 'John' at the start
    expect(Regex.test("Doe$", array)).toBe(true); // Matches 'Doe' at the end
  });

  it("should return false if the array is empty", () => {
    const array = [];
    expect(Regex.test("John", array)).toBe(false); // Empty array
  });

  it("should return false if no objects have matching properties", () => {
    const array = [
      { age: 30, active: true },
      { age: 25, city: "Paris" },
    ];

    expect(Regex.test("John", array)).toBe(false); // No string properties to match
  });

  it("should skip inherited properties", () => {
    const parentObject = { name: "Parent Name" };
    const array = [
      Object.create(parentObject), // Inherited property
      { name: "John Doe", age: 30, city: "London" },
    ];

    expect(Regex.test("Parent Name", array)).toBe(false); // Should not match inherited property
    expect(Regex.test("John", array)).toBe(true); // Matches 'John Doe'
  });
});
