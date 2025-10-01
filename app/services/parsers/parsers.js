const {
  parsersExcel,
  parsersCsv,
  parsersPdf,
  parsersPdfNonAi,
  noMatchParsers,
} = require("../model-parsers");
const matcherResult = require("../matcher-result");
const headers = require("../model-headers-pdf");

function getExcelParser(sanitisedPackingList, filename) {
  return getParser(
    sanitisedPackingList,
    filename,
    parsersExcel,
    noMatchParsers.NOREMOS,
  );
}

function getCsvParser(sanitisedPackingList, filename) {
  return getParser(
    sanitisedPackingList,
    filename,
    parsersCsv,
    noMatchParsers.NOREMOSCSV,
  );
}

function getParser(sanitisedPackingList, filename, parsers, nomatch) {
  let parser = null;

  if (nomatch.matches(sanitisedPackingList, filename)) {
    for (const key in parsers) {
      if (
        parsers[key].matches(sanitisedPackingList, filename) ===
        matcherResult.CORRECT
      ) {
        parser = parsers[key];
      }
    }
  } else {
    parser = nomatch;
  }
  return parser;
}

async function getPdfParser(sanitisedPackingList, filename) {
  let parser = {};
  const remos = await noMatchParsers.NOREMOSPDF.matches(sanitisedPackingList);

  if (remos) {
    let result = {};

    for (const pdfModel in parsersPdf) {
      if (headers[pdfModel].establishmentNumber.regex.test(remos)) {
        result = await parsersPdf[pdfModel].matches(
          sanitisedPackingList,
          filename,
        );
      }

      if (result.isMatched === matcherResult.CORRECT) {
        parser.parser = parsersPdf[pdfModel];
        parser.result = result;
        break;
      }
    }
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
        (await parsersPdfNonAi[key].matches(sanitisedPackingList, filename)) ===
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
  getCsvParser,
  getPdfParser,
  getPdfNonAiParser,
};
