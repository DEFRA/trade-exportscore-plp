const matcher = require("../../../../../app/services/matchers/cds/model2");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/cds/model2");
const logger = require("../../../../../app/utilities/logger");

const filename = "packinglist.xlsx";

describe("matchesCdsModel2", () => {
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
    const packingListJson = {
      PackingList_Extract: [
        {},
        {
          K: "INCORRECT",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment numbers of multiple sheets", () => {
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values", () => {
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

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
});
