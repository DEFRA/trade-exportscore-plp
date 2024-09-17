const excelToJson = require("@boterop/convert-excel-to-json");
const { BlobClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");

function createStorageAccountClient(blobUri) {
  return new BlobClient(blobUri, new DefaultAzureCredential());
}

/**
 * Summary. Gets the Packing List from the blob storage.
 *
 * Description. Gets the Packing List from the blob storage via the supplied blob client and returns it as JSON.
 * @param {object}         blobClient The Blob Client to connect to the blob storage with.
 */
async function getPackingListFromBlob(blobClient) {
  const response = await blobClient.download();
  const downloaded = await streamToBuffer(response.readableStreamBody);
  const result = excelToJson({ source: downloaded });

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

module.exports = { createStorageAccountClient, getPackingListFromBlob };
