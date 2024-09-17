const CombineParser = require("../../parser-combine");
const ParserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");

function parse(packingListJson) {
  try {
    const establishmentNumber = packingListJson[0].B;

    const packingListContents = mapParser(
      packingListJson,
      1,
      2,
      headers.BUFFALOAD1,
    );

    return CombineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      ParserModel.BUFFALOAD1,
    );
  } catch (err) {
    console.error(
      `${ParserModel.BUFFALOAD1} encountered: ${err} when parsing model`,
    );
  }
}

module.exports = {
  parse,
};
