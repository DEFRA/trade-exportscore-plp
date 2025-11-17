const { convertExcelToJson } = require("../utilities/excel-utility");
const { convertCsvToJson } = require("../utilities/csv-utility");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const parserModel = require("../services/parser-model");
const path = require("node:path");
const fs = require("node:fs");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const logger = require("./logger");
const { getRandomInt } = require("./random-int");

async function processExcelFile(filename, dispatchLocation = null) {
  let result = {};
  try {
    result = convertExcelToJson({ sourceFile: filename });
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "processExcelFile() > convertExcelToJson",
      err,
    );
  }

  return processData(result, filename, dispatchLocation);
}

async function processCsvFile(filename, dispatchLocation = null) {
  let data = {};
  try {
    data = await convertCsvToJson(filename);
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "processCsvFile() > convertCsvToJson",
      err,
    );
  }

  return processData(data, filename, dispatchLocation);
}

/**
 * Process PDF file and parse packing list.
 * @param {string} filename - Path to PDF file
 * @param {string|null} dispatchLocation - Dispatch location identifier
 * @returns {Promise<Object>} Parsed packing list object
 */
async function processPdfFile(filename, dispatchLocation = null) {
  let buffer = {};
  try {
    buffer = fs.readFileSync(filename);
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "processPdfFile() > fs.readFileSync",
      err,
    );
  }

  return processData(buffer, filename, dispatchLocation);
}

/**
 * Process converted data through parser and persist if matched.
 * @param {Object} data - Converted packing list data
 * @param {string} filename - Original filename
 * @param {string|null} dispatchLocation - Dispatch location identifier
 * @returns {Promise<Object>} Parsed packing list object
 */
async function processData(data, filename, dispatchLocation) {
  const packingList = await findParser(data, filename, dispatchLocation);

  if (packingList.parserModel !== parserModel.NOMATCH) {
    const randomInt = getRandomInt();
    await createPackingList(packingList, randomInt);
  }

  return packingList;
}

module.exports = { processExcelFile, processCsvFile, processPdfFile };
