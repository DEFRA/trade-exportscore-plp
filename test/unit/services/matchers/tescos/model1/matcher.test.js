const Matcher = require("../../../../../../app/services/matchers/tescos/model1/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesTescoModel1", () => {
  test("returns Correct", () => {
    const filename = "PackingListTesco1.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          AT: "RMS-GB-000022-998",
        },
        {
          G: "Product/ Part Number description",
          L: "Tariff Code UK",
          AS: "Treatment Type",
          AT: "Green Lane",
          BR: "Packages",
          BT: "Gross Weight",
          BU: "Net Weight",
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

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          AT: "INCORRECT",
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

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          AT: "RMS-GB-000022-001",
        },
        {
          G: "NOT",
          L: "CORRECT",
          AS: "HEADER",
          AT: "Green Lane",
          BR: "Packages",
          BT: "Gross Weight",
          BU: "Net Weight",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
