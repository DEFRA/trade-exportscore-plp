const { matchesHeader } = require("../../../app/services/matches-header");
const MatcherResult = require("../../../app/services/matches-result");

describe("matchesHeader", () => {
  test("returns correct header", () => {
    // arrange
    const header = {
      A: "this",
      B: "is",
      C: "a",
      D: "test",
    };

    const packingListHeader = {
      A: "this",
      B: "is",
      C: "a",
      D: "test",
      E: "with",
      F: "optional",
    };

    // act
    const result = matchesHeader(header, packingListHeader);

    // assert
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns incorrect header", () => {
    // arrange
    const header = {
      A: "this",
      B: "is",
      C: "a",
      D: "test",
    };

    const packingListHeader = {
      A: "this",
      B: "is",
      C: "incorrect",
      D: "test",
      E: "with",
      F: "optional",
    };

    // act
    const result = matchesHeader(header, packingListHeader);

    // assert
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("return incorrect header for null", () => {
    // arrange
    const header = {
      A: "this",
      B: "is",
      C: "a",
      D: "test",
    };

    const packingListHeader = {};

    // act
    const result = matchesHeader(header, packingListHeader);

    // assert
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
