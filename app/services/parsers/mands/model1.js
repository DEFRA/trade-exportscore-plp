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
} = require("../../../services/parser-map");
const {
  extractPdf,
  extractEstablishmentNumbers,
  groupByYCoordinate,
} = require("../../../utilities/pdf-helper");

// Constants
const MODEL_NAME = "MANDS1";
const FOOTER_TEXT_PATTERN = /\* see certification/;
const PAGE_NUMBER_PATTERN = /\d of \d*/;
const FIRST_PAGE_PATTERN = /^1 of \d*/;

/**
 * Parse the supplied PDF packing list (non-AI) into structured items.
 * @param {Buffer|Object} packingList - Raw PDF buffer or helper object used
 * by the PDF extraction utility.
 * @returns {Promise<Object>} Combined parser result object.
 */
async function parse(packingList) {
  try {
    const pdfJson = await extractPdf(packingList);
    const firstPage = pdfJson.pages[0];
    
    const establishmentNumber = regex.findMatch(
      headers[MODEL_NAME].establishmentNumber.regex,
      firstPage.content,
    );

    const establishmentNumbers = extractEstablishmentNumbers(
      pdfJson,
      headers[MODEL_NAME].establishmentNumber.establishmentRegex,
    );

    const header = extractHeader(
      firstPage.content,
      headers[MODEL_NAME].minHeadersY,
      headers[MODEL_NAME].maxHeadersY,
    );
    const headersExist = checkHeadersExist(header, headers[MODEL_NAME]);

    const packingListContents = processPages(
      pdfJson.pages,
      headersExist,
    );

    const filteredContents = packingListContents.filter((row) => !isEmptyRow(row));

    return combineParser.combine(
      establishmentNumber,
      filteredContents,
      true,
      parserModel.MANDS1,
      establishmentNumbers,
      headers[MODEL_NAME],
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(
      null,
      [],
      false,
      parserModel.NOMATCH,
      [],
      headers[MODEL_NAME],
    );
  }
}

/**
 * Process all pages and extract packing list items.
 * @param {Array} pages - Array of PDF pages
 * @param {Object} headersExist - Flags indicating which headers are present
 * @returns {Array} Combined packing list contents from all pages
 */
function processPages(pages, headersExist) {
  let allContents = [];

  for (const page of pages) {
    const groupedByY = groupByYCoordinate(page.content);
    page.content = groupedByY;
    
    const ys = getYsForRows(page.content, headers[MODEL_NAME]);
    const pageContents = mapPdfNonAiParser(
      page,
      MODEL_NAME,
      ys,
      headersExist.nirms,
      headersExist.countryOfOrigin,
    );

    // Apply net weight unit to all items (header only on first page)
    pageContents.forEach((item) => {
      item.total_net_weight_unit = headersExist.totalNetWeightUnit;
    });

    allContents = allContents.concat(pageContents);

    // Stop if footer found (prevents processing final page as valid table)
    if (isEndOfItems(page.content)) {
      break;
    }
  }

  return allContents;
}

/**
 * Extract header content within Y coordinate range.
 * @param {Array} pageContent - Page content items
 * @param {number} minY - Minimum Y coordinate
 * @param {number} maxY - Maximum Y coordinate
 * @returns {Array} Filtered header items
 */
function extractHeader(pageContent, minY, maxY) {
  return pageContent.filter(
    (item) => item.y >= minY && item.y <= maxY && item.str.trim() !== "",
  );
}

/**
 * Check if specific headers exist on a page.
 * @param {Array} header - Header content items
 * @param {Object} modelHeaders - Model header configuration
 * @returns {Object} Object with boolean flags for each header type
 */
function checkHeadersExist(header, modelHeaders) {
  const totalNetWeightHeader = header.find((x) =>
    modelHeaders.headers.total_net_weight_kg.regex.test(x.str),
  )?.str; // TODO 'Units Per Tray Tot Net Weight (Kg) Tot Gross Weight (Kg) Ind Item Price Value of Goods'

  return {
    nirms: header.some((item) => modelHeaders.nirms.regex.test(item.str)),
    countryOfOrigin: header.some((item) =>
      modelHeaders.country_of_origin.regex.test(item.str),
    ),
    totalNetWeightUnit: regex.findUnit(totalNetWeightHeader)
  };
}

/**
 * Check if a row is completely empty.
 * @param {Object} row - Parsed row object
 * @returns {boolean} True if all key fields are null
 */
function isEmptyRow(row) {
  const fields = [
    "description",
    "commodity_code",
    "number_of_packages",
    "total_net_weight_kg",
    "country_of_origin",
    "nirms",
    "type_of_treatment",
  ];
  return fields.every((field) => row[field] === null);
}

/**
 * Determine the Y coordinates for rows between header and totals on a PDF
 * page. This is a helper used by the M&S PDF non-AI parser.
 * @param {Array} pageContent - Array of PDF text items with positions.
 * @param {Object} model - Model header configuration
 * @returns {Array<number>} Unique Y coordinates for rows.
 */
function getYsForRows(pageContent, model) {
  try {
    const pageNumberY = pageContent.find((item) =>
      PAGE_NUMBER_PATTERN.test(item.str),
    )?.y;
    const isFirstPage = pageContent.some((item) =>
      FIRST_PAGE_PATTERN.test(item.str),
    );
    const firstY = isFirstPage ? model.maxHeadersY : pageNumberY;
    const lastPageY = pageContent.find((item) =>
      FOOTER_TEXT_PATTERN.test(item.str),
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
  return pageContent.some((item) => FOOTER_TEXT_PATTERN.test(item.str));
}

module.exports = {
  parse,
};
