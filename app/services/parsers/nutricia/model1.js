const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.NUTRICIA1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  const headerTitles = Object.values(headers.NUTRICIA1.headers);
  function callback(x) {
    return Object.values(x).includes(headerTitles[0]);
  }
  const headerRow = rowFinder(packingListJson[sheets[0]], callback);
  const dataRow = headerRow + 1;

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      headerRow,
      dataRow,
      headers.NUTRICIA1.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

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
