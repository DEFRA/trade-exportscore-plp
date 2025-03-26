const regex = require("../../../utilities/regex");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

function noRemosMatch(sanitisedPackingList, _filename) {
  const remosRegex = /RMS-GB-(\d{6})(-\d{3})?/i;
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
    const pdfJson = await pdfExtract.extractBuffer(packingList);
    const remosRegex = /RMS-GB-(\d{6})(-\d{3})?/i;
    for (const page of pdfJson.pages) {
      const result = regex.findMatch(remosRegex, page.content)
      if (result) {
        return result
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}

module.exports = { noRemosMatch, noRemosMatchPdf };
