const matcher = require("../../../../../app/services/matchers/mands/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/mands/model1");

jest.mock("../../../../../app/services/document-intelligence");

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../../app/services/document-intelligence");
const MatcherResult = require("../../../../../app/services/matcher-result");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

describe("matchesMandS", () => {
  test.each([
    [matcherResult.CORRECT, model.validModel],
    [MatcherResult.GENERIC_ERROR, {}],
    [
      matcherResult.WRONG_ESTABLISHMENT_NUMBER,
      model.invalidModel_WrongRemosNumber,
    ],
    [
      matcherResult.WRONG_ESTABLISHMENT_NUMBER,
      model.invalidModel_MissingRemosElement,
    ],
  ])("returns '%s' for iceland model", async (expected, inputModel) => {
    const filename = "PackingList.xlsx";
    runAnalysis.mockImplementationOnce(() => {
      return inputModel;
    });

    const result = await matcher.matches("", filename);

    expect(result.isMatched).toEqual(expected);
  });
});
