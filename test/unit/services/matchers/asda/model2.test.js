const matcher = require("../../../../../app/services/matchers/asda/model2");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/asda/model2");
const logger = require("../../../../../app/utilities/logger");

describe("matchesAsdaModel2", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xls";

    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          H: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xls";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xls";
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          B: "NOT",
          D: "CORRECT",
          F: "HEADER",
        },
        {
          H: "RMS-GB-000015-010",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xls";
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
});
