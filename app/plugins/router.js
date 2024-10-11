const routes = [].concat(
  require("../routes/non-ai"),
  require("../routes/healthy"),
  require("../routes/healthz"),
  require("../routes/upsert-idcoms"),
  require("../routes/ai"),
);

module.exports = {
  plugin: {
    name: "router",
    register: (server, _options) => {
      server.route(routes);
    },
  },
};
