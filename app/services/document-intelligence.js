const config = require("../config");
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");

function createDocumentIntelligenceClient() {
  const credential = new AzureKeyCredential(config.formRecognizerApiKey);
  return new DocumentAnalysisClient(config.formRecognizerEndpoint, credential);
}

async function runAnalysis(client, modelId, fileBuffer) {
  const poller = await client.beginAnalyzeDocument(modelId, fileBuffer);

  const {
    documents: [document],
  } = await poller.pollUntilDone();

  if (!document) {
    throw new Error("Expected at least one document in the result.");
  }

  return document;
}

module.exports = { createDocumentIntelligenceClient, runAnalysis };
