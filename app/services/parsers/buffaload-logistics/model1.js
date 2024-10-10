const combine_parser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    const establishmentNumber = regex.findMatch(
      headers.BUFFALOAD1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        1,
        2,
        headers.BUFFALOAD1.headers,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.BUFFALOAD1,
    );
  } catch (err) {
    logger.logError(
      "app/services/parsers/buffaload-logistics/model1.js",
      "matches()",
      err,
    );
  }
}

module.exports = {
  parse,
};
