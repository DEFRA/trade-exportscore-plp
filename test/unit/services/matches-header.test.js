const { matchesHeader } = require("../../../app/services/matches-header");
const matcher_result = require("../../../app/services/matcher-result");

describe("matchesHeader", () => {
  test("returns correct header", () => {
    // arrange
    const header = [/this/, /is/, /a/, /test/];

    const packingListSheet = [
      {
        A: "this",
        B: "is",
        C: "a",
        D: "test",
        E: "with",
        F: "optional",
      },
    ];

    // act
    const result = matchesHeader(header, packingListSheet);

    // assert
    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns incorrect header", () => {
    // arrange
    const header = [/this/, /is/, /wrong/];

    const packingListSheet = [
      {
        A: "this",
        B: "is",
        C: "incorrect",
        D: "test",
        E: "with",
        F: "optional",
      },
    ];

    // act
    const result = matchesHeader(header, packingListSheet);

    // assert
    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("return incorrect header for null", () => {
    // arrange
    const header = [/this/, /is/, /a/, /test/];

    const packingListSheet = [{}];

    // act
    const result = matchesHeader(header, packingListSheet);

    // assert
    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("return incorrect header for -1 row", () => {
    // arrange
    const header = [/wrong/];

    const packingListSheet = [
      {
        A: "header",
      },
    ];

    // act
    const result = matchesHeader(header, packingListSheet);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("returns 'Generic Error' for empty json", () => {
    // arrange
    const header = [/header/];

    const packingListSheet = {};

    // act
    const result = matchesHeader(header, packingListSheet);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });
});
