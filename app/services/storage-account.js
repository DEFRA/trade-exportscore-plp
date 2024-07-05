const config = require('../config')
const saConfig = config.saConfig
const { DefaultAzureCredential, BlobServiceClient } = require('@azure/identity')

function createStorageAccountClient () {
  return new BlobServiceClient(
    `https://${saConfig.name}.blob.core.windows.net`,
    new DefaultAzureCredential()
  )
}

module.exports = { createStorageAccountClient }
