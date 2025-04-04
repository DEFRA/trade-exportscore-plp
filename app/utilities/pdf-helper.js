const headers = require("../services/model-headers");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const logger = require("./logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function extractPdf(buffer) {
  const pdfJson = await pdfExtract.extractBuffer(buffer);
  const sanitisedJson = sanitise(pdfJson);
  return sanitisedJson;
}

function removeEmptyStringElements(pageContent) {
  for (let i = pageContent.length - 1; i >= 0; i--) {
    if (pageContent[i].width === 0) {
      pageContent.splice(i, 1);
    }
  }

  return pageContent;
}

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

function getYsForRows(pageContent, model) {
  try {
    const headerY = pageContent.filter((item) =>
      headers[model].maxHeadersY.test(item.str),
    )[0]?.y;
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
          .map((item) => item.y),
      ),
    ];
    return ys;
  } catch (err) {
    logger.logError(filenameForLogging, "getYsForRows()", err);
    return [];
  }
}

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

function getHeaders(pageContent, model) {
  try {
    const y1 = pageContent.filter((item) =>
      headers[model].minHeadersY.test(item.str),
    )[0]?.y;
    const y2 = pageContent.filter((item) =>
      headers[model].maxHeadersY.test(item.str),
    )[0]?.y;
    const header = pageContent.filter(
      (item) => item.y >= y1 && item.y <= y2 && item.str.trim() !== "",
    );

    const groupedByX = header.reduce((acc, obj) => {
      if (!acc[obj.x]) {
        acc[obj.x] = [];
      }
      acc[obj.x].push(obj.str);
      return acc;
    }, {});

    const result = Object.values(groupedByX);
    const joinedArray = result.map((x) => x.join(" "));

    return joinedArray;
  } catch (err) {
    logger.logError(filenameForLogging, "getHeaders()", err);
    return [];
  }
}

module.exports = {
  getYsForRows,
  getHeaders,
  extractPdf,
  findSmaller,
  removeEmptyStringElements,
  sanitise,
};
