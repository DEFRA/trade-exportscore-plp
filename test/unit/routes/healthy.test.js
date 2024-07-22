const { sequelize } = require("../../../app/services/database-service");
const healthy = require("../../../app/routes/healthy");

jest.mock("../../../app/services/database-service", () => ({
  sequelize: {
    authenticate: jest.fn(),
  },
}));

describe("healthy route", () => {
  afterAll(async () => {
    jest.resetAllMocks();
    await sequelize.close;
  });

  test("should return 200 when sequelize.authenticate is successful", async () => {
    sequelize.authenticate.mockResolvedValue();

    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
    };

    await healthy.options.handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith("ok");
    expect(mockH.code).toHaveBeenCalledWith(200);
  });

  test("should return 503 when sequelize.authenticate throws an error", async () => {
    const error = new Error("test error");
    sequelize.authenticate.mockRejectedValue(error);

    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
    };

    await healthy.options.handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith(
      `Error running healthy check: ${error.message}`,
    );
    expect(mockH.code).toHaveBeenCalledWith(503);
  });
});
