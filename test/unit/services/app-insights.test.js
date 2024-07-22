const appInsights = require("applicationinsights");
jest.mock("applicationinsights", () => ({
  setup: jest.fn().mockReturnThis(),
  setAutoCollectConsole: jest.fn().mockReturnThis(),
  setDistributedTracingMode: jest.fn().mockReturnThis(),
  start: jest.fn().mockReturnThis(),
  DistributedTracingModes: {
    AI_AND_W3C: "AI_AND_W3C",
  },
  defaultClient: {
    context: {
      keys: {
        cloudRole: "cloudRole",
      },
      tags: {},
    },
  },
}));

describe("App Insights setup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call appInsights.setup when APPINSIGHTS_CONNECTIONSTRING is set", () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = "test-string";
    require("../../../app/services/app-insights").setup();
    expect(appInsights.setup).toHaveBeenCalled();
  });

  test("should not call appInsights.setup when APPINSIGHTS_CONNECTIONSTRING is not set", () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING;
    require("../../../app/services/app-insights").setup();
    expect(appInsights.setup).not.toHaveBeenCalled();
  });
});
