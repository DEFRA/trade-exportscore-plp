const createMessage = require("../../../app/messaging/create-message");

describe("createMessage", () => {
  test("should create a message", () => {
    const testObject = {
      applicationId: "claim123",
      approvalStatus: "approved",
    };
    expect(createMessage(true, "claim123")).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });
});
