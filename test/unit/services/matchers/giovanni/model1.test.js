const MatcherResult = require("../../../../../app/services/matcher-result");
const Matcher = require("../../../../../app/services/matchers/giovanni/model1");
const model = require("../../../test-data-and-results/models/giovanni/model1");

describe("matchesGiovanni", () => {
  test("returns generic error for empty json", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches({}, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns Correct", () => {
    const filename = "PackingList.xlsx";

    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(
      model.incorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(model.incorrectHeader, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
