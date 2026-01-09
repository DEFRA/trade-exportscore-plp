/**
 * M&S PDF non-AI parser - Model 1
 * @module parsers/mands/model1
 */
const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers-pdf");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const {
  mapPdfNonAiParser,
  extractPdfNonAiNetWeightUnit,
} = require("../../../services/parser-map");
const {
  extractPdf,
  extractEstablishmentNumbers,
  groupByYCoordinate,
} = require("../../../utilities/pdf-helper");

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
      headers.MANDS1.establishmentNumber.regex,
      pdfJson.pages[0].content,
    );

    const establishmentNumbers = extractEstablishmentNumbers(
      pdfJson,
      headers.MANDS1.establishmentNumber.establishmentRegex,
    );

    const model = "MANDS1";
    const netWeightUnit = extractPdfNonAiNetWeightUnit(pdfJson.pages[0], model);

    for (const page of pdfJson.pages) {
      const groupedByY = groupByYCoordinate(page.content);
      page.content = groupedByY;
      const ys = getYsForRows(page.content, headers.MANDS1);
      packingListContentsTemp = mapPdfNonAiParser(page, model, ys);

      // since header is only on first page, update all items
      packingListContentsTemp.forEach((item) => {
        item.total_net_weight_unit = netWeightUnit;
      });

      packingListContents = packingListContents.concat(packingListContentsTemp);

      // if footer runs over 2 pages this breaks the loop to stop the final page being processed as a valid table
      if (isEndOfItems(page.content)) {
        break;
      }
    }

    // filter out empty rows
    packingListContents = packingListContents.filter(
      (row) =>
        !(
          row.description === null &&
          row.commodity_code === null &&
          row.number_of_packages === null &&
          row.total_net_weight_kg === null &&
          row.country_of_origin === null &&
          row.nirms === null &&
          row.type_of_treatment === null
        ),
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.MANDS1,
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
      [],
      headers.MANDS1,
    );
  }
}

/**
 * Determine the Y coordinates for rows between header and totals on a PDF
 * page. This is a helper used by the M&S PDF non-AI parser.
 * @param {Array} pageContent - Array of PDF text items with positions.
 * @returns {Array<number>} Unique Y coordinates for rows.
 */
function getYsForRows(pageContent, model) {
  try {
    const pageNumberY = pageContent.find((item) =>
      /\d of \d*/.test(item.str),
    )?.y;
    const isFirstPage = pageContent.some((item) => /^1 of \d*/.test(item.str));
    const firstY = isFirstPage ? model.maxHeadersY : pageNumberY;
    const lastPageY = pageContent.find((item) =>
      /\* see certification/.test(item.str),
    )?.y;

    const lastY = lastPageY ?? Math.max(...pageContent.map((item) => item.y));
    const ys = [
      ...new Set(
        pageContent
          .filter(
            (item) =>
              item.y > firstY && item.y < lastY && item.str.trim() !== "",
          )
          .map((item) => Number(item.y.toFixed(2))),
      ),
    ].sort((a, b) => a - b);

    return ys;
  } catch (err) {
    logger.logError(filenameForLogging, "getYsForRows()", err);
    return [];
  }
}

/**
 * Check if the current page content indicates the end of the table.
 * @param {Array} pageContent - Array of PDF text items with positions.
 * @returns {boolean} True if the end of the table is found, false otherwise.
 */
function isEndOfItems(pageContent) {
  return pageContent.some((item) => /\* see certification/.test(item.str));
}

module.exports = {
  parse,
};
