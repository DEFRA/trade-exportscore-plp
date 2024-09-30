const matcher = require("../../../../../app/services/matchers/nisa/model2");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/nisa/model2");

const filename = "packingListNisa2.xlsx";

describe("matchesNisa2", () => {
  test("returns 'Correct' for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns 'Generic Error' for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });

  test("returns 'Wrong Establishment Number' for missing establishment number", () => {
    const packingListJson = {
      sheet: [
        {},
        {
          A: "INCORRECT",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
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

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
