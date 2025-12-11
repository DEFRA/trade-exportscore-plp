/**
 * Unit tests for regex utilities.
 *
 * Covers happy paths and key edge cases for:
 * - test()
 * - findMatch()
 * - testAllPatterns()
 * - findUnit()
 * - findAllMatches()
 * - addMatch()
 * - positionFinder()
 */

const regex = require("../../../../app/utilities/regex");

describe("utilities/regex", () => {
  const rows = [
    { A: "Hello RMS-GB-123456-789", B: "weight KGS", C: 100 },
    { A: "No match here", B: "kilograms", C: "text" },
    { A: "Commodity: apples", B: "Net Weight: 12.5 KILOS", C: null },
  ];

  test("test() returns true when any property matches", () => {
    expect(regex.test(/RMS-GB-\d{6}-\d{3}/, rows)).toBe(true);
  });

  test("test() returns false when no properties match", () => {
    const data = [{ A: "foo" }, { B: "bar" }];
    expect(regex.test(/baz/, data)).toBe(false);
  });

  test("findMatch() returns first matched substring", () => {
    const match = regex.findMatch(/RMS-GB-\d{6}-\d{3}/, rows);
    expect(match).toBe("RMS-GB-123456-789");
  });

  test("findMatch() returns null when no match", () => {
    const match = regex.findMatch(/XYZ/, rows);
    expect(match).toBeNull();
  });

  test("testAllPatterns() returns true when all patterns match some property", () => {
    const patterns = [/Hello/i, /KGS|kilograms/i];
    expect(regex.testAllPatterns(patterns, rows[0])).toBe(true);
  });

  test("testAllPatterns() returns false when any pattern does not match", () => {
    const patterns = [/Hello/i, /missing/i];
    expect(regex.testAllPatterns(patterns, rows[0])).toBe(false);
  });

  test("findUnit() extracts KGS/KILOGRAMS/KILOS case-insensitively", () => {
    expect(regex.findUnit("Total weight: 10 KGS")).toBe("KGS");
    expect(regex.findUnit("Total WEIGHT: kilograms")).toBe("kilograms");
    expect(regex.findUnit("Net: 12.5 kilos")).toBe("kilos");
    expect(regex.findUnit("no unit here")).toBeNull();
  });

  test("findAllMatches() collects unique matches (case-insensitive)", () => {
    const pattern = /(RMS-GB-\d{6}-)\d{3}/i; // capture base part
    const data = [
      { A: "RMS-GB-123456-789" },
      { B: "rms-gb-123456-789" },
      { C: "RMS-GB-654321-000" },
    ];
    const matches = regex.findAllMatches(pattern, data, []);
    expect(matches).toEqual(["RMS-GB-123456-", "RMS-GB-654321-"]);
  });

  test("addMatch() is case-insensitive and avoids duplicates", () => {
    const arr = regex.addMatch("KGS", []);
    expect(arr).toEqual(["KGS"]);
    const arr2 = regex.addMatch("kgs", arr);
    expect(arr2).toEqual(["KGS"]);
  });

  test("positionFinder() returns row index and column key for first match", () => {
    const [rowIndex, colKey] = regex.positionFinder(rows, /RMS-GB-\d{6}-\d{3}/);
    expect(rowIndex).toBe(0);
    expect(colKey).toBe("A");
  });

  test("positionFinder() returns [null, null] when not found", () => {
    const [rowIndex, colKey] = regex.positionFinder(rows, /NOT-THERE/);
    expect(rowIndex).toBeNull();
    expect(colKey).toBeNull();
  });

  test("remosRegex matches valid RMS code and rejects invalid", () => {
    expect(regex.remosRegex.test("RMS-GB-123456-789")).toBe(true);
    expect(regex.remosRegex.test("RMS-GB-12345-789")).toBe(false);
    expect(regex.remosRegex.test("XXS-GB-123456-789")).toBe(false);
  });
});
