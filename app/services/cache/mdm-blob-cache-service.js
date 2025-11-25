const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../../utilities/logger");
const mdmConfig = require("../../config/mdm-config");

const filenameForLogging = "mdm-blob-cache-service";

let blobClient = null;

const initializeClient = () => {
  if (blobClient) return blobClient;

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
      "nirms-prohibited-items.json",
    );

    logger.logInfo(
      filenameForLogging,
      "initializeClient()",
      `Blob client initialized for container: ${containerName}`,
    );

    return blobClient;
  } catch (error) {
    logger.logError(filenameForLogging, "initializeClient()", error);
    throw error;
  }
};

const get = async () => {
  if (!mdmConfig.cache.enabled) {
    logger.logInfo(filenameForLogging, "get()", "Cache disabled");
    return null;
  }

  try {
    const client = initializeClient();
    const exists = await client.exists();

    if (!exists) {
      logger.logInfo(
        filenameForLogging,
        "get()",
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
        "get()",
        `Cache expired: ${ageSeconds}s old (TTL: ${mdmConfig.cache.ttlSeconds}s)`,
      );
      await client.delete();
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
      "get()",
      `Cache hit: ${ageSeconds}s old, ${chunks.length} chunks`,
    );

    return parsedData;
  } catch (error) {
    logger.logError(filenameForLogging, "get()", error);
    return null;
  }
};

const set = async (data) => {
  if (!mdmConfig.cache.enabled) return;

  try {
    const client = initializeClient();
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
      "set()",
      `Cache updated: ${buffer.length} bytes written`,
    );
  } catch (error) {
    logger.logError(filenameForLogging, "set()", error);
  }
};

const clear = async () => {
  try {
    const client = initializeClient();
    const exists = await client.exists();

    if (exists) {
      await client.delete();
      logger.logInfo(filenameForLogging, "clear()", "Cache invalidated");
    } else {
      logger.logInfo(filenameForLogging, "clear()", "No cache to clear");
    }
  } catch (error) {
    logger.logError(filenameForLogging, "clear()", error);
    throw error;
  }
};

module.exports = { get, set, clear };
