/**
 * Davenport Model 1 matcher tests
 *
 * DEPRECATED: Davenport Model 1 format is no longer supported as of [Work Item: AB#XXXXXX].
 * Matcher now returns NOMATCH for all inputs. Tests remain for historical reference.
 */
const matcher = require("../../../../../app/services/matchers/davenport/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/davenport/model1");
const logger = require("../../../../../app/utilities/logger");

const filename = "packinglist.xlsx";

describe.skip("matchesDavenportModel1 - DEPRECATED", () => {
  test("returns Correct", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment number", () => {
    const result = matcher.matches(
      model.invalidModel_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment numbers of multiple sheets", () => {
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' matcher result for missing header values", () => {
    const result = matcher.matches(model.invalidModel_MissingHeaders, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values", () => {
    const result = matcher.matches(
      model.invalidModel_IncorrectHeaders,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values of multiple sheets", () => {
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

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

  test("skips processing for sheets listed in invalidSheets", () => {
    const packingListJson = {
      Invoice: [
        {
          C: "Commodity Code",
          F: "Description of Goods",
          H: "No. of Pkgs(X)",
          K: "Total Net Weight(X)",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });
});

/**
 * Verify deprecated model returns NOMATCH
 *
 * Ensures the matcher correctly rejects Davenport Model 1 format
 * since it has been deprecated in favor of Model 2.
 */
describe("matchesDavenportModel1 - Deprecation Behavior", () => {
  test("returns NOMATCH for deprecated Davenport Model 1 format", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.NOMATCH);
  });

  test("returns NOMATCH even for previously valid inputs", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.NOMATCH);
  });

  test("logs deprecation message when called", () => {
    const logInfoSpy = jest.spyOn(logger, "logInfo");

    matcher.matches(model.validModel, filename);

    expect(logInfoSpy).toHaveBeenCalledWith(
      expect.any(String),
      "matches()",
      expect.stringContaining("deprecated"),
    );
  });
});
