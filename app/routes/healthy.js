const { sequelize } = require("../services/database-service");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  method: "GET",
  path: "/healthy",
  options: {
    handler: async (_request, h) => {
      try {
        await sequelize.authenticate();
        return h.response("ok").code(StatusCodes.OK);
      } catch (err) {
        console.error("Error running healthy check", err);
        return h
          .response(`Error running healthy check: ${err.message}`)
          .code(StatusCodes.SERVICE_UNAVAILABLE);
      }
    },
  },
};
