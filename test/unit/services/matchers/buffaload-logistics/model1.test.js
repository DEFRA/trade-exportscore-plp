const Matcher = require("../../../../../app/services/matchers/buffaload-logistics/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/buffaload-logistics/model1");

const filename = "packingListBuffaloadLogistics1.xlsx";

describe("matchesBuffaloadLogisticsModel1", () => {
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
      Tabelle1: [
        {
          B: "INCORRECT",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
    const packingListJson = {
      Tabelle1: [
        {
          B: "RMS-GB-000098-001",
        },
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
