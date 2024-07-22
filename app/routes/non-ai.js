const config = require("../config");
const excelToJson = require("convert-excel-to-json");
const { findParser } = require("../services/parser-service");
const { createPackingList } = require("../packing-list/index");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  method: "GET",
  path: "/non-ai",
  handler: async (_request, h) => {
    const filename = config.plDir + _request.query.filename;
    let result = {};
    try {
      result = excelToJson({ sourceFile: filename });
    } catch (err) {
      console.error(err);
    }

    const parsed = findParser(result, filename);
    if (parsed.isParsed) {
      const randomInt = Math.floor(
        Math.random() * (10000000 - 1 + 1) + 1,
      ).toString();
      await createPackingList(parsed.packingList, randomInt);
    }

    return h.response(parsed.packingList).code(StatusCodes.OK);
  },
};
