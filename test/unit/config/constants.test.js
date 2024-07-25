const constants = require("../../../app/config/constants");

describe("constants config", () => {
  test("should return the correct environment", () => {
    expect(constants.environments).toMatchObject({
      development: "development",
      production: "production",
      test: "test",
    });
  });
});
