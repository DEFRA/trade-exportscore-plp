const config = require("../config");
const { convertExcelToJson } = require("../utilities/excel-utility");
const { convertCsvToJson } = require("../utilities/csv-utility");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const { StatusCodes } = require("http-status-codes");
const parserModel = require("../services/parser-model");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const logger = require("./../utilities/logger");
const { getRandomInt } = require("../utilities/random-int");
const { isCsv } = require("../utilities/file-extension");

module.exports = {
  method: "GET",
  path: "/non-ai",
  handler: async (request, h) => {
    const filename = config.plDir + request.query.filename;
    let result = {};
    try {
      if (isCsv(filename)) {
        result = await convertCsvToJson(filename);
      } else {
        result = convertExcelToJson({ sourceFile: filename });
      }
    } catch (err) {
      logger.logError(filenameForLogging, "get() > convertExcelToJson", err);
    }

    const packingList = await findParser(
      result,
      filename,
      request.query.dispatchlocation,
    );
    if (packingList.parserModel !== parserModel.NOMATCH) {
      const randomInt = getRandomInt();

      await createPackingList(packingList, randomInt);
    }

    return h.response(packingList).code(StatusCodes.OK);
  },
};
