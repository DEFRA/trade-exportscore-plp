const logger = require("../../../utilities/logger");
const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../document-intelligence");
const config = require("../../../config");
const matcher_result = require("../../matcher-result");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");

async function matches(packingList, filename) {
  const result = {
    isMatched: matcher_result.GENERIC_ERROR,
    document: {},
  };

  try {
    const client = createDocumentIntelligenceClient();
    const document = await runAnalysis(
      client,
      config.formRecognizerModelID,
      packingList,
    );

    // check for correct establishment number
    if (
      !regex.findMatch(headers.ICELAND1.establishmentNumber.regex, [
        document.fields.PartialNIRMSNumber,
      ])
    ) {
      result.isMatched = matcher_result.WRONG_ESTABLISHMENT_NUMBER;
      return result;
    }

    result.isMatched = matcher_result.CORRECT;
    result.document = document;

    if (result.isMatched === matcher_result.CORRECT) {
      logger.log_info(
        "app/services/matchers/iceland/model1.js",
        "matches()",
        `Packing list matches Iceland Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.log_error(
      "app/services/matchers/iceland/model1.js",
      "matches()",
      err,
    );
    return matcher_result.GENERIC_ERROR;
  }
}

module.exports = { matches };
