const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");
const { findParser } = require("../services/parser-service");

const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const logger = require("../utilities/logger");

const credential = new AzureKeyCredential(config.formRecognizerApiKey);
const client = new DocumentAnalysisClient(
  config.formRecognizerEndpoint,
  credential,
);

module.exports = {
  method: "GET",
  path: "/ai",
  handler: async (_request, h) => {
    try {
      const filename = config.plDir + _request.query.filename;
      let result = {};
      try {
        result = fs.readFileSync(filename);
      } catch (err) {
        logger.log_error("app/routes/ai.js", "get() > readFileSync", err);
      }

      const packingList = await findParser(result, filename);

      return h.response(packingList).code(StatusCodes.OK);
    } catch (error) {
      console.error("Error analyzing document:", error);
      return h.response(error.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
