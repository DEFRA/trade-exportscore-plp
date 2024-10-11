const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const { findParser } = require("../services/parser-service");
const logger = require("../utilities/logger");
const { createPackingList } = require("../packing-list/index");
const parserModel = require("../services/parser-model");
const { getRandomInt } = require("../utilities/random-int");

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
        logger.logError("app/routes/ai.js", "get() > readFileSync", err);
      }

      const packingList = await findParser(result, filename);

      if (packingList.parserModel !== parserModel.NOMATCH) {
        const randomInt = getRandomInt();
        await createPackingList(packingList, randomInt);
      }

      return h.response(packingList).code(StatusCodes.OK);
    } catch (err) {
      logger.logError("app/routes/ai.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
