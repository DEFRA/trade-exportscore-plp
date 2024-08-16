const MatcherResult = require("../../../../app/services/matches-result");
const fowlerWelchMatcher2 = require("../../../../app/services/fowlerwelch/matcher2");

describe("matchesFowlerWelch2", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });
  test("returns wrong extension for incorrect file extension", () => {
    const filename = "packinglist.xls";
    const packingListJson = {};
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });
  test("returns wrong establishment number for missing establishment number for one sheet", () => {
    const packingListJson = {
      "Cust Ord - Vitacress": [
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
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });
  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const packingListJson = {
      "Cust Ord - Vitacress": [
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
      ARGO: [
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
          M: "RMS-GB-000216-001",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });
  test("returns wrong header for incorrect header values of one sheet", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Cust Ord - Vitacress": [
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
          K: "Item Net Weight (kgs)",
          L: "Item Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
        },
        {
          M: "RMS-GB-000216-002",
        },
      ],
    };
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Cust Ord - Vitacress": [
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
          K: "Item Net Weight (kgs)",
          L: "Item Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
        },
        {
          M: "RMS-GB-000216-002",
        },
      ],
      ARGO: [
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
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000216-001",
        },
      ],
    };
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
  test("returns correct for correct headers for one sheet", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Cust Ord - Vitacress": [
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
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000216-002",
        },
      ],
    };
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
  test("returns correct for correct headers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Cust Ord - Vitacress": [
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
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000216-002",
        },
      ],
      ARGO: [
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
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000216-001",
        },
      ],
    };
    const result = fowlerWelchMatcher2.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});
