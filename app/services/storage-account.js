const excelToJson = require("convert-excel-to-json");
const { BlobClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");

function createStorageAccountClient(blobUri) {
  return new BlobClient(blobUri, new DefaultAzureCredential());
}

async function getXlsPackingListFromBlob(blobClient) {
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = await streamToBuffer(
    downloadBlockBlobResponse.readableStreamBody,
  );
  const result = excelToJson({
    source: downloaded,
  });
  return result;
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
  });
}

module.exports = { createStorageAccountClient, getXlsPackingListFromBlob };
