const { matchesHeader } = require("../../../app/services/matches-header");
const matcherResult = require("../../../app/services/matcher-result");

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
    expect(result).toBe(matcherResult.CORRECT);
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
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return incorrect header for null", () => {
    // arrange
    const header = [/this/, /is/, /a/, /test/];

    const packingListSheet = [{}];

    // act
    const result = matchesHeader(header, packingListSheet);

    // assert
    expect(result).toBe(matcherResult.WRONG_HEADER);
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

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("returns generic error for empty json", () => {
    // arrange
    const header = [/header/];

    const packingListSheet = {};

    // act
    const result = matchesHeader(header, packingListSheet);

    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });
});
