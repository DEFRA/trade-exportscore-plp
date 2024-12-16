const createMessage = require("../../../app/messaging/create-message");

describe("createMessage", () => {
  test("should create a message", () => {
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

  test("should create a failure message", () => {
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "rejected",
      failureReasons:"failure",
    };

    const result = createMessage(false, "claim123", "failure");

    expect(result).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });
});
