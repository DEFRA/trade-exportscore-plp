const fs = require('fs').promises
const path = require('path')

const excelToJson = require('@boterop/convert-excel-to-json')

let applicationsMatrix = []

console.log('Running reporting...')

try {
  // First off, load in the application x RMS matrix
  applicationsMatrix = excelToJson({
    sourceFile: './general-certificates-matrix.csv',
    columnToKey: {
      A: 'applicationId',
      B: 'rmsNumber',
      C: 'traderName'
    }
  }).Sheet1

  runReport()
} catch (err) {
  console.error(err)
}

async function runReport () {
  try {
    const basePath = path.join('/some/path/to/your/directory')

    // Grab dir contents and filter out and dotfiles
    let directories = await fs.readdir(basePath, { withFileTypes: true })
    directories = directories.filter(dirent => !dirent.name.startsWith('.')).map(dirent => dirent.name)

    for (const dir of directories) {
      // Find the first entry of the rmsNumber to the traderName
      const entry = applicationsMatrix.find(row => row.rmsNumber === dir)
      console.log('Trader Name: ', entry.traderName)
      console.log('RMS Number:  ', dir)

      // List applications within it
      const listedAppsPath = path.join(basePath, dir)
      let listedApps = await fs.readdir(listedAppsPath, { withFileTypes: true })
      listedApps = listedApps.filter(dirent => !dirent.name.startsWith('.')).map(dirent => dirent.name)
      console.log('  - Number of applications:', listedApps.length)
      // console.log(entry.traderName, ',', dir, ',', listedApps.length)

      // Loop over the list of applications and check to see if the dir only contains 'supplementary-documents'
      for (const app of listedApps) {
        const appPath = path.join(listedAppsPath, app)
        let appContents = await fs.readdir(appPath, { withFileTypes: true })
        appContents = appContents.filter(dirent => !dirent.name.startsWith('.')).map(dirent => dirent.name)

        if (appContents.length === 1 && appContents[0] === 'supplementary-documents') {
          // console.log('  - only supplementary-documents in folder')
        } else {
          console.log('  - more than just SPs in folder: ', appContents)
        }
      }

      console.log('')
    }
  } catch (err) {
    console.log('Unable to scan directory: ' + err)
  }
}
