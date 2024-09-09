const MatcherResult = require("../../../../../../app/services/matches-result");
const fowlerWelchMatcher = require("../../../../../../app/services/matchers/fowlerwelch/model1/matcher");
const model = require("../../../../test-helpers/fowlerwelch/model1/data-model");

describe("matchesFowlerWelch", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number for one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumber,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumberMultiple,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values of one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(
      model.invalid_Model_IncorrectHeader,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(
      model.invalid_Model_IncorrectHeaderMultiple,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns correct for correct headers for one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(model.validModel, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns correct for correct headers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = fowlerWelchMatcher.matches(
      model.validModel_Multiple,
      filename,
    );
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("if the key is equal to 'K' and doesn't include 'Net Weight' in its header, return wrong header", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Cust Ord - Vitacress": [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "No. of pkgs",
          K: "Item (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000216-002",
        },
      ],
    };
    const result = fowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("if the header doesn't start with the header[key], return wrong header", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Cust Ord - Vitacress": [
        {
          C: "Commodity code",
          F: "Description of goods",
          H: "(318)",
          K: "Item Net Weight (kgs)",
          N: "Treatment Type (Chilled /Ambient)",
        },
        {
          M: "RMS-GB-000216-002",
        },
      ],
    };
    const result = fowlerWelchMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
