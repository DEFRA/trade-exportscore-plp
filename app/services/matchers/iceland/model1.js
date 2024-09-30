const logger = require("../../../utilities/logger");
const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../document-intelligence");
const config = require("../../../config");
const matcher_result = require("../../matcher-result");
const headers = require("../../model-headers");

async function matches(packingList, filename) {
  try {
    const client = createDocumentIntelligenceClient();
    const document = await runAnalysis(client, config.formRecognizerModelID, packingList)

    // check for correct establishment number
    if (
      !headers.ICELAND.establishmentNumber.regex.test(document.fields.PartialNIRMSNumber.content)
    ) {
      return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
    }

    return matcher_result.CORRECT;
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
  } catch (err) {
    logger.log_error(
      "app/services/matchers/iceland/model1.js",
      "matches()",
      err,
    );
    return matcher_result.GENERIC_ERROR
  }
}

module.exports = {matches};
