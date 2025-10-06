const path = require("path");
const fs = require("fs");

const { convertCsvToJson } = require("../../../../app/utilities/csv-utility");

describe("csv-utility.convertCsvToJson", () => {
  test("parses a simple CSV file into arrays", async () => {
    const csvPath = path.join(__dirname, "./simple.csv");
    const results = await convertCsvToJson(csvPath);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(3);
    expect(results[0]).toEqual(["name", "age"]);
    expect(results[1]).toEqual(["Alice", "30"]);
    expect(results[2]).toEqual(["Bob", "25"]);
  });
});
