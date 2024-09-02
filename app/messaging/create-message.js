const { v4 } = require("uuid");

function createMessage(parsedResult, applicationId) {
  return {
    body: {
      applicationId: applicationId,
      approvalStatus: parsedResult ? "approved" : "rejected",
    },
    type: "uk.gov.trade.plp",
    source: "trade-exportscore-plp",
    messageId: v4(),
    correlationId: v4(),
    label: "plp.idcoms.parsed",
    applicationProperties: {
      ContentType: "application/json",
      EntityKey: applicationId,
      PublisherId: "PLP",
      SchemaVersion: 1,
      Type: "Internal",
      Status: "Complete",
      TimestampUtc: Date.now(),
    },
  };
}

module.exports = createMessage;
