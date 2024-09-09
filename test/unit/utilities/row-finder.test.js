const { rowFinder } = require("../../../app/utilities/row-finder");
const MatcherResult = require("../../../app/services/matches-result");

describe("findHeaderRow", () => {
  test("should return the correct index of header", () => {
    const input = [
      {},
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
    ];

    const result = rowFinder(input, (x) => x.G === "Quantity");
    expect(result).toBe(1);
  });
  test("should return -1 when header doesn't exist in a specific column", () => {
    const input = [
      {},
      {
        C: "DESCRIPTION",
        G: "Quantity",
        H: "Net Weight (KG)",
        E: "Commodity Code",
      },
    ];
    const result = rowFinder(input, (x) => x.C === "description");
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
