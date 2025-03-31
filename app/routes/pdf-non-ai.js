const config = require("../config");
const { findParser } = require("../services/parser-service");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;

    try {
      result = fs.readFileSync(filename);
    } catch (err) {
      logger.logError("app/routes/pdf-non-ai.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }

    const packingList = await findParser(result, filename);

    return h.response(packingList).code(200);
  },
};
