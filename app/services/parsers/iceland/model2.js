const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers-csv");
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function parse(packingListCsv) {
  try {
    let packingListContents = [];
    let establishmentNumbers = [];

    // Find establishment number in CSV data
    const establishmentNumber = regex.findMatch(
      headers.ICELAND2.establishmentNumber.regex,
      packingListCsv,
    );

    // If no establishment number found, return NOMATCH
    if (!establishmentNumber) {
      return combineParser.combine(null, [], false, parserModel.NOMATCH, []);
    }

    // Find all establishment numbers for validation
    establishmentNumbers = regex.findAllMatches(
      /RMS-GB-\d{6}-\d{3}$/,
      packingListCsv,
      establishmentNumbers,
    );

    // Find header row using the header patterns
    const headerTitles = Object.values(headers.ICELAND2.regex);
    const headerCallback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const headerRow = rowFinder(packingListCsv, headerCallback);
    const dataRow = headerRow + 1;

    // Parse the CSV data using mapParser
    packingListContents = mapParser(
      packingListCsv,
      headerRow,
      dataRow,
      headers.ICELAND2,
    );

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.ICELAND2,
      establishmentNumbers,
      headers.ICELAND2,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH, []);
  }
}

module.exports = {
  parse,
};
