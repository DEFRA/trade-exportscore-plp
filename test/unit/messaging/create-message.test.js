const createMessage = require("../../../app/messaging/create-message");

describe("createMessage", () => {
  test("should create an approved message", () => {
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "approved",
    };

    const result = createMessage(true, "claim123");

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should create a rejected_other message for generic failures", () => {
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_other",
      failureReasons: "Identifier is missing",
    };

    const result = createMessage(false, "claim123", "Identifier is missing");

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should create a rejected_ineligible message when prohibited items identified", () => {
    const failureReasons =
      "Prohibited item identified on the packing list at Sheet 1, row 5";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_ineligible",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should create rejected_ineligible message for multiple failures including prohibited items", () => {
    const failureReasons =
      "Identifier is missing at Sheet 1, row 3.\nProhibited item identified on the packing list at Sheet 1, row 5";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_ineligible",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should create a rejected_coo message when Missing Country of Origin detected", () => {
    const failureReasons = "Missing Country of Origin for line 3 in sheet 1";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_coo",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should create a rejected_coo message when Invalid Country of Origin ISO Code detected", () => {
    const failureReasons =
      "Invalid Country of Origin ISO Code for line 5 in sheet 1";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_coo",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should create rejected_coo message for multiple failures including Country of Origin issues", () => {
    const failureReasons =
      "Identifier is missing at Sheet 1, row 2.\nMissing Country of Origin for line 3.\nTotal net weight is missing at row 7";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_coo",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });

  test("should prioritize rejected_ineligible over rejected_coo and rejected_other when all failures present (AC5)", () => {
    const failureReasons =
      "Identifier is missing at Sheet 1, row 2.\nMissing Country of Origin for line 3.\nProhibited item identified on the packing list at Sheet 1, row 5.\nTotal net weight is missing at row 7";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_ineligible",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
    // Verify failure reasons are preserved in the message body
    expect(result.body.failureReasons).toContain("Prohibited item");
    expect(result.body.failureReasons).toContain("Missing Country of Origin");
    expect(result.body.failureReasons).toContain("Identifier is missing");
  });

  test("should prioritize rejected_coo over rejected_other when both present without ineligible items (AC5)", () => {
    const failureReasons =
      "Identifier is missing at Sheet 1, row 2.\nInvalid Country of Origin ISO Code for line 3.\nTotal net weight is missing at row 7";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_coo",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
    // Verify all failure reasons are preserved
    expect(result.body.failureReasons).toContain("Invalid Country of Origin");
    expect(result.body.failureReasons).toContain("Identifier is missing");
    expect(result.body.failureReasons).toContain("Total net weight");
  });

  test("should prioritize rejected_ineligible over rejected_coo when both prohibited items and COO failures present (AC5.1)", () => {
    const failureReasons =
      "Prohibited item identified on the packing list at Sheet 1, row 3.\nInvalid Country of Origin ISO Code for line 5";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_ineligible",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
    // Verify both failure reasons are included in description field
    expect(result.body.failureReasons).toContain("Prohibited item identified");
    expect(result.body.failureReasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
  });

  test("should prioritize rejected_ineligible over rejected_other when both prohibited items and other failures present (AC5.2)", () => {
    const failureReasons =
      "Prohibited item identified on the packing list at Sheet 1, row 2.\nCheck GB Establishment RMS Number.";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_ineligible",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
    // Verify both failure reasons are included in description field
    expect(result.body.failureReasons).toContain("Prohibited item identified");
    expect(result.body.failureReasons).toContain(
      "Check GB Establishment RMS Number",
    );
  });

  test("should prioritize rejected_coo over rejected_other when both COO and other failures present (AC5.3)", () => {
    const failureReasons =
      "Invalid Country of Origin ISO Code for line 3.\nCheck GB Establishment RMS Number.";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_coo",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
    // Verify both failure reasons are included in description field
    expect(result.body.failureReasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
    expect(result.body.failureReasons).toContain(
      "Check GB Establishment RMS Number",
    );
  });

  test("should return rejected_other when only other failures present with no ineligible items or COO issues (AC5.4)", () => {
    const failureReasons =
      "Check GB Establishment RMS Number.\nNo product line data found.";
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected_other",
      failureReasons,
    };

    const result = createMessage(false, "claim123", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
    // Verify both failure reasons are included in description field
    expect(result.body.failureReasons).toContain(
      "Check GB Establishment RMS Number",
    );
    expect(result.body.failureReasons).toContain("No product line data found");
  });

  test("should create rejected_coo message for real-world data with missing Country of Origin", () => {
    // Real-world test data with:
    // - Item 1: Valid item with NIRMS and Country of Origin (ZA)
    // - Item 2: Missing Country of Origin (Non-NIRMs)
    // - Item 3: Missing Country of Origin (Non-NIRMs)
    const failureReasons =
      'Missing Country of Origin in sheet "Sheet1" row 3.\nMissing Country of Origin in sheet "Sheet1" row 4.';

    const testObject = {
      applicationId: "claim456",
      approvalStatus: "rejected_coo",
      failureReasons,
    };

    const result = createMessage(false, "claim456", failureReasons);

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });

    // Verify the specific failure reasons are present
    expect(result.body.failureReasons).toContain("Missing Country of Origin");
    expect(result.body.failureReasons).toContain('sheet "Sheet1" row 3');
    expect(result.body.failureReasons).toContain('sheet "Sheet1" row 4');
    expect(result.body.approvalStatus).toBe("rejected_coo");
  });
});
