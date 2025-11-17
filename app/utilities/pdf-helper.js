/**
 * PDF helper utilities
 *
 * Contains small helpers that wrap `pdf.js-extract` output and provide
 * common normalisation + extraction functions used by PDF-based parsers.
 * The utilities focus on:
 *  - extracting structured content from buffers (`extractPdf`)
 *  - removing empty text fragments inserted by the extractor
 *  - sorting and grouping page content for header detection
 *  - extracting establishment numbers via regex helpers
 */

const headers = require("../services/model-headers-pdf");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const logger = require("./logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const regex = require("./regex");

/**
 * Extract structured JSON from a PDF buffer and run sanitisation on it.
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<Object>} Sanitised PDF JSON structure
 */
async function extractPdf(buffer) {
  const pdfJson = await pdfExtract.extractBuffer(buffer);
  const sanitisedJson = sanitise(pdfJson);
  return sanitisedJson;
}

/**
 * Remove elements whose width is zero from page content.
 * @param {Array} pageContent - Array of PDF content elements
 * @returns {Array} Filtered page content
 */
function removeEmptyStringElements(pageContent) {
  for (let i = pageContent.length - 1; i >= 0; i--) {
    if (pageContent[i].width === 0) {
      pageContent.splice(i, 1);
    }
  }

  return pageContent;
}

/**
 * Sanitise raw PDF JSON by removing empty elements and sorting content.
 * @param {Object} pdfJson - Raw PDF JSON from pdf.js-extract
 * @returns {Object} Sanitised PDF JSON
 */
function sanitise(pdfJson) {
  for (const page in pdfJson.pages) {
    if (pdfJson.pages.hasOwnProperty(page)) {
      // remove empty string elements
      pdfJson.pages[page].content = removeEmptyStringElements(
        pdfJson.pages[page].content,
      );

      // order by y then x
      pdfJson.pages[page].content.sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x;
        }
        return a.y - b.y;
      });
    }
  }

  return pdfJson;
}

/**
 * Return the smaller of two numeric values, handling undefined.
 * @param {number|undefined} a - First value
 * @param {number|undefined} b - Second value
 * @returns {number|undefined} Smaller value or undefined
 */
function findSmaller(a, b) {
  if (a === undefined && b === undefined) {
    return undefined;
  } else if (a === undefined) {
    return b;
  } else if (b === undefined) {
    return a;
  } else {
    return Math.min(a, b);
  }
}

/**
 * Locate and group header text fragments by X coordinate.
 * @param {Array} pageContent - Page content array
 * @param {string} model - Parser model identifier
 * @returns {Object} Header text grouped by X coordinate
 */
function getHeaders(pageContent, model) {
  try {
    const y1 = headers[model].minHeadersY;
    const y2 = headers[model].maxHeadersY;
    const header = pageContent.filter(
      (item) => item.y >= y1 && item.y <= y2 && item.str.trim() !== "",
    );

    const groupedByX = header.reduce((acc, obj) => {
      if (!acc[obj.x]) {
        acc[obj.x] = "";
      }
      acc[obj.x] += (acc[obj.x] ? " " : "") + obj.str;
      return acc;
    }, {});

    return groupedByX;
  } catch (err) {
    logger.logError(filenameForLogging, "getHeaders()", err);
    return [];
  }
}

/**
 * Extract establishment numbers (RMS numbers) from PDF page content.
 * @param {Object} pdfJson - PDF JSON structure
 * @param {RegExp} remosRegex - REMOS pattern (default: regex.remosRegex)
 * @returns {Array<string>} Array of unique establishment numbers
 */
function extractEstablishmentNumbers(pdfJson, remosRegex = regex.remosRegex) {
  let establishmentNumbers = [];
  for (const page of pdfJson.pages) {
    establishmentNumbers = regex.findAllMatches(
      remosRegex,
      page.content,
      establishmentNumbers,
    );
  }
  return establishmentNumbers;
}

/**
 * Extract establishment numbers by concatenating page text into single string.
 * @param {Object} pdfJson - PDF JSON structure
 * @param {RegExp} remosRegex - REMOS pattern
 * @returns {Array<string>} Array of unique establishment numbers
 */
function extractEstablishmentNumbersFromString(pdfJson, remosRegex) {
  let establishmentNumbers = [];

  for (const page of pdfJson.pages) {
    const pageText = page.content.map((item) => item.str).join("");
    const matches = pageText.match(remosRegex);
    for (const match of matches) {
      establishmentNumbers = regex.addMatch(match, establishmentNumbers);
    }
  }

  return establishmentNumbers;
}

module.exports = {
  getHeaders,
  extractPdf,
  findSmaller,
  removeEmptyStringElements,
  sanitise,
  extractEstablishmentNumbers,
  extractEstablishmentNumbersFromString,
};
