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

      // const poller = await client.beginAnalyzeDocument(
      //   config.formRecognizerModelID,
      //   fileBuffer,
      // );

      // const {
      //   documents: [document],
      // } = await poller.pollUntilDone();

      // if (!document) {
      //   throw new Error("Expected at least one document in the result.");
      // }

      // /*
      //   const diReturn = {
      //     extractedDocument: document.docType,
      //     confidence: document.confidence || '<undefined>',
      //     fields: document.fields
      //   }
      // */

      // /*
      //   Note: .content vs .value. .value is the parsed value of the field, .content is the raw text.
      //   EG: commoditycode.kind = integer, .value = 102 as it's set up as an int in the DI model config, .content = 0102 is the raw text.
      //   Note: Not all returned data elements have a .value, eg, Net Weight doesn't as it's a number.
      //   Note: if a DI model element config is set up to be an integer, the return will be as an int, otherwise it'll be as a string. Commodity Codes will be an int, therefore missing their leading zero.
      // */

      // // First off, check that the PartialNIRMSNumber.value contains the ReMoS number
      // const establishmentNumber = document.fields.PartialNIRMSNumber.content;
      // // TODO: regex check

      // const packingListContents = [];
      // for (
      //   let i = 0;
      //   i < document.fields.PackingListContents.values.length;
      //   i++
      // ) {
      //   const row = document.fields.PackingListContents.values[i].properties;
      //   const plRow = {
      //     description: row["Part Description"].value,
      //     nature_of_products: null,
      //     type_of_treatment: null,
      //     commodity_code: row["Tariff Code"].value,
      //     number_of_packages: row["Unit Qty"].value * row.Packages.value,
      //     total_net_weight_kg: row["Net Weight (KG)"].content, // Doesn't have a .value!
      //   };
      //   packingListContents.push(plRow);
      // }

      // const output = {
      //   establishmentNumber,
      //   packingListContents,
      // };
      const output = {};
      return h.response(output).code(StatusCodes.OK);
    } catch (error) {
      console.error("Error analyzing document:", error);
      return h.response(error.message).code(StatusCodes.SERVICE_UNAVAILABLE);
    }
  },
};
