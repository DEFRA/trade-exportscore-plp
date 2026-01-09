/**
 * File processing helpers
 *
 * These functions coordinate converting incoming files into the internal
 * packing-list representation and persisting results when a parser is found.
 * The module intentionally keeps responsibilities narrow:
 *  - Convert the raw input (Excel/CSV) into the data structure expected by
 *    the parser service.
 *  - Invoke the parser discovery and, if a parser matched, create a
 *    `PackingList` record using `createPackingList`.
 *
 * Error handling: conversion errors are logged and an empty structure is
 * passed to the parser discovery step so that the pipeline can gracefully
 * return a NOMATCH result rather than throwing.
 */

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

/**
 * Process Excel file and parse packing list.
 * @param {string} filename - Path to Excel file
 * @param {string|null} dispatchLocation - Dispatch location identifier
 * @returns {Promise<Object>} Parsed packing list object
 */
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

/**
 * Process CSV file and parse packing list.
 * @param {string} filename - Path to CSV file
 * @param {string|null} dispatchLocation - Dispatch location identifier
 * @returns {Promise<Object>} Parsed packing list object
 */
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
    //await createPackingList(packingList, randomInt);
  }

  return packingList;
}

module.exports = { processExcelFile, processCsvFile, processPdfFile };
