const parser_model = require("../../parser-model");
const combine_parser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");

function parse(packingListDocument) {
  try {
    if (regex.findMatch(headers.ICELAND1.establishmentNumber.regex, [packingListDocument.fields.PartialNIRMSNumber])) {
      establishmentNumber = headers.ICELAND1.establishmentNumber.value;
    };
    const packingListContents = mapPdfParser(packingListDocument, "ICELAND1");

    return combine_parser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parser_model.ICELAND1,
    );
  } catch (err) {
    logger.log_error("app/services/parsers/iceland/model1.js", "parse()", err);
  }
}

module.exports  = {
  parse,
}