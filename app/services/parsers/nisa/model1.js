const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");

function parse(packingListJson) {
  try {
    const establishmentNumber = packingListJson[1].A ?? null;

    const packingListContents = mapParser(packingListJson, 0, 1, headers.NISA1);

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.NISA1,
    );
  } catch (err) {
    console.error(
      `${ParserModel.NISA1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
