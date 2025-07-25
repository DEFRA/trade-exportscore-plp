const logger = require("../../../utilities/logger");
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const pdfHelper = require("../../../utilities/pdf-helper");

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

function matchHeaders(pageContent) {
  const isHeader = findHeader("GIOVANNI3", pageContent);
  if (isHeader === matcherResult.CORRECT) {
    return matcherResult.CORRECT;
  } else {
    return matcherResult.WRONG_HEADER;
  }
}

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
