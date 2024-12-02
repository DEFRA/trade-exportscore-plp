const config = require("../config");
const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const logger = require("../utilities/logger");
const { DefaultAzureCredential } = require("@azure/identity");

function createDocumentIntelligenceClient() {
  const credential = DefaultAzureCredential();
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
    logger.logError(
      "app/services/document-intelligence.js",
      "runAnalysis()",
      err,
    );
    return {};
  }
}

module.exports = { createDocumentIntelligenceClient, runAnalysis };
