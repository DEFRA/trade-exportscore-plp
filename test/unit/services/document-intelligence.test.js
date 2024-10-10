const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../app/services/document-intelligence");
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");

const document = { test: "this is a test" };

jest.mock("@azure/ai-form-recognizer", () => {
  return {
    AzureKeyCredential: jest.fn(),
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

describe("runAnalysis", () => {
  test("returns document", async () => {
    const result = await runAnalysis(
      createDocumentIntelligenceClient(),
      "ICELAND1",
      "",
    );

    expect(result).toBe(document);
  });

  test("returns error", async () => {
    // set error??
    const result = await runAnalysis(
      createDocumentIntelligenceClient(),
      "ICELAND1",
      "",
    );
  });
});

describe("createDocumentIntelligenceClient", () => {
  test("creates client", () => {
    createDocumentIntelligenceClient();

    expect(AzureKeyCredential).toHaveBeenCalled();
    expect(DocumentAnalysisClient).toHaveBeenCalled();
  });
});
