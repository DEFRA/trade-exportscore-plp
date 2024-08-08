const Matcher = require("../../../../../../app/services/matchers/tescos/model3/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesTescoModel3", () => {
  // ToDo - fix this!!!
  test.skip("returns Correct", () => {
    const filename = "PackingListTesco3.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "RMS-GB-000022-999",
        },
        {
          A: "Product/ Part Number description",
          B: "Tariff Code UK",
          C: "Treatment Type",
          D: "Green Lane",
          E: "Packages",
          F: "Gross Weight",
          G: "Net Weight",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test.skip("returns wrong establishment number for missing establishment number", () => {
    // ToDo - fix this!!!
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test.skip("return wrong header for incorrect header values", () => {
    // ToDo - fix this!!!
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "RMS-GB-000022-001",
        },
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Green Lane",
          E: "Packages",
          F: "Gross Weight",
          G: "Net Weight",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
