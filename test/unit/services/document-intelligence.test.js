const {
  createDocumentIntelligenceAdminClient,
  getLatestModelByName,
  createDocumentIntelligenceClient,
  runAnalysis,
  runPrebuiltAnalysis,
} = require("../../../app/services/document-intelligence");
const {
  DocumentModelAdministrationClient,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const { DefaultAzureCredential } = require("@azure/identity");

jest.mock("@azure/ai-form-recognizer", () => {
  return {
    DocumentModelAdministrationClient: jest.fn().mockImplementation(() => {
      return {
        listDocumentModels: jest.fn().mockImplementation(() => {
          return {
            [Symbol.asyncIterator]: async function* () {
              yield { modelId: "iceland1-v1" };
              yield { modelId: "iceland1-v2" };
              yield { modelId: "iceland1-v2-1734000598888" };
              yield { modelId: "iceland1-v2-1734000598981" };
            },
          };
        }),
      };
    }),
    DocumentAnalysisClient: jest.fn().mockImplementation(() => {
      return {
        beginAnalyzeDocument: jest.fn().mockImplementation(() => {
          return {
            pollUntilDone: jest.fn().mockImplementation(() => {
              return {
                documents: [{ test: "this is a test" }],
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
    DefaultAzureCredential: jest.fn(),
  };
});

describe("createDocumentIntelligenceAdminClient", () => {
  test("creates admin client", () => {
    createDocumentIntelligenceAdminClient();

    expect(DefaultAzureCredential).toHaveBeenCalled();
    expect(DocumentModelAdministrationClient).toHaveBeenCalled();
  });
});

describe("getLatestModelByName", () => {
  const mockClient = new DocumentModelAdministrationClient();

  test("returns the model with the highest epoch when mixed with non-epoch models", async () => {
    const result = await getLatestModelByName(mockClient, "iceland1-v2");
    expect(result).toBe("iceland1-v2-1734000598981");
  });

  test("returns the model with the highest version when no epochs exist", async () => {
    const result = await getLatestModelByName(mockClient, "iceland1-v1");
    expect(result).toBe("iceland1-v1");
  });

  test("returns null if no matching models are found", async () => {
    const result = await getLatestModelByName(mockClient, "nonexistent-prefix");
    expect(result).toBeNull();
  });

  test("returns the first model when all models have invalid or no epoch values", async () => {
    jest.spyOn(mockClient, "listDocumentModels").mockReturnValueOnce({
      [Symbol.asyncIterator]: async function* () {
        yield { modelId: "iceland1-v1" };
        yield { modelId: "iceland1-v2" };
        yield { modelId: "iceland1-invalid-epoch" };
      },
    });

    const result = await getLatestModelByName(mockClient, "iceland1");
    expect(result).toBe("iceland1-v1"); // Retains the first model as no "better" model is found.
  });
});

describe("runAnalysis", () => {
  test("returns document", async () => {
    const result = await runAnalysis(
      createDocumentIntelligenceClient(),
      "ICELAND1",
      "",
    );

    expect(result).toEqual({ test: "this is a test" });
  });
});

describe("runPrebuiltAnalysis", () => {
  test("returns document", async () => {
    const result = await runPrebuiltAnalysis(
      createDocumentIntelligenceClient(),
      "ICELAND1",
      "",
    );

    expect(result).toEqual({
      documents: [{ test: "this is a test" }],
    });
  });
});

describe("createDocumentIntelligenceClient", () => {
  test("creates client", () => {
    createDocumentIntelligenceClient();

    expect(DefaultAzureCredential).toHaveBeenCalled();
    expect(DocumentAnalysisClient).toHaveBeenCalled();
  });
});
