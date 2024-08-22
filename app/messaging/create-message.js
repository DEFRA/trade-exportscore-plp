const { v4 } = require("uuid");

function createMessage(parsedResult, applicationId) {
  return {
    body: {
      applicationId: applicationId,
      approvalStatus: parsedResult ? "approved" : "rejected",
    },
    type: "uk.gov.trade.plp",
    source: "trade-exportscore-plp",
    MessageId: v4(),
    CorrelationId: v4(),
    ContentType: "application/json",
    EntityKey: applicationId,
    PublisherId: "PLP",
    SchemaVersion: 1,
    Type: "Internal",
    Status: "Complete",
    TimestampUtc: Date.now(),
    Label: "plp.idcoms.parsed",
  };
}

module.exports = createMessage;
