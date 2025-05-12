const fileExtension = require("../../utilities/file-extension");
const config = require("../../config");
const {
  getExcelParser,
  getPdfParser,
  getPdfNonAiParser,
} = require("./parsers");
const packingListValidator = require("../validators/packing-list-column-validator");
const {
  removeEmptyItems,
  removeBadData,
} = require("../validators/packing-list-validator-utilities");
const { noMatchParsers } = require("../model-parsers");
const logger = require("../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function findParser(sanitizedPackingList, fileName) {
  let parser;

  if (fileExtension.isExcel(fileName)) {
    parser = getExcelParser(sanitizedPackingList, fileName);
  } else if (fileExtension.isPdf(fileName)) {
    parser = await getPdfNonAiParser(sanitizedPackingList, fileName);

    if (!parser && config.isDiEnabled) {
      parser = await getPdfParser(sanitizedPackingList, fileName);
    }
  } else {
    parser = null;
  }

  if (parser === null || Object.keys(parser).length === 0) {
    logger.logInfo(
      filenameForLogging,
      "findParser",
      `Failed to parse packing list with filename: ${fileName}, no match`,
    );
    parser = noMatchParsers.UNRECOGNISED;
  }

  return parser;
}

async function generateParsedPackingList(
  parser,
  sanitisedPackingList,
  dispatchLocation,
) {
  const parsedPackingList = await parser.parse(sanitisedPackingList);
  parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
  const validationResults =
    packingListValidator.validatePackingList(parsedPackingList);
  parsedPackingList.business_checks.all_required_fields_present =
    validationResults.hasAllFields;

  parsedPackingList.business_checks.failure_reasons =
    validationResults.failureReasons ? validationResults.failureReasons : null;

  parsedPackingList.items = removeBadData(parsedPackingList.items);

  parsedPackingList.dispatchLocationNumber = dispatchLocation;

  return parsedPackingList;
}

module.exports = {
  findParser,
  generateParsedPackingList,
};
