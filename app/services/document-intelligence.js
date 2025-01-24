const config = require("../config");
const {
  DocumentModelAdministrationClient,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const logger = require("../utilities/logger");
const { DefaultAzureCredential } = require("@azure/identity");

function createDocumentIntelligenceAdminClient() {
  const credential = new DefaultAzureCredential();
  return new DocumentModelAdministrationClient(
    config.formRecognizerEndpoint,
    credential,
  );
}

async function listModels(client) {
  try {
    const models = [];
    for await (const model of client.listDocumentModels()) {
      models.push(model);
    }
    return models;
  } catch (err) {
    logger.logError(
      "app/services/document-intelligence.js",
      "listModels()",
      err,
    );
    return [];
  }
}

async function getLatestModelByName(client, namePrefix) {
  // Step 1: Fetch all models from the client and store them in an array.
  const models = await listModels(client);

  // Step 2: Filter models to include only those whose modelId starts with the given prefix.
  const filteredModels = models.filter((model) =>
    model.modelId.startsWith(namePrefix),
  );

  // Step 3: If no models match the prefix, return null.
  if (filteredModels.length === 0) {
    return null;
  }

  // Step 4: Use reduce to find the "latest" model based on the Unix epoch value in the modelId.
  const latestModel = filteredModels.reduce((latest, current) => {
    if (!latest) {
      return current; // Initialize with the first model if latest is null
    }

    // Split the modelId of the current model into parts (e.g., "iceland1-v2-1734000598981").
    const currentParts = current.modelId.split("-");

    // Split the modelId of the latest model (if it exists) into parts.
    const latestParts = latest.modelId.split("-");

    // Extract the Unix epoch from the current modelId if it has more than 2 parts.
    // If no epoch exists, set the epoch to null.
    const currentEpoch =
      currentParts.length > 2
        ? parseInt(currentParts[currentParts.length - 1], 10)
        : null;

    // Extract the Unix epoch from the latest modelId if it has more than 2 parts.
    // If no epoch exists, set the epoch to null.
    const latestEpoch =
      latestParts.length > 2
        ? parseInt(latestParts[latestParts.length - 1], 10)
        : null;

    // Step 5: Compare the current and latest models:
    // - If the current model has a valid epoch and it's greater than the latest epoch, select the current model.
    if (currentEpoch && (!latestEpoch || currentEpoch > latestEpoch)) {
      return current;
    }

    // If no valid epochs exist, fall back to selecting the latest model based on version order.
    return latest;
  }, null);

  // Step 6: Safely return the modelId of the latest model, or null if no valid model is found.
  return latestModel ? latestModel.modelId : null;
}

function createDocumentIntelligenceClient() {
  const credential = new DefaultAzureCredential();
  return new DocumentAnalysisClient(config.formRecognizerEndpoint, credential);
}

async function runAnalysis(client, modelId, fileBuffer) {
  try {
    const poller = await client.beginAnalyzeDocument(modelId, fileBuffer);

    const {documents: [document]} = await poller.pollUntilDone();

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

async function runPrebuiltAnalysis(client, modelId, fileBuffer) {
  try {
    const poller = await client.beginAnalyzeDocument(modelId, fileBuffer);

    const result = await poller.pollUntilDone();

    return result;
  } catch (err) {
    logger.logError(
      "app/services/document-intelligence.js",
      "runPrebuiltAnalysis()",
      err,
    );
    return {};
  }
}

module.exports = {
  createDocumentIntelligenceAdminClient,
  getLatestModelByName,
  createDocumentIntelligenceClient,
  runAnalysis,
  runPrebuiltAnalysis,
};
