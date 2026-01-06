/**
 * Message envelope builder
 *
 * Builds standardized message envelopes for parsed PLP results sent to
 * downstream Topic/Queue consumers. Includes body payload and metadata
 * properties for routing and telemetry.
 */
const { v4 } = require("uuid");

/**
 * Determine approval status based on parsing result and failure reasons.
 * @param {Object|null} parsedResult - Truthy when parsing succeeded
 * @param {string|null} failureReasons - Failure reason text when parsing failed
 * @returns {string} Approval status: "approved", "rejected_ineligible", "rejected_coo", or "rejected_other"
 */
function determineApprovalStatus(parsedResult, failureReasons) {
  if (parsedResult) {
    return "approved";
  }

  if (failureReasons && typeof failureReasons === "string") {
    // Check if failure is specifically due to ineligible/prohibited items
    if (
      failureReasons.includes("Prohibited item identified on the packing list")
    ) {
      return "rejected_ineligible";
    }

    // Check if failure is specifically due to Country of Origin issues
    if (
      failureReasons.includes("Missing Country of Origin") ||
      failureReasons.includes("Invalid Country of Origin ISO Code")
    ) {
      return "rejected_coo";
    }
  }

  return "rejected_other";
}

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
      approvalStatus: determineApprovalStatus(parsedResult, failureReasons),
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
