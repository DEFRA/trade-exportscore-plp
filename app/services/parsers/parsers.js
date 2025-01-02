const { parsersExcel, parsersPdf } = require("../model-parsers");
const parserModel = require("../parser-model");
const matcherResult = require("../matcher-result");
const combineParser = require("../parser-combine");

function getUnrecognisedParser() {
  return {
    parse: (_packingList, _filename) => {
      return combineParser.combine(null, [], false, parserModel.NOMATCH);
    },
    name: "unrecognised parser",
  };
}

function getExcelParser(sanitisedPackingList, filename) {
  let parser = null;
  Object.keys(parsersExcel).forEach((key) => {
    if (
      parsersExcel[key].matches(sanitisedPackingList, filename) ===
      matcherResult.CORRECT
    ) {
      parser = parsersExcel[key];
    }
  });

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
  getUnrecognisedParser,
};
