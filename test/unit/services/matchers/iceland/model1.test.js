const matcher = require("../../../../../app/services/matchers/iceland/model1");
const matcher_result = require("../../../../../app/services/matcher-result");

jest.mock("../../../../../app/services/document-intelligence");

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../../app/services/document-intelligence");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});
runAnalysis.mockImplementation(() => {
  return {
    fields: {
      PartialNIRMSNumber: {
        content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-",
      },
    },
  };
});

describe("matchesIceland", () => {
  test("returns Correct", async () => {
    const filename = "PackingList.xlsx";

    const result = await matcher.matches("", filename);

    expect(result.isMatched).toEqual(matcher_result.CORRECT);
  });
});
