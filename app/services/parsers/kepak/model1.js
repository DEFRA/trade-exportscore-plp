const ParserModel = require("../../parser-model");
const CombineParser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");

function parse(packingListJson) {
  try {
    const establishmentNumberRow = 12;
    const dataRow = 21;

    const establishmentNumber =
      packingListJson[establishmentNumberRow].A ?? null;

    const packingListContents = mapParser(
      packingListJson,
      dataRow - 1,
      dataRow,
      headers.KEPAK1,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.KEPAK1,
    );
  } catch (err) {
    console.error(
      `${ParserModel.KEPAK1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
