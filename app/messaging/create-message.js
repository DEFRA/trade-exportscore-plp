/**
 * Message envelope builder
 *
 * Builds standardized message envelopes for parsed PLP results sent to
 * downstream Topic/Queue consumers. Includes body payload and metadata
 * properties for routing and telemetry.
 */
const { v4 } = require("uuid");

/**
 * Build a message envelope for the parsed PLP result.
 * @param {Object|null} parsedResult - Truthy when parsing succeeded
 * @param {string} applicationId - Identifier of the application being updated
 * @param {Array|null} failureReasons - Array of error reasons when parsing failed
 * @returns {Object} Message envelope with body and metadata properties
 */
function createMessage(parsedResult, applicationId, failureReasons) {
  return {
    body: {
      applicationId: applicationId,
      approvalStatus: parsedResult ? "approved" : "rejected",
      failureReasons,
    },
    // Top-level metadata properties used by the messaging infra
    type: "uk.gov.trade.plp",
    source: "trade-exportscore-plp",
    messageId: v4(),
    correlationId: v4(),
    subject: "plp.idcoms.parsed",
    contentType: "application/json",
    applicationProperties: {
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
