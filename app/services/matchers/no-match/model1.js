const regex = require("../../../utilities/regex");
const { extractPdf } = require("../../../utilities/pdf-helper");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function noRemosMatch(sanitisedPackingList, _filename) {
  const remosRegex = /RMS-GB-(\d{6}\b)(-\d{3})?/i;
  const sheets = Object.keys(sanitisedPackingList);
  for (const sheet of sheets) {
    const isRemosPresent = sanitisedPackingList[sheet].some((x) => {
      return remosRegex.test(Object.values(x));
    });
    if (isRemosPresent) {
      return true;
    }
  }
  return false;
}

async function noRemosMatchPdf(packingList) {
  try {
    const pdfJson = await extractPdf(packingList);
    const remosRegex = /RMS-GB-(\d{6})(-\d{3})?/i;
    for (const page of pdfJson.pages) {
      const result = regex.findMatch(remosRegex, page.content);
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
