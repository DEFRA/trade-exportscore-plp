/**
 * Create packing list message route
 *
 * Converts an Excel file to parser JSON, runs the parser, and builds
 * the outbound IdComs message structure so callers can preview the
 * message payload that would be sent.
 */
const createMessage = require("../messaging/create-message");
const { parsePackingList } = require("../services/parser-service");
const config = require("../config");
const { convertExcelToJson } = require("../utilities/excel-utility");
const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "GET",
  path: "/create-packinglist-message",
  options: {
    handler: async (request, h) => {
      try {
        const filename = config.plDir + request.query.filename;
        const result = convertExcelToJson({ sourceFile: filename });
        const packingList = await parsePackingList(
          result,
          request.query.filename,
        );
        const returnMessage = createMessage(
          packingList.business_checks.all_required_fields_present,
          request.query.applicationId,
          packingList.business_checks.failure_reasons,
        );

        return h.response(returnMessage).code(StatusCodes.OK);
      } catch (err) {
        logger.logError(filenameForLogging, "get()", err);
        return h.response().code(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
