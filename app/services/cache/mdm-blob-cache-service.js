const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../../utilities/logger");
const mdmConfig = require("../../config/mdm-config");

const filenameForLogging = "mdm-blob-cache-service";
const getFromBlobMethod = "getFromBlob()";

let blobClient = null;

const initializeBlobClient = () => {
  if (blobClient) {
    return blobClient;
  }

  try {
    const accountUrl = process.env.AZURE_STORAGE_ACCOUNT_URL;
    const containerName = mdmConfig.cache.containerName;

    // Support Azurite emulator with connection string
    let serviceClient;
    if (process.env.AZURE_STORAGE_USE_EMULATOR === "true") {
      const connectionString =
        "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";
      serviceClient = BlobServiceClient.fromConnectionString(connectionString);
    } else {
      serviceClient = new BlobServiceClient(
        accountUrl,
        new DefaultAzureCredential(),
      );
    }

    const containerClient = serviceClient.getContainerClient(containerName);
    blobClient = containerClient.getBlockBlobClient(
      "nirms-ineligible-items.json",
    );

    logger.logInfo(
      filenameForLogging,
      "initializeBlobClient()",
      `Blob client initialized for container: ${containerName}`,
    );

    return blobClient;
  } catch (error) {
    logger.logError(filenameForLogging, "initializeBlobClient()", error);
    throw error;
  }
};

const get = async () => {
  if (!mdmConfig.cache.enabled) {
    logger.logInfo(filenameForLogging, "get()", "Cache disabled");
    return null;
  }

  try {
    return await getFromBlob();
  } catch (error) {
    logger.logError(filenameForLogging, "get()", error);
    return null;
  }
};

const getStale = async () => {
  if (!mdmConfig.cache.enabled) {
    logger.logInfo(filenameForLogging, "getStale()", "Cache disabled");
    return null;
  }

  try {
    return await getStaleFromBlob();
  } catch (error) {
    logger.logError(filenameForLogging, "getStale()", error);
    return null;
  }
};

const getFromBlob = async () => {
  const client = initializeBlobClient();
  const exists = await client.exists();

  if (!exists) {
    logger.logInfo(
      filenameForLogging,
      getFromBlobMethod,
      "Cache miss - blob not found",
    );
    return null;
  }

  const properties = await client.getProperties();
  const lastModified = properties.lastModified;
  const ageSeconds = Math.floor((Date.now() - lastModified.getTime()) / 1000);

  if (ageSeconds > mdmConfig.cache.ttlSeconds) {
    logger.logInfo(
      filenameForLogging,
      getFromBlobMethod,
      `Cache expired: ${ageSeconds}s old (TTL: ${mdmConfig.cache.ttlSeconds}s) - not deleting for fallback use`,
    );
    return null;
  }

  const downloadResponse = await client.download(0);
  const chunks = [];

  for await (const chunk of downloadResponse.readableStreamBody) {
    chunks.push(chunk);
  }

  const jsonContent = Buffer.concat(chunks).toString("utf-8");
  const parsedData = JSON.parse(jsonContent);

  logger.logInfo(
    filenameForLogging,
    getFromBlobMethod,
    `Cache hit: ${ageSeconds}s old, ${chunks.length} chunks`,
  );

  return parsedData;
};

const getStaleFromBlob = async () => {
  const client = initializeBlobClient();
  const exists = await client.exists();

  if (!exists) {
    logger.logInfo(
      filenameForLogging,
      "getStaleFromBlob()",
      "No stale cache available - blob not found",
    );
    return null;
  }

  const properties = await client.getProperties();
  const lastModified = properties.lastModified;
  const ageSeconds = Math.floor((Date.now() - lastModified.getTime()) / 1000);

  const downloadResponse = await client.download(0);
  const chunks = [];

  for await (const chunk of downloadResponse.readableStreamBody) {
    chunks.push(chunk);
  }

  const jsonContent = Buffer.concat(chunks).toString("utf-8");
  const parsedData = JSON.parse(jsonContent);

  logger.logInfo(
    filenameForLogging,
    "getStaleFromBlob()",
    `Using stale cache as fallback: ${ageSeconds}s old (TTL was: ${mdmConfig.cache.ttlSeconds}s)`,
  );

  return parsedData;
};

const set = async (data) => {
  if (!mdmConfig.cache.enabled) {
    return;
  }

  try {
    await setToBlob(data);
  } catch (error) {
    logger.logError(filenameForLogging, "set()", error);
  }
};

const setToBlob = async (data) => {
  const client = initializeBlobClient();
  const content = JSON.stringify(data, null, 2);
  const buffer = Buffer.from(content, "utf-8");

  await client.upload(buffer, buffer.length, {
    blobHTTPHeaders: {
      blobContentType: "application/json",
      blobCacheControl: `max-age=${mdmConfig.cache.ttlSeconds}`,
    },
    metadata: {
      cachedAt: new Date().toISOString(),
      ttl: mdmConfig.cache.ttlSeconds.toString(),
      source: "mdm-api",
    },
  });

  logger.logInfo(
    filenameForLogging,
    "setToBlob()",
    `Cache updated: ${buffer.length} bytes written`,
  );
};

const clear = async () => {
  try {
    await clearBlob();
  } catch (error) {
    logger.logError(filenameForLogging, "clear()", error);
    throw error;
  }
};

const clearBlob = async () => {
  const client = initializeBlobClient();
  const exists = await client.exists();

  if (exists) {
    await client.delete();
    logger.logInfo(filenameForLogging, "clearBlob()", "Cache invalidated");
  } else {
    logger.logInfo(filenameForLogging, "clearBlob()", "No cache to clear");
  }
};

module.exports = { get, set, clear, getStale };
