const matcher = require("../../../../../app/services/matchers/tescos/model2");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/tescos/model2");

describe("matchesTescoModel2", () => {
  test("returns Correct", () => {
    const filename = "PackingListTesco2.xlsx";

    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet2: [
        {},
        {},
        {
          M: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet2: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {},
        {
          M: "RMS-GB-000015-009",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
