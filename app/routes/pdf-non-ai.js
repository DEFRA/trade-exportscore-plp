const config = require("../config");
const { findParser } = require("../services/parser-service");
const fs = require("fs");

module.exports = {
  method: "GET",
  path: "/pdf-non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;

    try {
      result = fs.readFileSync(filename);
    } catch (err) {
      console.error(err);
      return h.response(`notok: ${err}`).code(500);
    }

    const packingList = await findParser(result, filename);

    return h.response(packingList).code(200);
  },
};
