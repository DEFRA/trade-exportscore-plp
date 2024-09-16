const MatcherResult = require("../../../app/services/matcher-result");

describe("matcherResultContainsCorrectValues", () => {
  test("contains the Wrong Extension definition", () => {
    expect(MatcherResult.WRONG_EXTENSION).toBeDefined();
  });

  test("contains the Wrong Extension value", () => {
    var result = MatcherResult.WRONG_EXTENSION;

    expect(result).toBe(0);
  });

  test("contains the Wrong Establishment Numder definition", () => {
    expect(MatcherResult.WRONG_ESTABLISHMENT_NUMBER).toBeDefined();
  });

  test("contains the Wrong Establishment Numder value", () => {
    var result = MatcherResult.WRONG_ESTABLISHMENT_NUMBER;

    expect(result).toBe(1);
  });

  test("contains the Wrong Header definition", () => {
    expect(MatcherResult.WRONG_HEADER).toBeDefined();
  });

  test("contains the Wrong Header value", () => {
    var result = MatcherResult.WRONG_HEADER;

    expect(result).toBe(2);
  });

  test("contains the Generic Error definition", () => {
    expect(MatcherResult.GENERIC_ERROR).toBeDefined();
  });

  test("contains the Generic Error value", () => {
    var result = MatcherResult.GENERIC_ERROR;

    expect(result).toBe(3);
  });

  test("contains the 'Correct' definition", () => {
    expect(MatcherResult.CORRECT).toBeDefined();
  });

  test("contains the 'Correct' value", () => {
    var result = MatcherResult.CORRECT;

    expect(result).toBe(4);
  });

  test("contains the 'valid header but no data' definition", () => {
    expect(MatcherResult.VALID_HEADER_NO_DATA).toBeDefined();
  });

  test("contains the 'valid header but no data' value", () => {
    var result = MatcherResult.VALID_HEADER_NO_DATA;

    expect(result).toBe(5);
  });

  test("contains the 'empty file' definition", () => {
    expect(MatcherResult.EMPTY_FILE).toBeDefined();
  });

  test("contains the 'empty file' value", () => {
    var result = MatcherResult.EMPTY_FILE;

    expect(result).toBe(6);
  });
});
