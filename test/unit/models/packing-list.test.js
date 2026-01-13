const sequelize = {
  define: jest.fn(() => ({
    associate: jest.fn(),
  })),
};
const DataTypes = {
  STRING: "string",
  BOOLEAN: "boolean",
  INTEGER: "integer",
  BIGINT: "bigint",
};

describe("Packing list Model", () => {
  let PackingList;
  beforeEach(() => {
    jest.clearAllMocks();
    PackingList = require("../../../app/models/packing-list")(
      sequelize,
      DataTypes,
    );
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await sequelize.close;
  });

  test("should define the model with correct fields", () => {
    expect(sequelize.define).toHaveBeenCalled();
    expect(PackingList.associate).toBeDefined();
  });

  test("should define approvalStatus field", () => {
    const defineCall = sequelize.define.mock.calls[0];
    const modelDefinition = defineCall[1]; // Second argument is the fields object

    expect(modelDefinition.approvalStatus).toBe(DataTypes.STRING);
  });

  test("should include beforeCreate and beforeUpdate hooks", () => {
    const defineCall = sequelize.define.mock.calls[0];
    const options = defineCall[2]; // Third argument is the options object

    expect(options.hooks).toBeDefined();
    expect(options.hooks.beforeCreate).toBeDefined();
    expect(options.hooks.beforeUpdate).toBeDefined();
    expect(typeof options.hooks.beforeCreate).toBe("function");
    expect(typeof options.hooks.beforeUpdate).toBe("function");
  });
});
