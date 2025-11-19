describe("mdm-config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should load MDM API URL from environment variable", () => {
    process.env.MDM_API_URL = "https://test-mdm.example.com";
    process.env.MDM_SUBSCRIPTION_KEY = "test-key-123";

    const mdmConfig = require("../../../app/config/mdm-config");

    expect(mdmConfig.apiUrl).toBe("https://test-mdm.example.com");
  });

  it("should load MDM subscription key from environment variable", () => {
    process.env.MDM_API_URL = "https://test-mdm.example.com";
    process.env.MDM_SUBSCRIPTION_KEY = "test-subscription-key";

    const mdmConfig = require("../../../app/config/mdm-config");

    expect(mdmConfig.subscriptionKey).toBe("test-subscription-key");
  });

  it("should handle missing environment variables", () => {
    delete process.env.MDM_API_URL;
    delete process.env.MDM_SUBSCRIPTION_KEY;

    const mdmConfig = require("../../../app/config/mdm-config");

    expect(mdmConfig.apiUrl).toBeUndefined();
    expect(mdmConfig.subscriptionKey).toBeUndefined();
  });
});
