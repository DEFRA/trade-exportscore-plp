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
    const failureReasons =
      'Total net weight is missing in sheet "PackingList" row 15.\nInvalid entry for NIRMS/Non-NIRMS goods in sheet "PackingList" row 23.';
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
  });

  test("should create a rejected_ineligible message when prohibited items identified", () => {
    // Carrot product with commodity code 07061000 (prohibited item)
    const failureReasons =
      'Prohibited item identified on the packing list in sheet "Products" row 12.';
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
    // Fresh celery (prohibited) with additional validation failures
    const failureReasons =
      'No of packages is missing in sheet "Manifest" row 8.\nProhibited item identified on the packing list in sheet "Manifest" row 14.\nTotal net weight is missing in sheet "Manifest" row 21.';
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
    // CARPLAN DEMON FREEZE product missing Country of Origin
    const failureReasons =
      'Missing Country of Origin in sheet "Export_Data" row 5.';
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
    // Book product with invalid CoO code "UK" instead of "GB"
    const failureReasons =
      'Invalid Country of Origin ISO Code in sheet "Items" row 18.';
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
    // Multiple items with CoO issues and other validation failures
    const failureReasons =
      'Product code is invalid in sheet "PackingList" row 7.\nMissing Country of Origin in sheet "PackingList" row 11.\nNo of packages is missing in sheet "PackingList" row 19.';
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
    // Mixed packing list: raw potatoes (prohibited), missing CoO, and other failures
    const failureReasons =
      'NIRMS/Non-NIRMS goods not specified in sheet "Export" row 4.\nMissing Country of Origin in sheet "Export" row 9.\nProhibited item identified on the packing list in sheet "Export" row 12.\nTotal net weight is missing in sheet "Export" row 16.';
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
    expect(result.body.failureReasons).toContain("NIRMS/Non-NIRMS");
  });

  test("should prioritize rejected_coo over rejected_other when both present without ineligible items (AC5)", () => {
    // Dairy products with invalid CoO codes and missing package counts
    const failureReasons =
      'Product description is missing in sheet "Goods" row 5.\nInvalid Country of Origin ISO Code in sheet "Goods" row 8.\nNo of packages is missing in sheet "Goods" row 13.';
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
    expect(result.body.failureReasons).toContain("Product description");
    expect(result.body.failureReasons).toContain("No of packages");
  });

  test("should prioritize rejected_ineligible over rejected_coo when both prohibited items and COO failures present (AC5.1)", () => {
    // Fresh leeks (07039000) with wrong CoO format
    const failureReasons =
      'Prohibited item identified on the packing list in sheet "Shipment" row 6.\nInvalid Country of Origin ISO Code in sheet "Shipment" row 11.';
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
    // Spring onions (prohibited) with multiple RMS numbers found
    const failureReasons =
      'Prohibited item identified on the packing list in sheet "Inventory" row 9.\nMultiple GB Place of Dispatch (Establishment) numbers found on packing list.';
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
      "Multiple GB Place of Dispatch",
    );
  });

  test("should prioritize rejected_coo over rejected_other when both COO and other failures present (AC5.3)", () => {
    // Beverages with CoO issues and missing RMS
    const failureReasons =
      'Invalid Country of Origin ISO Code in sheet "Products" row 14.\nCheck GB Establishment RMS Number.';
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
    // Empty packing list with RMS validation failure
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
