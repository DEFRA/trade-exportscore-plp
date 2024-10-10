const parserModel = require("../../parser-model");
const combine_parser = require("../../parser-combine");
const { mapParser } = require("../../parser-map");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    const establishmentNumber = regex.findMatch(
      headers.COOP1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );
    for (const sheet of sheets) {
      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        0,
        1,
        headers.COOP1.headers,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.COOP1,
    );
  } catch (err) {
    logger.logError("app/services/parsers/co-op/model1.js", "matches()", err);
  }
}

module.exports = {
  parse,
};
