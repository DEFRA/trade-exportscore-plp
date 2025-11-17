/**
 * TJ Morris matcher (model 1)
 *
 * Detects TJ Morris packing list layouts via header and establishment
 * number rules.
 */
const matcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Check whether the provided packing list matches TJ Morris Model 1.
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} - One of matcherResult codes
 */
function matches(packingList, filename) {
  try {
    const sheets = Object.keys(packingList);
    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        !regex.test(
          headers.TJMORRIS1.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      const header = {
        J: "TREATMENTTYPE",
        L: "Description",
        N: "Description",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight",
      };

      const headerRow = rowFinder(packingList[sheet], callback);

      if (
        !packingList[sheet][headerRow] ||
        headerRow === -1 ||
        !isHeaderMatching(packingList[sheet], header, headerRow)
      ) {
        return matcherResult.WRONG_HEADER;
      }
    }

    logger.logInfo(
      filenameForLogging,
      "matches()",
      `Packing list matches tjmorris Model 1 with filename: ${filename}`,
    );

    return matcherResult.CORRECT;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

/**
 * Row-finder callback used to locate the header row.
 * @param {Object} x - A row object from the sheet
 * @returns {boolean} true when the row looks like the header row
 */
function callback(x) {
  return x.L?.toLowerCase().includes("description");
}

/**
 * Validate that the identified header row contains expected header values.
 * @param {Array<Object>} packingListSheet - Rows for a single sheet
 * @param {Object} header - Map of expected header column keys to labels
 * @param {number} headerRow - Row index of the candidate header
 * @returns {boolean} true if headerRow contains the expected labels
 */
function isHeaderMatching(packingListSheet, header, headerRow) {
  for (const key in header) {
    if (
      !packingListSheet[headerRow][key]
        ?.toLowerCase()
        .includes(header[key].toLowerCase())
    ) {
      return false;
    }
  }
  return true;
}

module.exports = {
  matches,
};
