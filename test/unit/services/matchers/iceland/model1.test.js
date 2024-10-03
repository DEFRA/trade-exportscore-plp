const matcher = require("../../../../../app/services/matchers/iceland/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/")

jest.mock("../../../../../app/services/document-intelligence");

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../../app/services/document-intelligence");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

describe("matchesIceland", () => {
  test("returns Correct", async () => {
    const filename = "PackingList.xlsx";
    runAnalysis.mockImplementationOnce(() => {
      return {
        fields: {
          PartialNIRMSNumber: {
            content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000040-",
          },
        },
      };
    });

    const result = await matcher.matches("", filename);

    expect(result.isMatched).toEqual(matcher_result.CORRECT);
  });

  test("return generic error for empty document", async () => {
    const filename = "PackingList.xlsx";
    runAnalysis.mockImplementationOnce(() => {
      return {};
    });

    const result = await matcher.matches("", filename);

    expect(result.isMatched).toEqual(matcher_result.GENERIC_ERROR);
  });

  test("returns wrong establishment number for wrong establishment number", async () => {
    const filename = "PackingList.xlsx";
    runAnalysis.mockImplementationOnce(() => {
      return {
        fields: {
          PartialNIRMSNumber: {
            content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000041-",
          },
        },
      };
    });

    const result = await matcher.matches("", filename);

    expect(result.isMatched).toEqual(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing element", async () => {
    const filename = "PackingList.xlsx";
    runAnalysis.mockImplementationOnce(() => {
      return {
        fields: {
          remosNumber: {
            content: "KingdomRMS_ESTABLISHMENT_NORMS-GB-000041-",
          },
        },
      };
    });

    const result = await matcher.matches("", filename);

    expect(result.isMatched).toEqual(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });
});
