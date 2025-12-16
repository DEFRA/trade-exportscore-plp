/**
 * MDM Blob Cache Service
 *
 * Provides persistent caching for MDM API responses using Azure Blob Storage.
 * Supports both Azure Storage (production) and Azurite emulator (local development).
 *
 * Cache Strategy:
 * - TTL-based expiration: Fresh data returned if within TTL, null if expired
 * - Stale data retention: Expired blobs are NOT deleted, allowing fallback use
 * - Graceful degradation: Cache failures return null, allowing API call to proceed
 *
 * Authentication:
 * - Production: DefaultAzureCredential (Managed Identity)
 * - Local: Azurite connection string (well-known emulator credentials)
 *
 * Methods:
 * - get(): Returns fresh cached data (within TTL) or null
 * - getStale(): Returns cached data regardless of TTL (for fallback scenarios)
 * - set(): Stores data with metadata (cachedAt, ttl, source)
 * - clear(): Invalidates cache by deleting blob
 *
 * Configuration:
 * - MDM_CACHE_ENABLED: Enable/disable caching
 * - MDM_CACHE_TTL_SECONDS: Cache lifetime in seconds
 * - AZURE_STORAGE_ACCOUNT_URL: Storage account endpoint
 * - AZURE_STORAGE_USE_EMULATOR: Use Azurite for local testing
 * - AZURE_STORAGE_CONNECTION_STRING: Override default Azurite connection
 */

const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../../utilities/logger");
const mdmConfig = require("../../config/mdm-config");

const filenameForLogging = "mdm-blob-cache-service";
const getFromBlobMethod = "getFromBlob()";

let blobClients = {};

/**
 * Get blob client for a specific data type.
 * @param {string} dataType - Type of data (e.g., 'ineligible-items', 'countries')
 * @returns {string} Blob name for the data type
 */
const getBlobName = (dataType = "ineligible-items") => {
  const blobNames = {
    "ineligible-items": "nirms-ineligible-items.json",
    countries: "countries.json",
  };
  return blobNames[dataType] || `${dataType}.json`;
};

/**
 * Initialize Azure Blob Storage client for a specific blob.
 * Creates connection to either Azurite (local) or Azure Storage (cloud).
 * @param {string} blobName - Name of the blob file
 * @returns {BlockBlobClient} Initialized blob client
 */
const initializeBlobClient = (blobName = "nirms-ineligible-items.json") => {
  if (blobClients[blobName]) {
    return blobClients[blobName];
  }

  try {
    const accountUrl = process.env.AZURE_STORAGE_ACCOUNT_URL;
    const containerName = mdmConfig.cache.containerName;

    // Support Azurite emulator with connection string
    let serviceClient;
    if (process.env.AZURE_STORAGE_USE_EMULATOR === "true") {
      const connectionString =
        process.env.AZURE_STORAGE_CONNECTION_STRING ||
        "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";
      serviceClient = BlobServiceClient.fromConnectionString(connectionString);
    } else {
      serviceClient = new BlobServiceClient(
        accountUrl,
        new DefaultAzureCredential(),
      );
    }

    const containerClient = serviceClient.getContainerClient(containerName);
    const client = containerClient.getBlockBlobClient(blobName);

    blobClients[blobName] = client;

    logger.logInfo(
      filenameForLogging,
      "initializeBlobClient()",
      `Blob client initialized for container: ${containerName}, blob: ${blobName}`,
    );

    return client;
  } catch (error) {
    logger.logError(filenameForLogging, "initializeBlobClient()", error);
    throw error;
  }
};

/**
 * Get fresh cached data (within TTL).
 * @param {string} dataType - Type of data to retrieve (e.g., 'ineligible-items', 'countries')
 * @returns {Promise<Object|null>} Cached data if fresh and available, null otherwise
 */
const get = async (dataType = "ineligible-items") => {
  if (!mdmConfig.cache.enabled) {
    logger.logInfo(filenameForLogging, "get()", "Cache disabled");
    return null;
  }

  try {
    return await getFromBlob(dataType);
  } catch (error) {
    logger.logError(filenameForLogging, "get()", error);
    return null;
  }
};

/**
 * Get stale cached data (ignores TTL expiration).
 * Used as fallback when MDM API is unavailable.
 * @param {string} dataType - Type of data to retrieve (e.g., 'ineligible-items', 'countries')
 * @returns {Promise<Object|null>} Cached data if available (regardless of age), null otherwise
 */
const getStale = async (dataType = "ineligible-items") => {
  if (!mdmConfig.cache.enabled) {
    logger.logInfo(filenameForLogging, "getStale()", "Cache disabled");
    return null;
  }

  try {
    return await getStaleFromBlob(dataType);
  } catch (error) {
    logger.logError(filenameForLogging, "getStale()", error);
    return null;
  }
};

/**
 * Retrieve fresh cached data from blob storage.
 * Checks TTL and returns null if expired (blob is not deleted for fallback use).
 * @param {string} dataType - Type of data to retrieve (e.g., 'ineligible-items', 'countries')
 * @returns {Promise<Object|null>} Parsed JSON data if fresh, null if expired or missing
 */
const getFromBlob = async (dataType = "ineligible-items") => {
  const blobName = getBlobName(dataType);
  const client = initializeBlobClient(blobName);
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

/**
 * Retrieve stale cached data from blob storage (ignores TTL).
 * Used as fallback when MDM API is unavailable after retries.
 * @param {string} dataType - Type of data to retrieve (e.g., 'ineligible-items', 'countries')
 * @returns {Promise<Object|null>} Parsed JSON data regardless of age, null if blob doesn't exist
 */
const getStaleFromBlob = async (dataType = "ineligible-items") => {
  const blobName = getBlobName(dataType);
  const client = initializeBlobClient(blobName);
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

/**
 * Store data in blob cache.
 * Fire-and-forget pattern - errors are logged but not thrown.
 * @param {Object} data - Data to cache
 * @param {string} dataType - Type of data to cache (e.g., 'ineligible-items', 'countries')
 * @returns {Promise<void>}
 */
const set = async (data, dataType = "ineligible-items") => {
  if (!mdmConfig.cache.enabled) {
    return;
  }

  try {
    await setToBlob(data, dataType);
  } catch (error) {
    logger.logError(filenameForLogging, "set()", error);
  }
};

/**
 * Upload data to blob storage with metadata.
 * @param {Object} data - Data to upload
 * @param {string} dataType - Type of data to cache (e.g., 'ineligible-items', 'countries')
 * @returns {Promise<void>}
 */
const setToBlob = async (data, dataType = "ineligible-items") => {
  const blobName = getBlobName(dataType);
  const client = initializeBlobClient(blobName);
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

/**
 * Clear cached data by deleting the blob.
 * Used for manual cache invalidation via API endpoint.
 * @returns {Promise<void>}
 * @throws {Error} If delete operation fails
 */
const clear = async () => {
  try {
    await clearBlob();
  } catch (error) {
    logger.logError(filenameForLogging, "clear()", error);
    throw error;
  }
};

/**
 * Delete blob from storage.
 * @returns {Promise<void>}
 */
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
