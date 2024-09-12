const fs = require('fs/promises')
const path = require('path')
const excelToJson = require('@boterop/convert-excel-to-json')

const { moveDirectory } = require('./dependencies/move-dirs')

const directoryPath = path.join('/Volumes', 'T7 Shield', 'MEGA DUMP')

let applicationsMatrix = []
let matchingDirectories = []

console.log('Running matching')

try {
  applicationsMatrix = excelToJson({ sourceFile: './general-certificates-matrix.csv' }).Sheet1
  console.log('Num of application IDs:', applicationsMatrix.length)
  const applicationIds = applicationsMatrix.map(row => row.A)
  console.log('application ids:', applicationIds)

  listFiles(applicationIds)
} catch (err) {
  console.error(err)
}

async function listFiles (gcApplications) {
  try {
    const directories = await fs.readdir(directoryPath, { withFileTypes: true })
    console.log('Directories counter:', directories.length)

    matchingDirectories = directories
      .filter(file => {
        const dirName = file.name.toString()
        const isMatch = gcApplications.map(id => id.toString()).includes(dirName)
        return isMatch
      })

    matchingDirectories.forEach((dir) => {
      console.log('Copying:', dir.name)
      const srcDir = '/src/' + dir.name + '/'
      const destDir = './general-certificates/' + dir.name + '/'
      moveDirectory(srcDir, destDir)
    })
    console.log('Matched dirs:', matchingDirectories.length)
  } catch (err) {
    console.log('Unable to scan directory: ' + err)
  }
}
