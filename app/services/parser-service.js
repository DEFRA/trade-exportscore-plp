/**
 * Parser service orchestration
 *
 * Main entry point for packing list parsing. Coordinates sanitization, parser selection,
 * and result generation for Excel, CSV, and PDF documents.
 */
const jsonFile = require("../utilities/json-file");
const fileExtension = require("../utilities/file-extension");
const parserFactory = require("./parsers/parser-factory");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const matcherResult = require("./matcher-result");

/**
 * Find appropriate parser and parse packing list document.
 * @param {Object|Buffer} packingList - Raw packing list data
 * @param {string} fileName - Original filename for type detection
 * @param {string} dispatchLocation - Dispatch location identifier
 * @returns {Promise<Object>} Parsed result
 */
async function findParser(packingList, fileName, dispatchLocation) {
  return parsePackingList(packingList, fileName, dispatchLocation);
}

/**
 * Parse packing list with sanitization and format-specific handling.
 * @param {Object|Buffer} packingList - Raw packing list data
 * @param {string} fileName - Original filename
 * @param {string} dispatchLocation - Dispatch location identifier
 * @returns {Promise<Object>} Parsed result
 */
async function parsePackingList(packingList, fileName, dispatchLocation) {
  try {
    const sanitizedPackingList = sanitizeInput(packingList, fileName);
    //NOSONAR - PDF parsers require async operations, so await is necessary even though some paths are synchronous
    const parser = await parserFactory.findParser(
      sanitizedPackingList,
      fileName,
    );

    if (
      fileExtension.isPdf(fileName) &&
      parser.result?.isMatched === matcherResult.CORRECT
    ) {
      //NOSONAR - await is necessary as generateParsedPackingList calls async parser.parse() internally
      return await parserFactory.generateParsedPackingList(
        parser.parser,
        parser.result.document,
        dispatchLocation,
        sanitizedPackingList,
      );
    } else {
      //NOSONAR - await is necessary as generateParsedPackingList calls async parser.parse() internally
      return await parserFactory.generateParsedPackingList(
        parser,
        sanitizedPackingList,
        dispatchLocation,
      );
    }
  } catch (err) {
    logger.logError(filenameForLogging, "parsePackingList()", err);
    return {};
  }
}

/**
 * Sanitize Excel/CSV input by removing trailing spaces and empty cells.
 * @param {Object|Buffer} packingList - Raw packing list data
 * @param {string} fileName - Original filename for format detection
 * @returns {Object|Buffer} Sanitized data
 */
function sanitizeInput(packingList, fileName) {
  if (fileExtension.isExcel(fileName) || fileExtension.isCsv(fileName)) {
    // Sanitise packing list (i.e. emove trailing spaces and empty cells)
    const packingListJson = JSON.stringify(packingList);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    return JSON.parse(sanitisedPackingListJson);
  } else {
    return packingList;
  }
}

module.exports = {
  findParser,
  parsePackingList,
  sanitizeInput,
};
