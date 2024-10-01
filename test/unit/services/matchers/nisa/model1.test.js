const matcher = require("../../../../../app/services/matchers/nisa/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/nisa/model1");

const filename = "packingListNisa1.xlsx";

describe("matchesNisa", () => {
  test("returns 'Correct' for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(
      packingListJson,
      `emptyfilename-${filename}`,
    );

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Valid Header, no data' for file without items", () => {
    const result = matcher.matches(model.validHeadersNoData, filename);

    expect(result).toBe(matcherResult.VALID_HEADERS_NO_DATA);
  });

  test("returns 'Wrong Establishment Number' for invalid establishment number", () => {
    const packingListJson = {
      Something: [
        {},
        {
          A: "INCORRECT",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
    const packingListJson = {
      Something: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          A: "RMS-GB-000025-009",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
