const Matcher = require("../../../../../app/services/matchers/sainsburys/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-helpers/models/sainsburys/model1/data-model");

describe("matchesSainsburysModel1", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          N: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Product / Part Number",
          E: "Product / Part Number Description",
          F: "Packed Singles",
          G: "Packages",
          H: "Net\nWeight / Package KG",
          I: "Gross\nWeight / Package KG",
          J: "Packaging Type",
          K: "Excise Code",
          L: "Final Destination ID",
          M: "Dispatch Unit ID",
          N: "RMS Number (based on depot)",
          O: "Commodity Code",
        },
        {
          N: "RMS-GB-000094-001",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns Correct", () => {
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });
});
