const logger = require("../../../utilities/logger");
/**
 * M&S matcher
 *
 * Detects M&S packing list format via header and establishment
 * number checks using non-AI coordinate-based PDF parsing.
 */
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const pdfHelper = require("../../../utilities/pdf-helper");

/**
 * Check whether the provided packing list matches M&S Model 1.
 * Uses coordinate-based PDF extraction to validate establishment numbers and headers.
 * @param {Buffer|Object} packingList - PDF buffer or parsed document JSON
 * @param {string} filename - Source filename for logging
 * @returns {Promise<string>} matcherResult - One of the matcher result codes
 */
async function matches(packingList, filename) {
  try {
    const pdfJson = await pdfHelper.extractPdf(packingList);
    if (pdfJson.pages.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    // Headers only appear on the first page
    const firstPage = pdfJson.pages[0];

    // check for correct establishment number
    if (
      !regex.test(headers.MANDS1.establishmentNumber.regex, firstPage.content)
    ) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // match header
    const result = findHeader(firstPage.content);

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches MandS Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);

    return matcherResult.GENERIC_ERROR;
  }
}

/**
 * Locate a header for a specific model within page content.
 * Validates that each model header regex matches at least one extracted header text.
 * @param {Array} pageContent - Extracted page content
 * @returns {string} matcherResult - `CORRECT` if all headers match, otherwise `WRONG_HEADER`
 */
function findHeader(pageContent) {
  const y1 = headers.MANDS1.minHeadersY;
  const y2 = headers.MANDS1.maxHeadersY;
  const header = pageContent.filter(
    (item) => item.y >= y1 && item.y <= y2 && item.str.trim() !== "",
  );
  const mandsHeaders = headers.MANDS1.headers;
  for (const headerField in mandsHeaders) {
    if (!Object.hasOwn(mandsHeaders, headerField)) {
      continue;
    }
    // check if any of the str fields in header match headerField regex
    const matchFound = header.some((item) =>
      mandsHeaders[headerField].regex.test(item.str),
    );
    if (!matchFound) {
      return matcherResult.WRONG_HEADER;
    }
  }

  // All headers matched successfully
  return matcherResult.CORRECT;
}

module.exports = { matches };
