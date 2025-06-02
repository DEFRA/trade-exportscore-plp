const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapPdfNonAiParser } = require("../../../services/parser-map");
const { extractPdf } = require("../../../utilities/pdf-helper");

async function parse(packingList) {
  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const pdfJson = await extractPdf(packingList);
    const establishmentNumber = regex.findMatch(
      headers.GIOVANNI3.establishmentNumber.regex,
      pdfJson.pages[0].content,
    );

    const model = "GIOVANNI3";

    for (const page of pdfJson.pages) {
      const ys = getYsForRows(page.content, model);
      packingListContentsTemp = mapPdfNonAiParser(page, model, ys);
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.GIOVANNI3,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}

function getYsForRows(pageContent, model) {
  try {
    const headerY = headers[model].maxHeadersY;

    // Find the first Y after the header
    const firstY = pageContent.find((item) => item.y > headerY)?.y;
    if (!firstY) {
      return [];
    }

    // Group items by Y value
    const rowsByY = {};
    for (const item of pageContent) {
      const y = Number(item.y.toFixed(2));
      if (!rowsByY[y]) {
        rowsByY[y] = [];
      }
      rowsByY[y].push(item.str.trim());
    }

    // Sort Y values and collect rows until stopping condition
    const sortedYs = Object.keys(rowsByY)
      .map(Number)
      .sort((a, b) => a - b);

    const ysInRange = [];
    const filteredYs = sortedYs.filter((y) => y >= firstY);

    for (const y of filteredYs) {
      const row = rowsByY[y];
      if (row.length < 10 || row[0] === "0") {
        break; // Stop if row is short or starts with '0'
      }
      ysInRange.push(y);
    }

    return ysInRange;
  } catch (err) {
    logger.logError(filenameForLogging, "getYsForRows()", err);
    return [];
  }
}

module.exports = {
  parse,
};
