const config = require("../config");
const excelToJson = require("@boterop/convert-excel-to-json");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const { StatusCodes } = require("http-status-codes");
const parserModel = require("../services/parser-model");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const logger = require("./../utilities/logger");
const { getRandomInt } = require("../utilities/random-int");

module.exports = {
  method: "GET",
  path: "/non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;
    let result = {};
    try {
      result = excelToJson({ sourceFile: filename });
    } catch (err) {
      logger.logError(filenameForLogging, "get() > excelToJson", err);
    }

    const packingList = await findParser(result, filename);
    if (packingList.parserModel !== parserModel.NOMATCH) {
      const randomInt = getRandomInt();

      await createPackingList(packingList, randomInt);
    }

    return h.response(packingList).code(StatusCodes.OK);
  },
};
