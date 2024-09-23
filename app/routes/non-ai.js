const config = require("../config");
const excelToJson = require("@boterop/convert-excel-to-json");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const { StatusCodes } = require("http-status-codes");
const ParserModel = require("../services/parser-model");
const logger = require("./../utilities/logger");

module.exports = {
  method: "GET",
  path: "/non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;
    let result = {};
    try {
      result = excelToJson({ sourceFile: filename });
    } catch (err) {
      logger.log_error("routes > non-ai.js", "get() > excelToJson", err);
    }

    let packingList;
    try {
      packingList = findParser(result, filename);
      if (packingList.parserModel !== ParserModel.NOMATCH) {
        const randomInt = Math.floor(
          Math.random() * (10000000 - 1 + 1) + 1,
        ).toString();
        await createPackingList(packingList, randomInt);
      }
    } catch (err) {
      logger.log_error(
        "routes > non-ai.js",
        "get() > findParser / createPackingList",
        err,
      );
    }

    return h.response(packingList).code(StatusCodes.OK);
  },
};
