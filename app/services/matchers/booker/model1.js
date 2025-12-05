const logger = require("../../../utilities/logger");
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const pdfHelper = require("../../../utilities/pdf-helper");

/**
 * Booker matcher (model 1)
 * @param {Object|Buffer} packingList - Parsed packing list input (PDF buffer or document JSON)
 * @param {string} filename - Source filename for logging
 * @returns {Promise<string|Object>} matcherResult - One of the matcher result codes or a detailed result object
 */
async function matches(packingList, filename) {
  try {
    /**
     * Booker matcher (model 1)
     *
     * Detects the Booker packing list format by checking establishment
     * identifiers and header row signatures.
     */
    const pdfJson = await pdfHelper.extractPdf(packingList);
    let result;

    if (pdfJson.pages.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    // check for correct establishment number
    for (const page of pdfJson.pages) {
      if (
        !regex.test(headers.BOOKER1.establishmentNumber.regex, page.content)
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // match header
      result = matchHeaders(page.content);
      if (result === matcherResult.WRONG_HEADER) {
        return matcherResult.WRONG_HEADER;
      }
    }

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches Booker Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);

    return matcherResult.GENERIC_ERROR;
  }
}

/**
 * Determine whether any known Booker header variant is present on the page.
 * @param {string} pageContent - Extracted page content from PDF
 * @returns {string} matcherResult - `CORRECT` or `WRONG_HEADER`
 */
function matchHeaders(pageContent) {
  const isBookerHeader = findHeader("BOOKER1", pageContent);
  const isBookerLandscapeHeader = findHeader("BOOKER1L", pageContent);

  if (
    isBookerHeader === matcherResult.CORRECT ||
    isBookerLandscapeHeader === matcherResult.CORRECT
  ) {
    return matcherResult.CORRECT;
  } else {
    return matcherResult.WRONG_HEADER;
  }
}

/**
 * Find and validate a header for a given model on the supplied page content.
 * @param {string} model - Header model key (e.g., 'BOOKER1')
 * @param {string} pageContent - Extracted page content from PDF
 * @returns {string} matcherResult - `CORRECT` or `WRONG_HEADER`
 */
function findHeader(model, pageContent) {
  const header = pdfHelper.getHeaders(pageContent, model);

  let isBookerHeader = matcherResult.WRONG_HEADER;
  for (const x in headers[model].headers) {
    if (!headers[model].headers.hasOwnProperty(x)) {
      return isBookerHeader;
    }
    const matchHeader = headers[model].headers[x];
    for (const i in header) {
      if (
        matchHeader.regex.test(header[i]) &&
        i >= matchHeader.x1 &&
        i <= matchHeader.x2
      ) {
        isBookerHeader = matcherResult.CORRECT;
        break;
      } else {
        isBookerHeader = matcherResult.WRONG_HEADER;
      }
    }
    if (isBookerHeader === matcherResult.WRONG_HEADER) {
      break;
    }
  }

  return isBookerHeader;
}

module.exports = { matches };
