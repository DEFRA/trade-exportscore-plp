const {
  DocumentModelAdministrationClient,
  AzureKeyCredential,
} = require("@azure/ai-form-recognizer");

// ADO pipeline variables
const modelIds = process.env.MODEL_IDS.split(",").map((id) => id.trim()); // Split and trim each model ID
const sourceEndpoint = process.env.SOURCE_ENDPOINT;
const sourceAPIKey = process.env.SOURCE_APIKEY;
const targetEndpoint = process.env.TARGET_ENDPOINT;
const targetAPIKey = process.env.TARGET_APIKEY;

// Helper function to create a Document Model Administration client
function createDocumentIntelligenceClient(endpoint, apiKey) {
  try {
    const credential = new AzureKeyCredential(apiKey);
    return new DocumentModelAdministrationClient(endpoint, credential);
  } catch (error) {
    const msg = `Error creating Document Model Administration Client for endpoint ${endpoint}: ${error}`;
    handleError(msg);
  }
}

// Assess the validity of a model
async function assessModelPresence(client, modelId) {
  try {
    console.log("== Assessing model presence ==");
    const model = await client.getDocumentModel(modelId);
    console.log(`Model ID: ${model.modelId}`);
    console.log(`Description: ${model.description}`);
    console.log(`Created On: ${model.createdOn}`);
    return true;
  } catch (error) {
    console.log(`Error in assessing model with ID ${modelId}: ${error}`);
    return false;
  }
}

// Centralised error handling
function handleError(msg) {
  console.error(msg);
  throw new Error(msg);
}

// Generate a new target model ID with a timestamp and log it
function generateTargetModelId(modelId) {
  const timestamp = Date.now();
  const newModelId = `${modelId}-${timestamp}`;
  console.log(`Generated new target model ID with timestamp: ${newModelId}`);
  return newModelId;
}

// Copy a model from source to target
async function copyModel(
  sourceClient,
  targetClient,
  sourceModelId,
  targetModelId,
) {
  try {
    const copyAuthorisation =
      await targetClient.getCopyAuthorization(targetModelId);
    console.log("Copy authorisation received.");

    const poller = await sourceClient.beginCopyModelTo(
      sourceModelId,
      copyAuthorisation,
    );
    const modelDetails = await poller.pollUntilDone();
    console.log("Model copy completed:", modelDetails);
  } catch (error) {
    const msg = `Error copying model with ID ${sourceModelId}: ${error}`;
    handleError(msg);
  }
}

// Main function
async function main() {
  console.log(
    "============ Creating clients for source and target ============",
  );

  const sourceClient = createDocumentIntelligenceClient(
    sourceEndpoint,
    sourceAPIKey,
  );
  const targetClient = createDocumentIntelligenceClient(
    targetEndpoint,
    targetAPIKey,
  );

  for (const modelId of modelIds) {
    console.log(`============ Processing model: ${modelId} ============`);

    // Assess source model
    console.log("========== Assessing the source model ==========");
    const sourceModelExists = await assessModelPresence(sourceClient, modelId);
    if (!sourceModelExists) {
      console.log(
        `Model with ID ${modelId} does not exist in the source environment. Skipping copy...`,
      );
      continue;
    }

    // Generate the timestamped target model ID
    const targetModelIdWithTimestamp = generateTargetModelId(modelId);

    // Copy model to target using the new timestamped model ID
    console.log("========== Copying model from source to target ==========");
    await copyModel(
      sourceClient,
      targetClient,
      modelId,
      targetModelIdWithTimestamp,
    );

    // Assess target model after copy
    console.log("========== Assessing the target model ==========");
    await assessModelPresence(targetClient, targetModelIdWithTimestamp);
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
