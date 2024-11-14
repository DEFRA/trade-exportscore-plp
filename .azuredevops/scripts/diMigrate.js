const { DefaultAzureCredential } = require("@azure/identity");
const {
  DocumentModelAdministrationClient,
} = require("@azure/ai-form-recognizer");

// ADO pipeline variables
const modelIds = process.env.MODEL_IDS.split(",").map((id) => id.trim()); // Split and trim each model ID
const sourceEndpoint = process.env.SOURCE_ENDPOINT;
const targetEndpoint = process.env.TARGET_ENDPOINT;

// Create a DefaultAzureCredential instance for authentication
const credential = new DefaultAzureCredential();

// Helper function to create a Document Model Administration client
function createDocumentIntelligenceClient(endpoint) {
  return new DocumentModelAdministrationClient(endpoint, credential);
}

// Assess the validity of a model
async function assessModelPresence(client, modelId) {
  try {
    console.log("== Assessing model presence");
    const model = await client.getDocumentModel(modelId);
    console.log(`Model ID: ${model.modelId}`);
    console.log(`Description: ${model.description}`);
    console.log(`Created On: ${model.createdOn}`);
  } catch (error) {
    const msg = `Error in assessing model with ID ${modelId}: ${error.message}`;
    handleError(msg);
  }
}

// Centralised error handling
function handleError(msg) {
  console.error(msg);
  throw new Error(msg);
}

// Handle model copying between environments
async function copyModel(sourceClient, targetClient, modelId) {
  try {
    const copyAuthorisation = await targetClient.getCopyAuthorization(modelId);
    console.log("Copy authorisation received.");

    const poller = await sourceClient.beginCopyModelTo(
      modelId,
      copyAuthorisation,
    );
    const modelDetails = await poller.pollUntilDone();
    console.log("Model copy completed:", modelDetails);
  } catch (error) {
    const msg = `Error copying model with ID ${modelId}: ${error.message}`;
    handleError(msg);
  }
}

// Main function to assess source, copy to target, and perform analysis for each model
async function main() {
  console.log("========== Creating clients for source and target ==========");
  const sourceClient = createDocumentIntelligenceClient(sourceEndpoint);
  const targetClient = createDocumentIntelligenceClient(targetEndpoint);

  for (const modelId of modelIds) {
    console.log(`========== Processing model: ${modelId} ==========`);

    // Assess source model
    console.log("========== Assessing the source model ==========");
    await assessModelPresence(sourceClient, modelId);

    // Copy model to target
    console.log("========== Copying model from source to target ==========");
    await copyModel(sourceClient, targetClient, modelId);

    // Assess target model
    console.log("========== Assessing the target model ==========");
    await assessModelPresence(targetClient, modelId);
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error.message);
  process.exit(1);
});
