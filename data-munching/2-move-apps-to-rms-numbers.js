const fs = require('fs').promises
const path = require('path')

const excelToJson = require('@boterop/convert-excel-to-json')

let applicationsMatrix = []

console.log('Running mover...')

try {
  // First off, load in the application x RMS matrix
  applicationsMatrix = excelToJson({
    sourceFile: './general-certificates-matrix.csv',
    columnToKey: {
      A: 'applicationId',
      B: 'rmsNumber'
    }
  }).Sheet1
  console.log('Num of application IDs:', applicationsMatrix)

  listAndCopyGCs()
} catch (err) {
  console.error(err)
}

async function listAndCopyGCs () {
  try {
    const basePath = path.join('/path/to/your/directory')
    const srcPath = path.join(basePath, 'gcs-only')
    const destPath = path.join(basePath, 'moved')

    const directories = await fs.readdir(srcPath)
    console.log('Directories:', directories)

    console.log('applicationsMatrix', applicationsMatrix)

    // Loop each directory, find directory as applicationsMatrix.applicationId, then copy to applicationsMatrix.rmsNumber/applicationId
    directories.forEach(async (dir) => {
      const entry = applicationsMatrix.find(row => row.applicationId === parseInt(dir))
      if (entry) {
        console.log('Copying:', dir)
        const src = path.join(srcPath, dir)
        const dest = path.join(destPath, entry.rmsNumber, dir)
        try {
          await fs.cp(src, dest, { recursive: true })
        } catch (err) {
          console.error(`Error copying ${src} to ${dest}:`, err)
        }
      }
    })
  } catch (err) {
    console.log('Unable to scan directory: ' + err)
  }
}
