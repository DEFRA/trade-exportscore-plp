/**
 * AI-enabled parsing route
 *
 * Reads a file buffer, runs it through the parser-service to detect
 * and parse packing lists (AI or PDF-based). When a parser matches,
 * the parsed packing list is persisted using `createPackingList`.
 */
const fs = require("node:fs");
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
  handler: async (request, h) => {
    try {
      const filename = config.plDir + request.query.filename;
      let result = {};
      try {
        result = fs.readFileSync(filename);
      } catch (err) {
        logger.logError("app/routes/ai.js", "get() > readFileSync", err);
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
    } catch (err) {
      logger.logError("app/routes/ai.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
