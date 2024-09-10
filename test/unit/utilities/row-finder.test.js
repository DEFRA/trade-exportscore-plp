const { rowFinder } = require("../../../app/utilities/row-finder");

describe("findHeaderRow", () => {
  test.each([
    ["DESCRIPTION", 1],
    ["DESCRIPTIONN", -1],
  ])("when the header is '%s' should return '%s'", (header, expected) => {
    const input = [
      {},
      {
        G: "DESCRIPTION",
      },
    ];
    expect(rowFinder(input, (x) => x.G === header)).toBe(expected);
  });
});
