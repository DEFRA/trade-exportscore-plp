const regex = require("../../../app/utilities/regex");

describe("test function", () => {
  it("should return true when the regex matches a value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(regex.test("John", array)).toBe(true); // Matches 'John Doe'
    expect(regex.test("Doe", array)).toBe(true); // Matches 'John Doe'
    expect(regex.test("Smith", array)).toBe(true); // Matches 'Jane Smith'
  });

  it("should return false when the regex does not match any value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(regex.test("Berlin", array)).toBe(false); // No match
    expect(regex.test("Michael", array)).toBe(false); // No match
  });

  it("should skip non-string values and still find matches in string values", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
      { job: "Engineer", salary: 50000, active: true },
    ];

    expect(regex.test("John", array)).toBe(true); // Matches 'John Doe'
    expect(regex.test("Engineer", array)).toBe(true); // Matches 'Engineer'
    expect(regex.test("50000", array)).toBe(false); // Should not match number values
    expect(regex.test("true", array)).toBe(false); // Should not match boolean values
  });

  it("should return true when regex matches the beginning or end of a string", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(regex.test("^John", array)).toBe(true); // Matches 'John' at the start
    expect(regex.test("Doe$", array)).toBe(true); // Matches 'Doe' at the end
  });

  it("should return false if the array is empty", () => {
    const array = [];
    expect(regex.test("John", array)).toBe(false); // Empty array
  });

  it("should return false if no objects have matching properties", () => {
    const array = [
      { age: 30, active: true },
      { age: 25, city: "Paris" },
    ];

    expect(regex.test("John", array)).toBe(false); // No string properties to match
  });

  it("should skip inherited properties", () => {
    const parentObject = { name: "Parent Name" };
    const array = [
      Object.create(parentObject), // Inherited property
      { name: "John Doe", age: 30, city: "London" },
    ];

    expect(regex.test("Parent Name", array)).toBe(false); // Should not match inherited property
    expect(regex.test("John", array)).toBe(true); // Matches 'John Doe'
  });
});

describe("findMatch function", () => {
  it("should return the matching value when the regex matches a value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(regex.findMatch("John", array)).toBe("John"); // Matches 'John'
    expect(regex.findMatch("Doe", array)).toBe("Doe"); // Matches 'Doe'
    expect(regex.findMatch("Smith", array)).toBe("Smith"); // Matches 'Jane Smith'
  });

  it("should return the matching substring from a complex string", () => {
    const array = [
      { description: "THE RANGE / RMS-GB-000252-002 / DN8 4HT" },
      { description: "OTHER PRODUCT / RMS-GB-000999 / LOCATION" },
    ];

    expect(regex.findMatch(/RMS-GB-000252(-\d{3})?/, array)).toBe(
      "RMS-GB-000252-002",
    ); // Extracts and matches 'RMS-GB-000252-002'
    expect(regex.findMatch(/RMS-GB-000999/, array)).toBe("RMS-GB-000999"); // Extracts and matches 'RMS-GB-000999'
  });

  it("should return null when the regex does not match any value in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(regex.findMatch("Berlin", array)).toBe(null); // No match
    expect(regex.findMatch("Michael", array)).toBe(null); // No match
  });

  it("should skip non-string values and return matching string values", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
      { job: "Engineer", salary: 50000, active: true },
    ];

    expect(regex.findMatch("John", array)).toBe("John"); // Matches 'John'
    expect(regex.findMatch("Engineer", array)).toBe("Engineer"); // Matches 'Engineer'
    expect(regex.findMatch("50000", array)).toBe(null); // Should not match number values
    expect(regex.findMatch("true", array)).toBe(null); // Should not match boolean values
  });

  it("should return the first match it finds in the object", () => {
    const array = [
      { name: "John Doe", age: 30, city: "London" },
      { name: "Jane Smith", age: 25, city: "Paris" },
    ];

    expect(regex.findMatch("John", array)).toBe("John"); // Returns 'John' as the first match
    expect(regex.findMatch("London", array)).toBe("London"); // Matches 'London'
  });

  it("should return null if the array is empty", () => {
    const array = [];
    expect(regex.findMatch("John", array)).toBe(null); // Empty array
  });

  it("should return null if no objects have matching properties", () => {
    const array = [
      { age: 30, active: true },
      { age: 25, city: "Paris" },
    ];

    expect(regex.findMatch("John", array)).toBe(null); // No string properties to match
  });

  it("should skip inherited properties and return the correct match", () => {
    const parentObject = { name: "Parent Name" };
    const array = [
      Object.create(parentObject), // Inherited property
      { name: "John Doe", age: 30, city: "London" },
    ];

    expect(regex.findMatch("Parent Name", array)).toBe(null); // Should not match inherited property
    expect(regex.findMatch("John", array)).toBe("John"); // Matches 'John'
  });
});
