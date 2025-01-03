const fileExtension = require("../../utilities/file-extension");
const config = require("../../config");
const {
  getExcelParser,
  getPdfParser,
  getUnrecognisedParser,
} = require("./parsers");
const packingListValidator = require("../validators/packing-list-column-validator");
const {
  removeEmptyItems,
  removeBadData,
} = require("../validators/packing-list-validator-utilities");
const parserModel = require("../parser-model");
const logger = require("../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function findParser(sanitizedPackingList, fileName) {
  let parser;

  if (fileExtension.isExcel(fileName)) {
    parser = getExcelParser(sanitizedPackingList, fileName);
  } else if (fileExtension.isPdf(fileName) && config.isDiEnabled) {
    parser = await getPdfParser(sanitizedPackingList, fileName);
  } else {
    parser = null;
  }

  if (parser === null || Object.keys(parser).length === 0) {
    logger.logInfo(
      filenameForLogging,
      "findParser",
      `Failed to parse packing list with filename: ${fileName}, no match`,
    );
    parser = getUnrecognisedParser();
  }

  return parser;
}

function generateParsedPackingList(parser, sanitisedPackingList) {
  const parsedPackingList = parser.parse(sanitisedPackingList);

  if (parsedPackingList.parserModel !== parserModel.NOMATCH) {
    parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
    const validationResults =
      packingListValidator.validatePackingList(parsedPackingList);

    parsedPackingList.business_checks.all_required_fields_present =
      validationResults.hasAllFields;
    if (validationResults.failureReasons) {
      parsedPackingList.business_checks.failure_reasons =
        validationResults.failureReasons;
    }

    parsedPackingList.items = removeBadData(parsedPackingList.items);
  }

  return parsedPackingList;
}

module.exports = {
  findParser,
  generateParsedPackingList,
};
