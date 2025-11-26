const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const redis = require("redis");
const logger = require("../../utilities/logger");
const mdmConfig = require("../../config/mdm-config");

const filenameForLogging = "mdm-blob-cache-service";

let blobClient = null;
let redisClient = null;

const initializeBlobClient = () => {
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
      "initializeBlobClient()",
      `Blob client initialized for container: ${containerName}`,
    );

    return blobClient;
  } catch (error) {
    logger.logError(filenameForLogging, "initializeBlobClient()", error);
    throw error;
  }
};

const initializeRedisClient = async () => {
  if (redisClient && redisClient.isOpen) return redisClient;

  try {
    const config = {
      url: mdmConfig.cache.redisUrl,
    };

    if (mdmConfig.cache.redisPassword) {
      config.password = mdmConfig.cache.redisPassword;
    }

    // Azure Redis Cache requires TLS
    if (mdmConfig.cache.redisUrl.includes("redis.cache.windows.net")) {
      config.socket = { tls: true };
    }

    redisClient = redis.createClient(config);

    redisClient.on("error", (err) => {
      logger.logError(filenameForLogging, "Redis Client Error", err);
    });

    await redisClient.connect();

    logger.logInfo(
      filenameForLogging,
      "initializeRedisClient()",
      `Redis client initialized: ${mdmConfig.cache.redisUrl}`,
    );

    return redisClient;
  } catch (error) {
    logger.logError(filenameForLogging, "initializeRedisClient()", error);
    throw error;
  }
};

const get = async () => {
  if (!mdmConfig.cache.enabled) {
    logger.logInfo(filenameForLogging, "get()", "Cache disabled");
    return null;
  }

  try {
    if (mdmConfig.cache.provider === "redis") {
      return await getFromRedis();
    } else {
      return await getFromBlob();
    }
  } catch (error) {
    logger.logError(filenameForLogging, "get()", error);
    return null;
  }
};

const getFromRedis = async () => {
  const client = await initializeRedisClient();
  const cached = await client.get("nirms-prohibited-items");

  if (!cached) {
    logger.logInfo(
      filenameForLogging,
      "getFromRedis()",
      "Cache miss - key not found",
    );
    return null;
  }

  const parsedData = JSON.parse(cached);
  logger.logInfo(filenameForLogging, "getFromRedis()", `Cache hit from Redis`);

  return parsedData;
};

const getFromBlob = async () => {
  const client = initializeBlobClient();
  const exists = await client.exists();

  if (!exists) {
    logger.logInfo(
      filenameForLogging,
      "getFromBlob()",
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
      "getFromBlob()",
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
    "getFromBlob()",
    `Cache hit: ${ageSeconds}s old, ${chunks.length} chunks`,
  );

  return parsedData;
};

const set = async (data) => {
  if (!mdmConfig.cache.enabled) return;

  try {
    if (mdmConfig.cache.provider === "redis") {
      await setToRedis(data);
    } else {
      await setToBlob(data);
    }
  } catch (error) {
    logger.logError(filenameForLogging, "set()", error);
  }
};

const setToRedis = async (data) => {
  const client = await initializeRedisClient();
  const content = JSON.stringify(data);

  await client.setEx(
    "nirms-prohibited-items",
    mdmConfig.cache.ttlSeconds,
    content,
  );

  logger.logInfo(
    filenameForLogging,
    "setToRedis()",
    `Cache updated in Redis: ${content.length} bytes, TTL: ${mdmConfig.cache.ttlSeconds}s`,
  );
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
    if (mdmConfig.cache.provider === "redis") {
      await clearRedis();
    } else {
      await clearBlob();
    }
  } catch (error) {
    logger.logError(filenameForLogging, "clear()", error);
    throw error;
  }
};

const clearRedis = async () => {
  const client = await initializeRedisClient();
  const deleted = await client.del("nirms-prohibited-items");

  if (deleted > 0) {
    logger.logInfo(filenameForLogging, "clearRedis()", "Cache invalidated");
  } else {
    logger.logInfo(filenameForLogging, "clearRedis()", "No cache to clear");
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

module.exports = { get, set, clear };
