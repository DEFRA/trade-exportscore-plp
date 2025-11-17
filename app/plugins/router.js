const routes = [].concat(
  require("../routes/non-ai"),
  require("../routes/healthy"),
  require("../routes/healthz"),
  require("../routes/upsert-idcoms"),
  require("../routes/ai"),
  require("../routes/test-di-conn"),
  require("../routes/create-packinglist-message"),
  require("../routes/pdf-non-ai"),
  require("../routes/pdf-non-ai-spike"),
  require("../routes/get-dispatch-location"),
  require("../routes/csv-non-ai"),
);

module.exports = {
  plugin: {
    name: "router",
    register: (server, _options) => {
      server.route(routes);
    },
  },
};
