/**
 * Message envelope builder
 *
 * Builds standardized message envelopes for parsed PLP results sent to
 * downstream Topic/Queue consumers. Includes body payload and metadata
 * properties for routing and telemetry.
 */
const { v4 } = require("uuid");
const { determineApprovalStatus } = require("../utilities/approval-status");

/**
 * Build a message envelope for the parsed PLP result.
 * @param {Object|null} parsedResult - Truthy when parsing succeeded
 * @param {string} applicationId - Identifier of the application being updated
 * @param {Array|string|null} failureReasons - Failure reasons when parsing failed
 * @returns {Object} Message envelope with body and metadata properties
 */
function createMessage(parsedResult, applicationId, failureReasons) {
  const normalizedFailureReasons = Array.isArray(failureReasons)
    ? failureReasons.join("\n")
    : (failureReasons ?? null);

  const approvalStatus = determineApprovalStatus(
    Boolean(parsedResult),
    normalizedFailureReasons,
  );

  return {
    body: {
      applicationId: applicationId,
      approvalStatus,
      failureReasons: normalizedFailureReasons,
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
