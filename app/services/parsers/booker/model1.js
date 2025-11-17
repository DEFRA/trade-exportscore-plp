const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapPdfNonAiParser } = require("../../../services/parser-map");
const {
  extractPdf,
  findSmaller,
  extractEstablishmentNumbers,
} = require("../../../utilities/pdf-helper");

/**
 * BOOKER non-AI PDF parser - Model 1
 * @module parsers/booker/model1
 */

/**
 * Parse the supplied PDF packing list (non-AI) into structured items.
 * @param {Buffer|Object} packingList - Raw PDF buffer or helper object used
 * by the PDF extraction utility.
 * @returns {Promise<Object>} Combined parser result object.
 */
async function parse(packingList) {
  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const pdfJson = await extractPdf(packingList);

    const establishmentNumber = regex.findMatch(
      headers.BOOKER1.establishmentNumber.regex,
      pdfJson.pages[0].content,
    );

    const establishmentNumbers = extractEstablishmentNumbers(pdfJson);

    let model = "BOOKER1";
    if (
      regex.findMatch(
        headers.BOOKER1L.headers.type_of_treatment.regex,
        pdfJson.pages[0].content,
      )
    ) {
      model = "BOOKER1L";
    }

    for (const page of pdfJson.pages) {
      const ys = getYsForRows(page.content, model);
      packingListContentsTemp = mapPdfNonAiParser(page, model, ys);
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BOOKER1,
      establishmentNumbers,
      headers[model],
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(
      null,
      [],
      false,
      parserModel.NOMATCH,
      headers.BOOKER1,
    );
  }
}

/**
 * Determine the Y coordinates for rows between header and totals on a PDF
 * page. This is a helper used by the BOOKER non-AI parser.
 * @param {Array} pageContent - Array of PDF text items with positions.
 * @param {string} model - Parser model key (e.g., 'BOOKER1').
 * @returns {Array<number>} Unique Y coordinates for rows.
 */
function getYsForRows(pageContent, model) {
  try {
    const headerY = headers[model].maxHeadersY;
    const firstY = pageContent.find((item) => item.y > headerY).y;
    const pageNumberY = pageContent.find((item) =>
      /Page \d of \d*/.test(item.str),
    )?.y; // find the position of the 'Page X of Y'
    const totals = pageContent.filter((item) =>
      headers[model].totals.test(item.str),
    ); // find the position of the totals row
    const totalsY = totals.reduce(
      (max, obj) => Math.max(obj.y, max),
      totals[0]?.y,
    ); // take the largest y
    const y = findSmaller(pageNumberY, totalsY);
    const lastY = pageContent
      .filter((item) => item.y < y)
      .sort((a, b) => b.y - a.y)[0]?.y;
    const ys = [
      ...new Set(
        pageContent
          .filter((item) => item.y >= firstY && item.y <= lastY)
          .map((item) => Number(item.y.toFixed(2))),
      ),
    ];
    return ys;
  } catch (err) {
    logger.logError(filenameForLogging, "getYsForRows()", err);
    return [];
  }
}

module.exports = {
  parse,
};
