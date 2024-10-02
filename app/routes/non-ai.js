const config = require("../config");
const excelToJson = require("@boterop/convert-excel-to-json");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const { StatusCodes } = require("http-status-codes");
const parserModel = require("../services/parser-model");
const crypto = require("crypto");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function getRandomInt(min = 1, max = 10000000) {
  const range = max - min + 1;
  const randomBuffer = crypto.randomBytes(4); // Get 4 bytes of random data
  const randomValue = randomBuffer.readUInt32BE(0); // Read an unsigned 32-bit integer from the buffer
  return (randomValue % range) + min; // Limit to the specified range
}
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
      logger.log_error(filenameForLogging, "get() > excelToJson", err);
    }

    const packingList = findParser(result, filename);
    if (packingList.parserModel !== parser_model.NOMATCH) {
      const randomInt = getRandomInt();
      await createPackingList(packingList, randomInt);
    }

    return h.response(packingList).code(StatusCodes.OK);
  },
};
