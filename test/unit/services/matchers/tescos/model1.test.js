const matcher = require("../../../../../app/services/matchers/tescos/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/tescos/model1");

const filename = "PackingListTescos1.xlsx";

describe("matchesTescoModel1", () => {
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
    const result = matcher.matches(
      model.incorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
    const result = matcher.matches(model.incorrectHeader, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
