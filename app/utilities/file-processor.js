const { convertExcelToJson } = require("../utilities/excel-utility");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const parserModel = require("../services/parser-model");
const path = require("node:path");
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

  const packingList = await findParser(result, filename, dispatchLocation);

  if (packingList.parserModel !== parserModel.NOMATCH) {
    const randomInt = getRandomInt();
    await createPackingList(packingList, randomInt);
  }

  return packingList;
}

module.exports = { processExcelFile };
