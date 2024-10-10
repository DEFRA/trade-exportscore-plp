const config = require("../config");
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const logger = require("../utilities/logger");

function createDocumentIntelligenceClient() {
  const credential = new AzureKeyCredential(config.formRecognizerApiKey);
  return new DocumentAnalysisClient(config.formRecognizerEndpoint, credential);
}

async function runAnalysis(client, modelId, fileBuffer) {
  try {
    const poller = await client.beginAnalyzeDocument(modelId, fileBuffer);

    const {
      documents: [document],
    } = await poller.pollUntilDone();

    if (!document) {
      throw new Error("Expected at least one document in the result.");
    }

    return document;
  } catch (err) {
    logger.log_error(
      "app/services/document-intelligence.js",
      "runAnalysis()",
      err,
    );
    return {};
  }
}

module.exports = { createDocumentIntelligenceClient, runAnalysis };
