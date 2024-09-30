const matcher = require("../../../../../app/services/matchers/sainsburys/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/sainsburys/model1");

const filename = "packinglistSainsburys1.xlsx";

describe("matchesSainsburysModel1", () => {
  test("returns 'Generic Error' for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });

  test("returns 'Wrong Establishment Number' for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          N: "Incorrect",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
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

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("returns 'Correct' for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });
});
