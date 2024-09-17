const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const Regex = require("../../../utilities/regex");

function parse(packingListJson) {
  const establishmentNumber =
    Regex.findMatch(
      headers.SAINSBURYS1.establishmentNumber.regex,
      packingListJson,
    )?.replace(/\u200B/g, "") ?? null;

  const packingListContents = mapParser(
    packingListJson,
    0,
    1,
    headers.SAINSBURYS1.headers,
  );

  return CombineParser.combine(
    establishmentNumber,
    packingListContents,
    true,
    ParserModel.SAINSBURYS1,
  );
}

module.exports = {
  parse,
};
