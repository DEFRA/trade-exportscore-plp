const {
  noRemosMatch,
} = require("../../../../../app/services/matchers/no-match/model1");

describe("matchesNoMatch", () => {
  test.each([
    [true, "RMS-GB-000000-000"],
    [false, "RMS-GB-0000000-000"],
    [true, "RMS-GB-000000"],
  ])("returns '%s' for '%s'", (expected, remos) => {
    const model = {
      pl: [
        {
          remos: remos,
        },
      ],
    };
    const result = noRemosMatch(model);
    expect(result).toBe(expected);
  });
});
