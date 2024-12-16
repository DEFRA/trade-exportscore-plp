const createMessage = require("../messaging/create-message");
const { parsePackingList } = require("../services/parser-service");
const config = require("../config");
const excelToJson = require("@boterop/convert-excel-to-json");
const { StatusCodes } = require("http-status-codes");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

module.exports = {
  method: "GET",
  path: "/upsert-idcoms",
  options: {
    handler: async (request, h) => {
      try {
        const filename = config.plDir + request.query.filename;
        const result = excelToJson({ sourceFile: filename });
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
      }
    },
  },
};