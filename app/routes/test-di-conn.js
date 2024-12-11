const {
  createDocumentIntelligenceClient,
} = require("../services/document-intelligence");
const logger = require("../utilities/logger");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  method: "GET",
  path: "/test-di-conn",
  handler: async (_request, h) => {
    try {
      const client = createDocumentIntelligenceClient();
      const documentUrlRead =
        "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png";
      const poller = await client.beginAnalyzeDocument(
        "prebuilt-read",
        documentUrlRead,
      );

      const { content } = await poller.pollUntilDone();

      return h.response(content).code(StatusCodes.OK);
    } catch (err) {
      logger.logError("app/routes/test-di-conn.js", "get()", err);
      return h.response(err.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
