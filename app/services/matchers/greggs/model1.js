const logger = require("../../../utilities/logger");
const {
  createDocumentIntelligenceAdminClient,
  getLatestModelByName,
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
    // Get latest model for that version
    const adminClient = createDocumentIntelligenceAdminClient();
    const modelId = await getLatestModelByName(
      adminClient,
      headers.GREGGS1.modelId,
    );

    // Run document analysis
    const client = createDocumentIntelligenceClient();
    const document = await runAnalysis(client, modelId, packingList);

    // check for correct establishment number
    if (
      !document.fields.NIRMSNumber ||
      !regex.findMatch(headers.GREGGS1.establishmentNumber.regex, [
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
        `Packing list matches Greggs Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return result;
  }
}

module.exports = { matches };
