const config = require("../config");
const { convertExcelToJson } = require("../utilities/excel-utility");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const { StatusCodes } = require("http-status-codes");
const parserModel = require("../services/parser-model");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const logger = require("./../utilities/logger");
const { getRandomInt } = require("../utilities/random-int");

// Extracted processing logic for testing
const processExcelFile = async (filename, dispatchLocation = null) => {
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
};

const handler = async (request, h) => {
  const filename = config.plDir + request.query.filename;
  const packingList = await processExcelFile(
    filename,
    request.query.dispatchlocation,
  );
  return h.response(packingList).code(StatusCodes.OK);
};

const route = {
  method: "GET",
  path: "/non-ai",
  handler,
};

// Export an object with `route` so router can normalise it. Also export
// `handler` and `processExcelFile` for unit tests that import this module.
module.exports = {
  route,
  handler,
  processExcelFile,
};
