const fs = require('fs/promises')
const path = require('path')

async function moveDirectory (src, dest) {
  try {
    // Ensure the destination directory exists
    await fs.mkdir(dest, { recursive: true })

    // Read the contents of the source directory
    const entries = await fs.readdir(src, { withFileTypes: true })

    // Iterate over the contents
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        // Recursively move subdirectory
        await moveDirectory(srcPath, destPath)
      } else {
        // Move directory
        await fs.copyFile(srcPath, destPath)
      }

      // Remove the source directory after copying is complete
      await fs.rm(src, { recursive: true, force: true })
    }
  } catch (err) {
    console.error(`Error moving directory from ${src} to ${dest}:`, err)
  }
}

module.exports = {
  moveDirectory
}
