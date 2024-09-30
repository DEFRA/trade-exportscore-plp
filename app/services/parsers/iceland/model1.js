const parser_model = require("../../parser-model");
const combine_parser = require("../../parser-combine");
const { mapPdfParser } = require("../../parser-map");
const logger = require("../../../utilities/logger");

function parse(packingListDocument) {
  try {
    establishmentNumber = packingListDocument.fields.PartialNIRMSNumber.content;
    const packingListContents = mapPdfParser(packingListDocument, "ICELAND");

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