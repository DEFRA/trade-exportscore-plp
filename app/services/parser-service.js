const jsonFile = require("../utilities/json-file");
const fileExtension = require("../utilities/file-extension");
const parserFactory = require("./parsers/parser-factory");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const matcherResult = require("./matcher-result");

async function findParser(packingList, fileName, dispatchLocation) {
  return parsePackingList(packingList, fileName, dispatchLocation);
}

async function parsePackingList(packingList, fileName, dispatchLocation) {
  try {
    const sanitizedPackingList = sanitizeInput(packingList, fileName);
    const parser = await parserFactory.findParser(
      sanitizedPackingList,
      fileName,
    );

    if (
      fileExtension.isPdf(fileName) &&
      parser.result?.isMatched === matcherResult.CORRECT
    ) {
      return await parserFactory.generateParsedPackingList(
        parser.parser,
        parser.result.document,
        dispatchLocation,
        sanitizedPackingList,
      );
    } else {
      return await parserFactory.generateParsedPackingList(
        parser,
        sanitizedPackingList,
        dispatchLocation,
      );
    }
  } catch (err) {
    logger.logError(filenameForLogging, "parsePackingList()", err);
    return {};
  }
}

function sanitizeInput(packingList, fileName) {
  if (fileExtension.isExcel(fileName) || fileExtension.isCsv(fileName)) {
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
  sanitizeInput,
};
