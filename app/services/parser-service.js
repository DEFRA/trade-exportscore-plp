const jsonFile = require("../utilities/json-file");
const fileExtension = require("../utilities/file-extension");
const parserFactory = require("./parsers/parser-factory");
const logger = require("../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function findParser(packingList, fileName) {
  return await parsePackingList(packingList, fileName);
}

async function parsePackingList(packingList, fileName) {
  try {
    const sanitizedPackingList = sanitizeInput(packingList, fileName);
    const parser = await parserFactory.findParser(sanitizedPackingList, fileName);
    return parserFactory.generateParsedPackingList(parser, sanitizedPackingList);
  }
  catch (err) {
    logger.logError(filenameForLogging, "parsePackingList()", err);
    return {};
  }
}

function sanitizeInput(packingList, fileName) {
  if (fileExtension.isExcel(fileName)) {
    // Sanitise packing list (i.e. emove trailing spaces and empty cells)
    const packingListJson = JSON.stringify(packingList);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    return JSON.parse(sanitisedPackingListJson);
  } else {
    return packingList;
  }
}

module.exports = {
  findParser,
  parsePackingList,
  sanitizeInput
};
