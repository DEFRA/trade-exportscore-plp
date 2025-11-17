const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * ICELAND PDF AI parser - Model 1
 * @module parsers/iceland/model1
 */

/**
 * Parse an ICELAND PDF document extracted by AI (Form Recognizer).
 * @param {Object} packingListDocument - Extracted document fields.
 * @param {Object} sanitizedFullPackingList - Optional full PDF for est numbers.
 * @returns {Promise<Object>} Combined parser result.
 */
const {
  extractPdf,
  extractEstablishmentNumbersFromString,
} = require("../../../utilities/pdf-helper");

async function parse(packingListDocument, sanitizedFullPackingList) {
  try {
    let establishmentNumber;
    let establishmentNumbers = [];

    if (
      regex.findMatch(headers.ICELAND1.establishmentNumber.regex, [
        packingListDocument.fields.PartialNIRMSNumber,
      ])
    ) {
      establishmentNumber = headers.ICELAND1.establishmentNumber.value;
    }
    const packingListContents = mapPdfParser(packingListDocument, "ICELAND1");

    if (sanitizedFullPackingList) {
      const pdfJson = await extractPdf(sanitizedFullPackingList);
      establishmentNumbers = extractEstablishmentNumbersFromString(
        pdfJson,
        headers.ICELAND1.establishmentNumber.establishmentRegex,
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ICELAND1,
      establishmentNumbers,
      headers.ICELAND1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return {};
  }
}

module.exports = {
  parse,
};
