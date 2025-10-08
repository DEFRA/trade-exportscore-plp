const headers = require("../services/model-headers-pdf");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const logger = require("./logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const regex = require("./regex");

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
