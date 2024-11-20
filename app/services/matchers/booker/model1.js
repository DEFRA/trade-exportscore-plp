const logger = require("../../../utilities/logger");
const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../document-intelligence");
const matcherResult = require("../../matcher-result");
const headers = require("../../model-headers");
const regex = require("../../../utilities/regex");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function matches(packingList, filename) {
  const result = {
    isMatched: matcherResult.GENERIC_ERROR,
    document: {},
  };
  try {
    const client = createDocumentIntelligenceClient();
    const document = await runAnalysis(
      client,
      headers.BOOKER1.modelId,
      packingList,
    );

    // check for correct establishment number
    if (
      !document.fields.NIRMSNumber ||
      !regex.findMatch(headers.BOOKER1.establishmentNumber.regex, [
        document.fields.NIRMSNumber,
      ])
    ) {
      result.isMatched = matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      return result;
    }

    result.isMatched = matcherResult.CORRECT;
    result.document = document;

    if (result.isMatched === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches Booker Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return result;
  }
}

module.exports = { matches };