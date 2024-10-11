const fs = require("fs");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config");
const dbConfig = config.dbConfig[config.env];
const modelPath = path.join(__dirname, "..", "models");
const logger = require("../utilities/logger");

function associateModels(sequelize) {
  for (const model of Object.values(sequelize.models)) {
    if (model.associate) {
      model.associate(sequelize.models);
    }
  }
}

module.exports = (() => {
  try {
    const sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      dbConfig,
    );

    fs.readdirSync(modelPath)
      .filter((file) => {
        return (
          !file.startsWith(".") && file !== "index.js" && file.endsWith(".js")
        );
      })
      .forEach((file) =>
        require(path.join(modelPath, file))(sequelize, DataTypes),
      );

    if (sequelize.models) {
      associateModels(sequelize);
    }

    return {
      models: sequelize.models,
      sequelize,
    };
  } catch (err) {
    logger.logError(filenameForLogging, "module.exports()", err);
  }
})();
