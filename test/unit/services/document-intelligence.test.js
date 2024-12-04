const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../app/services/document-intelligence");
const {
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const { DefaultAzureCredential } = require("@azure/identity");

const document = { test: "this is a test" };

jest.mock("@azure/ai-form-recognizer", () => {
  return {
    DocumentAnalysisClient: jest.fn().mockImplementation(() => {
      return {
        beginAnalyzeDocument: jest.fn().mockImplementation(() => {
          return {
            pollUntilDone: jest.fn().mockImplementation(() => {
              return {
                documents: [document],
              };
            }),
          };
        }),
      };
    }),
  };
});

jest.mock("@azure/identity", () => {
  return {
    DefaultAzureCredential: jest.fn()
  }
})

describe("runAnalysis", () => {
  test("returns document", async () => {
    const result = await runAnalysis(
      createDocumentIntelligenceClient(),
      "ICELAND1",
      "",
    );

    expect(result).toBe(document);
  });
});

describe("createDocumentIntelligenceClient", () => {
  test("creates client", () => {
    createDocumentIntelligenceClient();

    expect(DefaultAzureCredential).toHaveBeenCalled();
    expect(DocumentAnalysisClient).toHaveBeenCalled();
  });
});
