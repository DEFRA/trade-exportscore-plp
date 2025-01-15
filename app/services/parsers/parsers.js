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

function getMissingRemosParser() {
  return {
    parse: (_packingList, _filename) => {
      return combineParser.combine(null, [], false, parserModel.NOMATCH, "No GB Establishment RMS Number");
    },
    name: "missing remos parser",
  };
}

function remosCheck(sanitisedPackingList) {
  let isRemosPresent;
  const remosRegex = /RMS-GB-(\d{6})(-\d{3})?/i;
  const sheets = Object.keys(sanitisedPackingList);
  for (const sheet of sheets) {
    isRemosPresent = sanitisedPackingList[sheet].some((x) => {
      return remosRegex.test(Object.values(x));
    });
  }
  return isRemosPresent;
}

function getExcelParser(sanitisedPackingList, filename) {
  let parser = null;
  if (remosCheck(sanitisedPackingList) === true) {
    Object.keys(parsersExcel).forEach((key) => {
      if (
        parsersExcel[key].matches(sanitisedPackingList, filename) ===
        matcherResult.CORRECT
      ) {
        parser = parsersExcel[key];
      }
    });
  } else {
    parser = getMissingRemosParser();
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
  getUnrecognisedParser,
};
