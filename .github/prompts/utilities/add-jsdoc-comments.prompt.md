# Add JSDoc Comments to Folder

Add comprehensive module headers and JSDoc comments to all JavaScript files in a folder and its subfolders **recursively**.

## Instructions

You are tasked with adding consistent, high-quality documentation to all JavaScript files within a specified folder and **recursively through all subfolders** (including nested subdirectories at any depth).

### Requirements

For **every JavaScript file** in the folder structure:

1. **Module Header** (before any `require`/`import` statements):
   ```javascript
   /**
    * Module purpose - short summary.
    *
    * Additional behavioural notes (side-effects, exported helpers, testing hints).
    */
   ```

2. **Function JSDoc** (for all exported functions and non-trivial helpers):
   ```javascript
   /**
    * Brief description of what the function does.
    * @param {Type} paramName - Parameter description
    * @param {Type} otherParam - Parameter description
    * @returns {Type} Return value description
    */
   function example(paramName, otherParam) { ... }
   ```

### Style Guidelines

- **Module headers**: Appear before any `require` or `import` statements
- **Brevity**: Keep descriptions concise, clear, and focused on behavior
- **Tone**: Use present tense, active voice, English
- **Types**: Use simple types (e.g., `Array`, `Object`, `string`, `number`, `boolean`, `Promise`)
- **Parameters**: Include type, name, and brief description for each
- **Returns**: Always specify return type and what it represents
- **Inline comments**: Only for non-obvious behavior, keep to 1-2 lines

### Process

1. **Recursively** scan all JavaScript files in the specified folder and all subfolders (at any depth)
2. Identify files missing module headers or function JSDoc
3. Add or update documentation following the style guidelines
4. Ensure consistency across all files in the entire folder tree
5. Preserve existing good comments, only enhance where needed

### Example Before/After

**Before:**
```javascript
const fs = require('fs');
const path = require('path');

function readConfig(filename) {
  const data = fs.readFileSync(filename, 'utf8');
  return JSON.parse(data);
}

module.exports = { readConfig };
```

**After:**
```javascript
/**
 * Configuration file reader
 *
 * Provides synchronous file reading and JSON parsing for configuration files.
 * Throws on invalid JSON or missing files.
 */
const fs = require('fs');
const path = require('path');

/**
 * Read and parse a JSON configuration file.
 * @param {string} filename - Path to configuration file
 * @returns {Object} Parsed configuration object
 */
function readConfig(filename) {
  const data = fs.readFileSync(filename, 'utf8');
  return JSON.parse(data);
}

module.exports = { readConfig };
```

## Usage

**Target Folder:** `{FOLDER_PATH}`

Please add appropriate module headers and JSDoc comments to all JavaScript files in the folder and **recursively through all subfolders at any depth** following the requirements above.
