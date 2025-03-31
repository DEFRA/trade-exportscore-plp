const logger = require("../../../utilities/logger");
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const pdfHelper = require("../../../utilities/pdf-helper");

async function matches(packingList, filename) {
  try {
    const pdfJson = await pdfHelper.extractPdf(packingList);
    let result;

    // check for correct establishment number
    for (const page of pdfJson.pages) {
      if (
        !regex.test(headers.BOOKER1.establishmentNumber.regex, page.content)
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // match header
      const header = pdfHelper.getHeaders(page.content, "BOOKER1");
      let isBookerHeader = matcherResult.CORRECT;
      for (const x in headers["BOOKER1"].headers) {
        if (
          !header.some((item) => headers["BOOKER1"].headers[x].regex.test(item))
        ) {
          isBookerHeader = matcherResult.WRONG_HEADER;
          break;
        }
      }

      let isBookerLandscapeHeader = matcherResult.CORRECT;
      for (const x in headers["BOOKER1L"].headers) {
        if (
          !header.some((item) =>
            headers["BOOKER1L"].headers[x].regex.test(item),
          )
        ) {
          isBookerLandscapeHeader = matcherResult.WRONG_HEADER;
          break;
        }
      }

      if (
        isBookerHeader === matcherResult.CORRECT ||
        isBookerLandscapeHeader === matcherResult.CORRECT
      ) {
        result = matcherResult.CORRECT;
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

module.exports = { matches };
