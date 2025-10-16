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
  const booker2 = /RMS-GB-000077-\d{3}/i;

  return (
    giovanni2Regex.test(y) ||
    cdsRegex.test(y) ||
    sainsburysRegex.test(y) ||
    booker2.test(y)
  );
}

function rmsCsvExceptions(y) {
  const icelandRegex = /RMS-GB-000040-\d{3}$/i;

  return icelandRegex.test(y);
}

function noRemosMatchCsv(sanitisedPackingList, _filename) {
  const remosRegex = /^RMS-GB-\d{6}-\d{3}$/i;
  const isRemosPresent = sanitisedPackingList.some((x) => {
    return Object.values(x).some((y) => {
      return remosRegex.test(y) || rmsCsvExceptions(y);
    });
  });
  return isRemosPresent;
}

async function noRemosMatchPdf(packingList) {
  try {
    const pdfJson = await extractPdf(packingList);

    for (const page of pdfJson.pages) {
      const result =
        regex.findMatch(regex.remosRegex, page.content) ||
        regex.findMatch(
          headersPdf.ICELAND1.establishmentNumber.regex,
          page.content,
        ) ||
        regex.findMatch(
          headersPdf.GREGGS1.establishmentNumber.regex,
          page.content,
        ) ||
        regex.findMatch(
          headersPdf.MANDS1.establishmentNumber.regex,
          page.content,
        );
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

module.exports = { noRemosMatch, noRemosMatchCsv, noRemosMatchPdf };
