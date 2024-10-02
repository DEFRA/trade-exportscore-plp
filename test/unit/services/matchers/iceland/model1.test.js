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
      PartialNIRMSNumber: [
        {
          content: "RMS-GB-000040",
        },
      ],
    },
  };
});

describe("matchesIceland", () => {
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";

    const result = matcher.matches("", filename);

    expect(result).toBe(matcher_result.CORRECT);
  });
});
