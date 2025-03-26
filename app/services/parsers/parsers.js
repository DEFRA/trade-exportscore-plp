const {
  parsersExcel,
  parsersPdf,
  parsersPdfNonAi,
  noMatchParsers,
} = require("../model-parsers");
const matcherResult = require("../matcher-result");
const headers = require("../model-headers");

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
  let parser = {};
  const remos = await noMatchParsers.NOREMOSPDF.matches(sanitisedPackingList);

  if (remos) {
    let result = {};

    for (const key in parsersPdf) {
      if (headers[key].establishmentNumber.regex.test(remos)) {
        result = await parsersPdf[key].matches(
          sanitisedPackingList,
          filename,
        );
      }

      if (result.isMatched === matcherResult.CORRECT) {
        parser.parser = parsersPdf[key];
        parser.result = result;
        break;
      }
    };

  } else {
    parser = noMatchParsers.NOREMOS;
  }

  return parser;
}

async function getPdfNonAiParser(sanitisedPackingList, filename) {
  let parser = null;

  if (await noMatchParsers.NOREMOSPDF.matches(sanitisedPackingList, filename)) {
    for (const key in parsersPdfNonAi) {
      if (
        await parsersPdfNonAi[key].matches(sanitisedPackingList, filename) ===
        matcherResult.CORRECT
      ) {
        parser = parsersPdfNonAi[key];
      }
    }
  } else {
    parser = noMatchParsers.NOREMOS;
  }
  return parser;
}

module.exports = {
  getExcelParser,
  getPdfParser,
  getPdfNonAiParser,
};
