const matcher_result = require("../../../app/services/matcher-result");

describe("matcherResultContainsCorrectValues", () => {
  test("contains the Wrong Extension definition", () => {
    expect(matcher_result.WRONG_EXTENSION).toBeDefined();
  });

  test("contains the Wrong Extension value", () => {
    var result = matcher_result.WRONG_EXTENSION;

    expect(result).toBe(0);
  });

  test("contains the Wrong Establishment Numder definition", () => {
    expect(matcher_result.WRONG_ESTABLISHMENT_NUMBER).toBeDefined();
  });

  test("contains the Wrong Establishment Numder value", () => {
    var result = matcher_result.WRONG_ESTABLISHMENT_NUMBER;

    expect(result).toBe(1);
  });

  test("contains the Wrong Header definition", () => {
    expect(matcher_result.WRONG_HEADER).toBeDefined();
  });

  test("contains the Wrong Header value", () => {
    var result = matcher_result.WRONG_HEADER;

    expect(result).toBe(2);
  });

  test("contains the Generic Error definition", () => {
    expect(matcher_result.GENERIC_ERROR).toBeDefined();
  });

  test("contains the Generic Error value", () => {
    var result = matcher_result.GENERIC_ERROR;

    expect(result).toBe(3);
  });

  test("contains the 'Correct' definition", () => {
    expect(matcher_result.CORRECT).toBeDefined();
  });

  test("contains the 'Correct' value", () => {
    var result = matcher_result.CORRECT;

    expect(result).toBe(4);
  });
});
