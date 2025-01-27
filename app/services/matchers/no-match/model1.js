const {
  createDocumentIntelligenceClient,
  runPrebuiltAnalysis,
} = require("../../document-intelligence");
const regex = require("../../../utilities/regex");

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
    const remosRegex = /RMS-GB-(\d{6})(-\d{3})?/i;
    const client = createDocumentIntelligenceClient();
    const content = await runPrebuiltAnalysis(
      client,
      "prebuilt-read",
      packingList,
    );

    return regex.findMatch(remosRegex, [content]);
  } catch (err) {
    return false;
  }
}

module.exports = { noRemosMatch, noRemosMatchPdf };
