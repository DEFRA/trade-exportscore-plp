/**
 * Approval status utility
 *
 * Provides shared logic for determining approval status based on
 * parsing results and validation failure reasons. Used by both
 * database persistence and message creation to ensure consistency.
 */

/**
 * Determine approval status based on parsing result and failure reasons.
 * @param {boolean} allRequiredFieldsPresent - True when all business checks pass
 * @param {string|null} failureReasons - Failure reason text when validation failed
 * @returns {string} Approval status: "approved", "rejected_ineligible", "rejected_coo", or "rejected_other"
 */
function determineApprovalStatus(allRequiredFieldsPresent, failureReasons) {
  if (allRequiredFieldsPresent) {
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

module.exports = { determineApprovalStatus };
