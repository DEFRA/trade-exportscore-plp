const parserModel = require("../../parser-model");
const combineParser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * GREGGS PDF AI parser - Model 1
 * @module parsers/greggs/model1
 */
const {
  extractPdf,
  extractEstablishmentNumbers,
} = require("../../../utilities/pdf-helper");

/**
 * Parse a GREGGS PDF document extracted by AI (Form Recognizer).
 * @param {Object} packingListDocument - Extracted document fields.
 * @param {Object} sanitizedFullPackingList - Optional full PDF for est numbers.
 * @returns {Promise<Object>} Combined parser result.
 */
async function parse(packingListDocument, sanitizedFullPackingList) {
  try {
    let establishmentNumber;
    let establishmentNumbers;

    if (
      regex.findMatch(headers.GREGGS1.establishmentNumber.regex, [
        packingListDocument.fields.NIRMSNumber,
      ])
    ) {
      establishmentNumber = packingListDocument.fields.NIRMSNumber.content;
    } else {
      establishmentNumber =
        packingListDocument.fields.PackingListContents?.values.find((x) =>
          regex.findMatch(headers.GREGGS1.establishmentNumber.regex, [
            x.properties[headers.GREGGS1.headers.remos_number],
          ]),
        ).properties[headers.GREGGS1.headers.remos_number].value;
    }

    const packingListContents = mapPdfParser(packingListDocument, "GREGGS1");

    if (sanitizedFullPackingList) {
      const pdfJson = await extractPdf(sanitizedFullPackingList);
      establishmentNumbers = extractEstablishmentNumbers(
        pdfJson,
        headers.GREGGS1.establishmentNumber.establishmentRegex,
      );
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.GREGGS1,
      establishmentNumbers,
      headers.GREGGS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return {};
  }
}

module.exports = {
  parse,
};
