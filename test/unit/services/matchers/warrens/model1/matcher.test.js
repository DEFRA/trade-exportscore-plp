const MatcherResult = require("../../../../../../app/services/matches-result");
const warrensMatcher = require("../../../../../../app/services/matchers/warrens/model1/matcher");

describe("matchesWarrens1", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong extension for incorrect file extension", () => {
    const filename = "packinglist.xls";
    const packingListJson = {};
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("returns wrong establishment number for missing establishment number for one sheet", () => {
    const packingListJson = {
      sheet: [
        {
          F: "Description of goods",
        },
        {
          M: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const packingListJson = {
      sheet: [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-123",
        },
      ],
      sheet2: [
        {
          F: "Description of goods",
        },
        {
          M: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values of one sheet", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      sheet: [
        {
          C: "Incorrect",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-002",
        },
      ],
    };
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      sheet: [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-002",
        },
      ],
      sheet2: [
        {
          C: "Incorrect",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-002",
        },
      ],
    };
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns correct for correct headers for one sheet", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      sheet: [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-002",
        },
      ],
    };
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns correct for correct headers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      sheet: [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-002",
        },
      ],
      sheet2: [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000174-002",
        },
      ],
    };
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});
