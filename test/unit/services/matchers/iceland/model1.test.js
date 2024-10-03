const matcher = require("../../../../../app/services/matchers/iceland/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/iceland/model1")

jest.mock("../../../../../app/services/document-intelligence");

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../../app/services/document-intelligence");
const MatcherResult = require("../../../../../app/services/matcher-result");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

describe("matchesIceland", () => {
  test.each([
    [matcher_result.CORRECT, model.validModel],
    [MatcherResult.GENERIC_ERROR, {}],
    [matcher_result.WRONG_ESTABLISHMENT_NUMBER, model.invalidModel_WrongRemosNumber],
    [matcher_result.WRONG_ESTABLISHMENT_NUMBER, model.invalidModel_MissingRemosElement],
  ])(
    "returns '%s' for '%s'",
    async (expected, inputModel) => {
      const filename = "PackingList.xlsx";
      runAnalysis.mockImplementationOnce(() => {
        return inputModel;
      });
  
      const result = await matcher.matches("", filename);
  
      expect(result.isMatched).toEqual(expected);
    } 
  );
});
