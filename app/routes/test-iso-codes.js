/**
 * Test route for ISO codes integration
 *
 * Provides endpoint to test ISO codes retrieval from local file or MDM API.
 * Similar to test-ineligible-items.js for ineligible items testing.
 *
 * Usage:
 * - Local mode: Set MDM_USE_LOCAL_DATA=true, then GET http://localhost:3004/test-iso-codes
 * - MDM mode: Set MDM_USE_LOCAL_DATA=false, then GET http://localhost:3004/test-iso-codes
 *
 * Response includes:
 * - success: boolean indicating if retrieval was successful
 * - source: "local" or "mdm" indicating data source
 * - count: number of ISO codes retrieved
 * - data: array of ISO country codes
 */

const { getIsoCodes } = require("../services/iso-codes-service");
const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const config = require("../config");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "GET",
  path: "/test-iso-codes",
  options: {
    handler: async (_request, h) => {
      try {
        const isoCodes = await getIsoCodes();

        if (isoCodes) {
          const source = config.mdmConfig.useLocalData ? "local" : "mdm";
          logger.logInfo(
            filenameForLogging,
            "get()",
            `Successfully retrieved ${isoCodes.length} ISO codes from ${source}`,
          );

          return h
            .response({
              success: true,
              source: source,
              count: isoCodes.length,
              data: isoCodes,
            })
            .code(StatusCodes.OK);
        } else {
          logger.logError(
            filenameForLogging,
            "get()",
            "Failed to retrieve ISO codes",
          );
          return h
            .response({
              success: false,
              error: "Failed to retrieve ISO codes",
            })
            .code(StatusCodes.SERVICE_UNAVAILABLE);
        }
      } catch (err) {
        logger.logError(filenameForLogging, "get()", err);
        return h
          .response({
            success: false,
            error: err.message,
          })
          .code(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
