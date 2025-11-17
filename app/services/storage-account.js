/**
 * Azure Blob Storage integration
 *
 * Provides authenticated access to Azure Blob Storage for downloading and converting
 * packing list files (Excel, CSV, PDF) from blob containers.
 */
const { convertExcelToJson } = require("../utilities/excel-utility");
const { convertCsvToJson } = require("../utilities/csv-utility");
const { BlobClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { isExcel, isCsv } = require("../utilities/file-extension");

/**
 * Create Azure Blob Storage client with managed identity authentication.
 * @param {string} blobUri - Full blob URI
 * @returns {BlobClient} Authenticated blob client
 */
function createStorageAccountClient(blobUri) {
  return new BlobClient(blobUri, new DefaultAzureCredential());
}

/**
 * Download and convert packing list from blob storage.
 * @param {BlobClient} blobClient - Authenticated blob client
 * @param {string} blobUri - Blob URI for format detection
 * @returns {Promise<Object|Buffer>} Converted packing list data
 */
async function getPackingListFromBlob(blobClient, blobUri) {
  try {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody,
    );

    let result;
    if (isExcel(blobUri)) {
      result = convertExcelToJson({ source: downloaded });
    } else if (isCsv(blobUri)) {
      result = await convertCsvToJson(downloaded);
    } else {
      result = downloaded;
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "getPackingListFromBlob()", err);
    return {};
  }
}

/**
 * Convert readable stream to buffer by concatenating chunks.
 * @param {ReadableStream} readableStream - Stream to convert
 * @returns {Promise<Buffer>} Concatenated buffer
 */
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });

    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  }).catch((err) => {
    logger.logError(filenameForLogging, "streamToBuffer()", err);
  });
}

module.exports = { createStorageAccountClient, getPackingListFromBlob };
