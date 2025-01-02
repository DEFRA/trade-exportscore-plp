const matcher = require("../../../../../app/services/matchers/boots/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/boots/model1");

describe("matchesBoots", () => {
  test.each([
    [matcherResult.CORRECT, model.validModel],
    [matcherResult.GENERIC_ERROR, null],
    [matcherResult.WRONG_ESTABLISHMENT_NUMBER, model.wrongEstablishment],
    [
      matcherResult.WRONG_ESTABLISHMENT_NUMBER,
      model.wrongEstablishment_clippedRMS,
    ],
    [matcherResult.WRONG_HEADER, model.incorrectHeader],
    [matcherResult.EMPTY_FILE, model.emptyFile],
  ])("returns '%s' for boots model", async (expected, inputModel) => {
    const filename = "PackingList.xlsx";

    const result = await matcher.matches(inputModel, filename);

    expect(result).toEqual(expected);
  });
});
