const Matcher = require("../../../../../app/services/matchers/cds/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/cds/model1");

const filename = "packinglistCds.xlsx";

describe("matchesCdsModel1", () => {
  test("returns 'Correct' for valid model", () => {
    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns 'Generic Error' for empty json", () => {
    const packingListJson = {};

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });

  test("returns 'Wrong Establishment Number' for missing establishment number", () => {
    const packingListJson = {
      PackingList_Extract: [
        {},
        {
          K: "INCORRECT",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
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

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
