const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  let packingListContentsTemp = [];
  const establishmentNumber = Regex.findMatch(
    headers.TESCO1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  const packingListContentsRow = 5;

  for (const sheet of sheets) {
    packingListContentsTemp = mapParser(
      packingListJson[sheet],
      packingListContentsRow - 1,
      packingListContentsRow,
      headers.TESCO1.headers,
    );
    packingListContents = packingListContents.concat(packingListContentsTemp);
  }
  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.TESCO1,
  );
}

module.exports = {
  parse,
};
