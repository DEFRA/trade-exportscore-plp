const { createStorageAccountClient, streamToBuffer } = require('../../../app/services/storage-account')
const { BlobClient } = require('@azure/storage-blob')
const { PassThrough } = require('stream')

jest.mock('@azure/storage-blob')

// jest.mock('@azure/storage-blob', () => {
//   class BlobClient {
//     constructor () {}
//     download () {
//       return Promise.resolve({
//         readableStreamBody: 'help'
//       })
//     }
//   }
// })

describe('createStorageAccountClient', () => {
  test('returns blob client', () => {
    createStorageAccountClient('abc')
    expect(BlobClient).toHaveBeenCalled()
  })
})

describe('streamToBuffer', () => {
  test('returns result', async () => {
    const mockReadable = new PassThrough()
    const mockError = new Error('You crossed the streams!')
    const result = await streamToBuffer(mockReadable)
    setTimeout(() => {
      mockReadable.emit('error', mockError)
    }, 100)
    console.log(result)
  })
})
