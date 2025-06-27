const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { mapPdfNonAiParser } = require("../../../services/parser-map");
const { extractPdf, findSmaller } = require("../../../utilities/pdf-helper");

async function parse(packingList) {
  try {
    let packingListContents = [];
    let packingListContentsTemp = [];

    const pdfJson = await extractPdf(packingList);

    const establishmentNumber = regex.findMatch(
      headers.BOOKER1.establishmentNumber.regex,
      pdfJson.pages[0].content,
    );

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
      [],
      headers[model].findUnitInHeader,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(
      null,
      [],
      false,
      parserModel.NOMATCH,
      headers.BOOKER1.findUnitInHeader,
    );
  }
}

function getYsForRows(pageContent, model) {
  try {
    const headerY = headers[model].maxHeadersY;
    const firstY = pageContent.filter((item) => item.y > headerY)[0].y;
    const pageNumberY = pageContent.filter((item) =>
      /Page \d of \d*/.test(item.str),
    )[0]?.y; // find the position of the 'Page X of Y'
    const totals = pageContent.filter((item) =>
      headers[model].totals.test(item.str),
    ); // find the position of the totals row
    const totalsY = totals.reduce(
      (max, obj) => (obj.y > max ? obj.y : max),
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
