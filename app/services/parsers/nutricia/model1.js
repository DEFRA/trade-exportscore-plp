const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");

function parse(packingListJson) {
  const establishmentNumber = Regex.findMatch(
    headers.NUTRICIA1.establishmentNumber.regex,
    packingListJson,
  );

  const headerTitles = Object.values(headers.NUTRICIA1.headers);
  function callback(x) {
    return Object.values(x).includes(headerTitles[0]);
  }
  const headerRow = rowFinder(packingListJson, callback);
  const dataRow = headerRow + 1;
  const packingListContents = mapParser(
    packingListJson,
    headerRow,
    dataRow,
    headers.NUTRICIA1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.NUTRICIA1,
  );
}

module.exports = {
  parse,
};
