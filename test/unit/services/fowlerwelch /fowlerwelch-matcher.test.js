const MatcherResult = require("../../../../app/services/matches-result");
const FowlerWelchMatcher = require("../../../../app/services/fowlerwelch/matcher");

describe("matchesFowlerWelch", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = FowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong extension for incorrect file extension", () => {
    const filename = "packinglist.xls";
    const packingListJson = {};
    const result = FowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      "Customer Order": [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          M: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = FowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Customer Order": [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Online Check",
          E: "Meursing Code",
          F: "Description of goods",
          G: "Country of Origin",
          H: "No. of pkgs",
          I: "Type of pkgs",
          J: "Total Gross Weight",
          K: "Total Net Weight",
          L: "Total Line Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
          P: "Secondary Qty",
          Q: "Cert Type Req",
          R: "Cert Number",
        },
        {
          M: "RMS-GB-000216-004",
        },
      ],
    };
    const result = FowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns true", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Customer Order": [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          A: "Item",
          B: "Product code",
          C: "Commodity code",
          D: "Online Check",
          E: "Meursing code",
          F: "Description of goods",
          G: "Country of Origin",
          H: "No. of pkgs \r\n(1547)",
          I: "Type of pkgs",
          J: "Total Gross Weight \r\n(11015.700kgs)",
          K: "Total Net Weight \r\n(7921.700kgs)",
          L: "Total Line Value \r\n(41662.4)",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
          P: "Secondary Qty",
          Q: "Cert Type Req",
          R: "Cert Number",
        },
        {
          M: "RMS-GB-000216-004",
        },
      ],
    };
    const result = FowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});
