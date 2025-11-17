const logger = require("../../../utilities/logger");
/**
 * Giovanni matcher (model 3)
 *
 * Additional Giovanni PDF matcher variant that checks page headers
 * and establishment identifiers.
 */
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const pdfHelper = require("../../../utilities/pdf-helper");

/**
 * Giovanni matcher (model 3)
 * @param {Buffer|Object} packingList - PDF buffer or parsed document JSON
 * @param {string} filename - Source filename for logging
 * @returns {Promise<string|Object>} matcherResult - One of the matcher result codes or a result object
 */
async function matches(packingList, filename) {
  try {
    const pdfJson = await pdfHelper.extractPdf(packingList);
    let result;

    if (pdfJson.pages.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    // check for correct establishment number
    for (const page of pdfJson.pages) {
      if (
        !regex.test(headers.GIOVANNI3.establishmentNumber.regex, page.content)
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
        `Packing list matches Giovanni Model 3 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);

    return matcherResult.GENERIC_ERROR;
  }
}

/**
 * Check page content for Giovanni Model 3 headers.
 * @param {string} pageContent - Extracted page content
 * @returns {string} matcherResult - `CORRECT` or `WRONG_HEADER`
 */
function matchHeaders(pageContent) {
  const isHeader = findHeader("GIOVANNI3", pageContent);
  if (isHeader === matcherResult.CORRECT) {
    return matcherResult.CORRECT;
  } else {
    return matcherResult.WRONG_HEADER;
  }
}

/**
 * Locate a header for a specific model within page content.
 * @param {string} model - Header model key (e.g., 'GIOVANNI3')
 * @param {string} pageContent - Extracted page content
 * @returns {string} matcherResult - `CORRECT` or `WRONG_HEADER`
 */
function findHeader(model, pageContent) {
  const header = pdfHelper.getHeaders(pageContent, model);
  let isHeader = matcherResult.WRONG_HEADER;
  for (const x in headers[model].headers) {
    if (!headers[model].headers.hasOwnProperty(x)) {
      return isHeader;
    }
    const matchHeader = headers[model].headers[x];
    for (const i in header) {
      if (
        matchHeader.regex.test(header[i]) &&
        i >= matchHeader.x1 &&
        i <= matchHeader.x2
      ) {
        isHeader = matcherResult.CORRECT;
        break;
      } else {
        isHeader = matcherResult.WRONG_HEADER;
      }
    }
    if (isHeader === matcherResult.WRONG_HEADER) {
      break;
    }
  }
  return isHeader;
}

module.exports = { matches };
