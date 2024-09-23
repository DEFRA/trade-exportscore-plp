const excelToJson = require("@boterop/convert-excel-to-json");
const { BlobClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../utilities/logger");

function createStorageAccountClient(blobUri) {
  return new BlobClient(blobUri, new DefaultAzureCredential());
}

async function getXlsPackingListFromBlob(blobClient) {
  try {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody,
    );
    const result = excelToJson({
      source: downloaded,
    });
    return result;
  } catch (err) {
    logger.log_error(
      "services > storage-account.js",
      "getXlsPackingListFromBlob()",
      err,
    );
  }
}

async function streamToBuffer(readableStream) {
  try {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  } catch (err) {
    logger.log_error("services > storage-account.js", "streamToBuffer()", err);
  }
}

module.exports = { createStorageAccountClient, getXlsPackingListFromBlob };
