const matcher = require("../../../../../app/services/matchers/nisa/model2");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/nisa/model2");

describe("matchesNisa2", () => {
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";

    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      sheet: [
        {},
        {
          A: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      sheet: [
        {
          A: "NOT",
          J: "CORRECT",
          L: "HEADER",
        },
        {
          A: "RMS-GB-000025-003",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
