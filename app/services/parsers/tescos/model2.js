const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.TESCO2.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      0,
      2,
      headers.TESCO2.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO2,
  );
}

module.exports = {
  parse,
};
