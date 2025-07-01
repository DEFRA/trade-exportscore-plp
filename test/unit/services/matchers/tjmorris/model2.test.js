const matcher = require("../../../../../app/services/matchers/tjmorris/model2");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/tjmorris/model2");
const logger = require("../../../../../app/utilities/logger");

const filename = "packinglist.xls";

describe("matchesTjmorris", () => {
  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          A: "Incorrect",
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

  test("returns wrong header for incorrect header values", () => {
    const packingListJson = {
      Sheet1: [
        {
          B: "wrong",
          J: "Treatment Type",
          L: "Description",
          O: "Tariff/Commodity",
          P: "Number of packages",
          R: "Net Weight Kg",
          T: "Country of Origin",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("returns wrong header for invalid header values", () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          L: "Description",
        },
        {
          A: "RMS-GB-000010-001",
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

  test("returns Correct", () => {
    const packingListJson = {
      Sheet1: [
        {
          B: "Nature of Products",
          J: "Treatment Type",
          L: "Description",
          O: "Tariff/Commodity",
          P: "Number of packages",
          R: "Net Weight Kg",
          T: "Country of Origin",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.CORRECT);
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
