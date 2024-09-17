const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");

function parse(packingListJson) {
  try {
    const establishmentNumber =
      packingListJson[1].N?.replace(/\u200B/g, "") ?? null;

    const packingListContents = mapParser(
      packingListJson,
      0,
      1,
      headers.SAINSBURYS1,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.SAINSBURYS1,
    );
  } catch (err) {
    console.error(
      `${ParserModel.SAINSBURYS1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
