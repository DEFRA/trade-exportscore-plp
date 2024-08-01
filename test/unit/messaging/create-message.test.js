const createMessage = require("../../../app/messaging/create-message");

describe("createMessage", () => {
  test("should create a message", () => {
    const testObject = { claimId: "claim123" };
    expect(createMessage(testObject)).toMatchObject({
      body: testObject,
      type: "uk.gov.trade.plp",
      source: "trade-exportscore-plp",
    });
  });
});
