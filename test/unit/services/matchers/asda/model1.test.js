const Matcher = require("../../../../../app/services/matchers/asda/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/asda/model1");

const filename = "packinglist.xls";

describe("matchesAsdaModel1", () => {
  test("returns 'Correct' for valid JSON", () => {
    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns 'empty file' for empty json", () => {
    const result = Matcher.matches(model.emptyModel, "empty-" + filename);

    expect(result).toBe(MatcherResult.EMPTY_FILE);
  });

  test("returns 'valid header but no data' for json with header only", () => {
    const result = Matcher.matches(
      model.headerButNoData,
      "header-only-" + filename,
    );

    expect(result).toBe(MatcherResult.VALID_HEADER_NO_DATA);
  });

  test("returns 'wrong establishment number' for missing establishment number", () => {
    const result = Matcher.matches(model.wrongEstablishment, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'wrong header' for incorrect header values", () => {
    const result = Matcher.matches(model.incorrectHeader, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
