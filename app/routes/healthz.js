const { StatusCodes } = require("http-status-codes");

module.exports = {
  method: "GET",
  path: "/healthz",
  options: {
    handler: (_request, h) => {
      return h.response("ok").code(StatusCodes.OK);
    },
  },
};
