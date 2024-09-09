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

    function callback(x) {
      return x.A === "this";
    }

    // act
    const result = matchesHeader(header, packingListSheet, callback);

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

    function callback(x) {
      return x.A === "this";
    }

    // act
    const result = matchesHeader(header, packingListSheet, callback);

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

    const packingListSheet = [{}];

    function callback(x) {
      return x.A === "this";
    }

    // act
    const result = matchesHeader(header, packingListSheet, callback);

    // assert
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("return incorrect header for -1 row", () => {
    // arrange
    const header = {
      A: "wrong",
    };

    const packingListSheet = [
      {
        A: "header",
      },
    ];

    function callback(x) {
      return x.A === "header";
    }

    // act
    const result = matchesHeader(header, packingListSheet, callback);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
