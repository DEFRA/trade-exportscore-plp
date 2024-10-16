const {
  AzureKeyCredential,
  DocumentModelAdministrationClient,
} = require("@azure/ai-form-recognizer");

// ADO pipeline parameters
const sourceModelId = process.env.SOURCE_MODEL_ID;
const targetModelId = process.env.TARGET_MODEL_ID;

// ADO pipeline variables
const sourceKey = process.env.SOURCE_KEY;
const sourceEndpoint = process.env.SOURCE_ENDPOINT;
const targetKey = process.env.TARGET_KEY;
const targetEndpoint = process.env.TARGET_ENDPOINT;

// Credentials for source and target environments
const environments = {
  source: {
    key: sourceKey,
    endpoint: sourceEndpoint,
  },
  target: {
    key: targetKey,
    endpoint: targetEndpoint,
  },
};

// Helper function to create Document Model Administration clients
function createDocumentIntelligenceClients(env) {
  return {
    modelAdminClient: new DocumentModelAdministrationClient(
      env.endpoint,
      new AzureKeyCredential(env.key)
    ),
  };
}

// Assess the validity of a model
async function assessModelPresence(modelAdminClient, modelId) {
  try {
    console.log("== Assessing model presence");
    const model = await modelAdminClient.getDocumentModel(modelId);
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
async function copyModel(sourceClient, targetClient) {
  try {
    const copyAuthorisation =
      await targetClient.getCopyAuthorization(targetModelId);
    console.log("Copy authorisation received.");

    const poller = await sourceClient.beginCopyModelTo(
      targetModelId,
      copyAuthorisation
    );
    const modelDetails = await poller.pollUntilDone();
    console.log("Model copy completed:", modelDetails);
  } catch (error) {
    const msg = `Error copying model with ID ${targetModelId}: ${error.message}`;
    handleError(msg);
  }
}

// Main function to assess source, copy to target, and perform analysis
async function main() {
  console.log("========== Creating clients for source and target ==========");
  const { modelAdminClient: sourceModelAdminClient } =
    createDocumentIntelligenceClients(environments.source);
  const { modelAdminClient: targetModelAdminClient } =
    createDocumentIntelligenceClients(environments.target);

  console.log("========== Assessing the source model ==========");
  await assessModelPresence(sourceModelAdminClient, sourceModelId);

  console.log("========== Copying model from source to target ==========");
  await copyModel(sourceModelAdminClient, targetModelAdminClient);

  console.log("========== Assessing the target model ==========");
  await assessModelPresence(targetModelAdminClient, targetModelId);
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error.message);
  process.exit(1);
});
