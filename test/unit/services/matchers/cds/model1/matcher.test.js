const Matcher = require("../../../../../../app/services/matchers/cds/model1/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesCdsModel1", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "TruckID",
          B: "Dept",
          C: "SubDept",
          D: "Product",
          E: "# Packages",
          F: "# Units",
          G: "GrossWeight",
          H: "NetWeight",
          I: "NatureOfProduct",
          J: "Treatment",
          K: "PlaceOfDispatch",
        },
        {
          K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
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
      PackingList_Extract: [
        {},
        {
          K: "INCORRECT",
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
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});