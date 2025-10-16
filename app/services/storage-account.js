const { convertExcelToJson } = require("../utilities/excel-utility");
const { convertCsvToJson } = require("../utilities/csv-utility");
const { BlobClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { isExcel, isCsv } = require("../utilities/file-extension");

function createStorageAccountClient(blobUri) {
  return new BlobClient(blobUri, new DefaultAzureCredential());
}

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
