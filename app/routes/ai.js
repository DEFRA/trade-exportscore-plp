const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const { findParser } = require("../services/parser-service");
const logger = require("../utilities/logger");
const { createPackingList } = require("../packing-list/index");
const parserModel = require("../services/parser-model");
const crypto = require("crypto");

function getRandomInt(min = 1, max = 10000000) {
  const range = max - min + 1;
  const randomBuffer = crypto.randomBytes(4); // Get 4 bytes of random data
  const randomValue = randomBuffer.readUInt32BE(0); // Read an unsigned 32-bit integer from the buffer
  return (randomValue % range) + min; // Limit to the specified range
}

module.exports = {
  method: "GET",
  path: "/ai",
  handler: async (_request, h) => {
    try {
      const filename = config.plDir + _request.query.filename;
      let result = {};
      try {
        result = fs.readFileSync(filename);
      } catch (err) {
        logger.log_error("app/routes/ai.js", "get() > readFileSync", err);
      }

      const packingList = await findParser(result, filename);

      if (packingList.parserModel !== parserModel.NOMATCH) {
        const randomInt = getRandomInt();
        await createPackingList(packingList, randomInt);
      }

      return h.response(packingList).code(StatusCodes.OK);
    } catch (err) {
      logger.log_error("app/routes/ai.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
