const logger = require("../../../utilities/logger");
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const pdfHelper = require('../../../utilities/pdf-helper');

function matches(packingList, filename) {
  try {
    let result;

    // check for correct establishment number
    for (const page of packingList) {
      if (
        !regex.test(headers.BOOKER2.establishmentNumber.regex, page.content)
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // match header
      const header = pdfHelper.getHeaders(page.content, "BOOKER2");

      for (const x in headers["BOOKER2"].headers) {
        if (!header.some(item => headers["BOOKER2"].headers[x].regex.test(item))) {
          return matcherResult.WRONG_HEADER
        }
      }
    }

    result = matcherResult.CORRECT

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches Booker Model 2 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);

    return matcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };