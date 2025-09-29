// Helper to normalise route module exports. A route module can export:
// - an array of route objects
// - a single route object
// - an object with a `route` property (used to export helpers alongside the route)
function normaliseRoutes(mod) {
  if (Array.isArray(mod)) return mod;
  if (mod && mod.route)
    return Array.isArray(mod.route) ? mod.route : [mod.route];
  return [mod];
}

const nonAi = require("../routes/non-ai");
const healthy = require("../routes/healthy");
const healthz = require("../routes/healthz");
const upsertIdcoms = require("../routes/upsert-idcoms");
const ai = require("../routes/ai");
const testDiConn = require("../routes/test-di-conn");
const createPackingList = require("../routes/create-packinglist-message");
const pdfNonAi = require("../routes/pdf-non-ai");
const dispatchLocation = require("../routes/get-dispatch-location");

const routes = [].concat(
  normaliseRoutes(nonAi),
  normaliseRoutes(healthy),
  normaliseRoutes(healthz),
  normaliseRoutes(upsertIdcoms),
  normaliseRoutes(ai),
  normaliseRoutes(testDiConn),
  normaliseRoutes(createPackingList),
  normaliseRoutes(pdfNonAi),
  normaliseRoutes(dispatchLocation),
);

module.exports = {
  plugin: {
    name: "router",
    register: (server, _options) => {
      server.route(routes);
    },
  },
};
