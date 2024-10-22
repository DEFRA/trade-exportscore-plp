const { matchesModel } = require("../fowlerwelch/model1");
const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

// function matches(packingList, filename)
// {
//   try {
//     let result;
//     const sheets = Object.keys(packingList);
//     if (sheets?.length === 0) {
//       return matcherResult.EMPTY_FILE;
//     }

//     for (const sheet of sheets) {
//       if(!((sheet === "Invoice") || (sheet === "Lookups") || (sheet === "Addresses") || (sheet === "Batch Info") || (sheet === "Commodity") || (sheet === "Meursing") || (sheet === "Products"))) {
//       }
//       // check for correct establishment number
//       if (
//         !regex.test(headers.WARRENS1.establishmentNumber.regex, packingList[sheet])
//       ) {
//         return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
//       }
//       // check for header values
//       result = matchesHeader(headers.WARRENS1.regex, packingList[sheet]);

//     }

//     if (result === matcherResult.CORRECT) {
//       logger.log_info(
//         filenameForLogging,
//         "matches()",
//         `Packing list matches Warrens Model 1 with filename: ${filename}`,
//       );
//     }

//     return result;
//   } catch (err) {
//     logger.logError(filenameForLogging, "matches()", err);

//     return matcherResult.GENERIC_ERROR;
//   }
// }
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    /^RMS-GB-000174-\d{3}$/,
    "Warrens",
  );
}

module.exports = { matches };
