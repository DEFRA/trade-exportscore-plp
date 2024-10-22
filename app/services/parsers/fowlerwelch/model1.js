const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const packingList = require("../../../models/packing-list");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const {mapParser2} = require("../../parser-map")

function parseModel(packingListJson, model, establishmentNumberRegex) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let headerRow = packingListJson[sheets[0]].findIndex(
      (x) => x.F === headers.FOWLERWELCH1.headers.description,
    );
    const establishmentNumber = regex.findMatch(
      establishmentNumberRegex,
      packingListJson[sheets[0]],
    );

    for (const sheet of sheets) {
      if (!headers.FOWLERWELCH1.invalidSheets.includes(sheet)) {
        headerRow = packingListJson[sheet].findIndex(
          (x) => x.F === headers.FOWLERWELCH1.headers.description,
        );

        packingListContentsTemp = mapParser2(
          packingListJson[sheet],
          headerRow,
          headerRow + 1,
          headers.FOWLERWELCH1.regex,
        );
        packingListContents = packingListContents.concat(packingListContentsTemp);
       
      }
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      model,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
  }
}

function parse(packingListJson) {
  return parseModel(
    packingListJson,
    parserModel.FOWLERWELCH1,
    headers.FOWLERWELCH1.establishmentNumber.regex,
  );
}


module.exports = { parse, parseModel };
