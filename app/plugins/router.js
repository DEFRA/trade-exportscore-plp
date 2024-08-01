const routes = [].concat(
  require("../routes/non-ai"),
  require("../routes/healthy"),
  require("../routes/healthz"),
  require("../routes/upsert-idcoms"),
);

module.exports = {
  plugin: {
    name: "router",
    register: (server, _options) => {
      server.route(routes);
    },
  },
};
