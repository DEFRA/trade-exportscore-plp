const fileExtension = require("../../utilities/file-extension");
const jsonFile = require("../../utilities/json-file");
const config = require("../../config");
const { getExcelParser, getPdfParser, getUnrecognisedParser } = require("./parsers");
const packingListValidator = require("../validators/packing-list-column-validator");
const { removeEmptyItems, removeBadData } = require("../validators/packing-list-validator-utilities");
const parserModel = require("../parser-model");
const logger = require("../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);


async function parsePackingList(packingList, fileName) {
    try {
        const sanitizedPackingList = sanitizeInput(packingList, fileName);
        const parser = await findParser(sanitizedPackingList, fileName);
        return generateParsedPackingList(parser, sanitizedPackingList);
    }
    catch (err) {
        logger.logError(filenameForLogging, "parsePackingList", err);
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

async function findParser(sanitizedPackingList, fileName) {
    let parser;

    if (fileExtension.isExcel(fileName)) {
        parser = getExcelParser(sanitizedPackingList, fileName);
    } else if (fileExtension.isPdf(fileName) && config.isDiEnabled) {
        parser = await getPdfParser(sanitizedPackingList, fileName);
    }

    if (parser == null) {
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

    let parsedPackingList = parser.parse(sanitisedPackingList);

    if (parsedPackingList.parserModel !== parserModel.NOMATCH) {

        parsedPackingList.items = removeEmptyItems(parsedPackingList.items);
        const validationResults =
            packingListValidator.validatePackingList(parsedPackingList);

        parsedPackingList.business_checks.all_required_fields_present = validationResults.hasAllFields;
        if (validationResults.failureReasons) parsedPackingList.business_checks.failure_reasons = validationResults.failureReasons

        parsedPackingList.items = removeBadData(parsedPackingList.items)
    }

    return parsedPackingList;
}


module.exports = {
    sanitizeInput,
    findParser,
    generateParsedPackingList,
    parsePackingList,
};
