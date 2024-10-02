const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const { findParser } = require("../services/parser-service");
const logger = require("../utilities/logger");
const { createPackingList } = require("../packing-list/index");
const parser_model = require("../services/parser-model");

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

      if (packingList.parserModel !== parser_model.NOMATCH) {
        const randomInt = Math.floor(
          Math.random() * (10000000 - 1 + 1) + 1,
        ).toString();
        await createPackingList(packingList, randomInt);
      }

      return h.response(packingList).code(StatusCodes.OK);
    } catch (error) {
      console.error("Error analyzing document:", error);
      return h.response(error.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
