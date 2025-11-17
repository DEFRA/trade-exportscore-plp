/**
 * Parser factory module
 *
 * Provides utilities to find the appropriate parser for a given packing
 * list file and to generate a parsed packing list result including
 * validation and cleanup.
 * @module services/parsers/parser-factory
 */

const fileExtension = require("../../utilities/file-extension");
const config = require("../../config");
const {
  getCsvParser,
  getExcelParser,
  getPdfParser,
  getPdfNonAiParser,
} = require("./parsers");
const packingListValidator = require("../validators/packing-list-column-validator");
const {
  removeEmptyItems,
  removeBadData,
} = require("../validators/packing-list-validator-utilities");
const { noMatchParsers } = require("../model-parsers");
const logger = require("../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Find a parser suitable for the supplied packing list and filename.
 * @param {Object} sanitizedPackingList - Sanitised packing list content.
 * @param {string} fileName - Original filename supplied by the caller.
 * @returns {Object} Matching parser module or a no-match parser.
 */
async function findParser(sanitizedPackingList, fileName) {
  let parser;

  if (fileExtension.isExcel(fileName)) {
    parser = getExcelParser(sanitizedPackingList, fileName);
  } else if (fileExtension.isCsv(fileName)) {
    parser = getCsvParser(sanitizedPackingList, fileName);
  } else if (fileExtension.isPdf(fileName)) {
    parser = await getPdfNonAiParser(sanitizedPackingList, fileName);

    if (!parser && config.isDiEnabled) {
      parser = await getPdfParser(sanitizedPackingList, fileName);
    }
  } else {
    parser = null;
  }

  if (parser === null || Object.keys(parser).length === 0) {
    logger.logInfo(
      filenameForLogging,
      "findParser",
      `Failed to parse packing list with filename: ${fileName}, no match`,
    );
    parser = noMatchParsers.UNRECOGNISED;
  }

  return parser;
}

/**
 * Generate a parsed packing list using the provided parser and then run
 * business validations and cleanup utilities.
 * @param {Object} parser - Parser module implementing `parse`.
 * @param {Object} sanitisedPackingList - Sanitised packing list content.
 * @param {string} dispatchLocation - Dispatch location number.
 * @param {Object|null} sanitizedFullPackingList - Optional full packing list.
 * @returns {Object} Parsed and validated packing list result.
 */
async function generateParsedPackingList(
  parser,
  sanitisedPackingList,
  dispatchLocation,
  sanitizedFullPackingList = null,
) {
  const parsedPackingList = await parser.parse(
    sanitisedPackingList,
    sanitizedFullPackingList,
  );
  parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
  const validationResults =
    packingListValidator.validatePackingList(parsedPackingList);
  parsedPackingList.business_checks.all_required_fields_present =
    validationResults.hasAllFields;

  parsedPackingList.business_checks.failure_reasons =
    validationResults.failureReasons ? validationResults.failureReasons : null;

  parsedPackingList.items = removeBadData(parsedPackingList.items);

  parsedPackingList.dispatchLocationNumber = dispatchLocation;

  return parsedPackingList;
}

module.exports = {
  findParser,
  generateParsedPackingList,
};
