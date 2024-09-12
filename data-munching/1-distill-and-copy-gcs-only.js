const fs = require('fs/promises')
const path = require('path')
const { ids: applicationIds } = require('./application-ids')
const { moveDirectory } = require('./move-dirs')

console.log('Running matching')
console.log('Application IDs:', applicationIds.length)

const directoryPath = path.join('/Path', 'to', 'dump')
let matchingDirectories = []

async function listFiles () {
  try {
    const directories = await fs.readdir(directoryPath, { withFileTypes: true })
    console.log('Directories counter:', directories.length)

    matchingDirectories = directories
      .filter(file => {
        const dirName = file.name.toString()
        const isMatch = applicationIds.map(id => id.toString()).includes(dirName)
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

listFiles()
