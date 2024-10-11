const matcherResult = require("../../../../../app/services/matcher-result");
const matcher = require("../../../../../app/services/matchers/fowlerwelch/model1");
const model = require("../../../test-data-and-results/models/fowlerwelch/model1");
const logger = require("../../../../../app/utilities/logger");

describe("matchesFowlerWelch", () => {
  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = matcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment number for one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumber,
      filename,
    );
    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumberMultiple,
      filename,
    );
    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values of one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(
      model.invalid_Model_IncorrectHeader,
      filename,
    );
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(
      model.invalid_Model_IncorrectHeaderMultiple,
      filename,
    );
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("returns correct for correct headers for one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.validModel, filename);
    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns correct for correct headers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.validModel_Multiple, filename);
    expect(result).toBe(matcherResult.CORRECT);
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
    const result = matcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
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
    const result = matcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("if all reauired headers are missing, return wrong header", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.invalidModel_MissingHeaders, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Generic Error' matcher result when an error occurs", () => {
    const result = matcher.matches(null, null);

    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });

  test("should call logger.logError when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "logError");

    matcher.matches(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
