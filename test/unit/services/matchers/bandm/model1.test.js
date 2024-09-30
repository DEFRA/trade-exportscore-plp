const matcher = require("../../../../../app/services/matchers/bandm/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/bandm/model1");

const filename = "packinglistBandM.xlsx";

describe("matchesBandMModel1", () => {
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
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "INCORRECT",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "RMS-GB-000005-001",
        },
        {},
        {},
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
