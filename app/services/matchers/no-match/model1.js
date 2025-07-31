const regex = require("../../../utilities/regex");
const { extractPdf } = require("../../../utilities/pdf-helper");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const headersPdf = require("../../model-headers-pdf");

function noRemosMatch(sanitisedPackingList, _filename) {
  const remosRegex = /^RMS-GB-\d{6}-\d{3}$/i;

  const sheets = Object.keys(sanitisedPackingList);
  for (const sheet of sheets) {
    const isRemosPresent = sanitisedPackingList[sheet].some((x) => {
      return Object.values(x).some((y) => {
        return remosRegex.test(y) || rmsExceptions(y);
      });
    });
    if (isRemosPresent) {
      return true;
    }
  }
  return false;
}

function rmsExceptions(y) {
  const giovanni2Regex = /\(NIRMS RMS-GB-\d{6}-\d{3}\)/i;
  const cdsRegex = /\/ RMS-GB-000252-\d{3} \//i;
  const sainsburysRegex = /^RMS-GB-000094-\d{3}​$/i;
  const giovanni1Regex = /^RMS-GB-000153$/i;
  const kepakRegex = /^RMS-GB-000280$/i;

  return (
    giovanni2Regex.test(y) ||
    cdsRegex.test(y) ||
    sainsburysRegex.test(y) ||
    giovanni1Regex.test(y) ||
    kepakRegex.test(y)
  );
}

async function noRemosMatchPdf(packingList) {
  try {
    const pdfJson = await extractPdf(packingList);
    for (const page of pdfJson.pages) {
      const result = regex.findMatch(regex.remosRegex, page.content) || regex.findMatch(headersPdf.MANDS1.establishmentNumber.regex, page.content);
      if (result) {
        return result;
      }
    }
    return false;
  } catch (err) {
    logger.logError(filenameForLogging, "noRemosMatchPdf()", err);
    return false;
  }
}

module.exports = { noRemosMatch, noRemosMatchPdf };
