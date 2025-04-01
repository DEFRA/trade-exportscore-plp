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

function mergeNeighbouringText(pageContent) {
  for (let i = pageContent.length - 1; i > 0; i--) {
    if (
      Math.round(pageContent[i].x) ===
        Math.round(pageContent[i - 1].x + pageContent[i - 1].width) &&
      pageContent[i].str !== " " &&
      pageContent[i - 1].str !== " " &&
      pageContent[i].y === pageContent[i - 1].y
    ) {
      pageContent[i - 1].str += pageContent[i].str;
      pageContent[i - 1].width += pageContent[i].width;
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

      // merge elements that are next to each other
      pdfJson.pages[page].content = mergeNeighbouringText(
        pdfJson.pages[page].content,
      );
    }
  }

  return pdfJson;
}

function getXsForRows(pageContent, model) {
  try {
    const header = headers[model].headers;
    const xs = {};
    for (const key in header) {
      xs[key] = findRowXFromHeaderAndTextAlignment(pageContent, header[key]);
    }
    return xs;
  } catch (err) {
    logger.logError(filenameForLogging, "getXsForRows()", err);
    return {};
  }
}

function findRowXFromHeaderAndTextAlignment(pageContent, header) {
  try {
    let x;
    switch (header?.headerTextAlignment) {
      // left header and text alignment, use the x of the header
      case "LL": {
        x =
          pageContent.filter((item) => header.regex.test(item.str))[0]?.x ??
          null;
        break;
      }
      // centre header and left text alignment
      // x value will be where the y is larger than header y
      // and x is next largest x before than header x, but isn't whitespace
      case "CL": {
        const headerPosition = pageContent.filter((item) =>
          header.regex.test(item.str),
        )[0];
        const previousXs = pageContent.filter(
          (item) =>
            item.y > headerPosition?.y &&
            item.x < headerPosition?.x &&
            item.str.trim() !== "",
        );
        x =
          previousXs.reduce(
            (max, obj) => (obj.x > max ? obj.x : max),
            previousXs[0]?.x,
          ) ?? null;
        break;
      }
      default: {
        x = null;
      }
    }
    return x;
  } catch (err) {
    logger.logError(
      filenameForLogging,
      "findRowXFromHeaderAndTextAlignment()",
      err,
    );
    return null;
  }
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
  getXsForRows,
  getYsForRows,
  getHeaders,
  extractPdf,
  findSmaller,
  findRowXFromHeaderAndTextAlignment,
  mergeNeighbouringText,
  removeEmptyStringElements,
  sanitise,
};
