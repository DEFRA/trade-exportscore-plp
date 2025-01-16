const { parsersExcel, parsersPdf, noMatchParsers } = require("../model-parsers");
const matcherResult = require("../matcher-result");

function getExcelParser(sanitisedPackingList, filename) {
  let parser = null;
  if (noMatchParsers.NOREMOS.matches(sanitisedPackingList, filename)) {
    Object.keys(parsersExcel).forEach((key) => {
      if (
        parsersExcel[key].matches(sanitisedPackingList, filename) ===
        matcherResult.CORRECT
      ) {
        parser = parsersExcel[key];
      }
    });
  } else {
    parser = noMatchParsers.NOREMOS;
  }
  return parser;
}

async function getPdfParser(sanitisedPackingList, filename) {
  const parser = {};
  for (const key in parsersPdf) {
    if (parsersPdf.hasOwnProperty(key)) {
      const result = await parsersPdf[key].matches(
        sanitisedPackingList,
        filename,
      );

      if (result.isMatched === matcherResult.CORRECT) {
        parser.parser = parsersPdf[key];
        parser.result = result;
        break;
      }
    }
  }

  return parser;
}

module.exports = {
  getExcelParser,
  getPdfParser,
};
