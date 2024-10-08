const matcher = require("../../../../../app/services/matchers/tescos/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/tescos/model1");

describe("matchesTescoModel1", () => {
  test("returns Correct", () => {
    const filename = "PackingListTesco1.xlsx";

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

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
