const nonaiRoutes = require("../../../app/routes/non-ai");
const healthyRoutes = require("../../../app/routes/healthy");
const healthzRoutes = require("../../../app/routes/healthz");
const aiRoutes = require("../../../app/routes/ai");
const upsertIdcomsRoutes = require("../../../app/routes/upsert-idcoms");
const testDiConnRoutes = require("../../../app/routes/test-di-conn");
const pdfNonAiRoutes = require("../../../app/routes/pdf-non-ai");
const createPackingList = require("../../../app/routes/create-packinglist-message");
const router = require("../../../app/plugins/router");

jest.mock("../../../app/routes/non-ai", () => [{ path: "/non-ai" }]);
jest.mock("../../../app/routes/healthy", () => [{ path: "/healthy" }]);
jest.mock("../../../app/routes/healthz", () => [{ path: "/healthz" }]);
jest.mock("../../../app/routes/ai", () => [{ path: "/ai" }]);
jest.mock("../../../app/routes/test-di-conn", () => [
  { path: "/test-di-conn" },
]);
jest.mock("../../../app/routes/upsert-idcoms", () => [
  { path: "/upsert-idcoms" },
]);
jest.mock("../../../app/routes/create-packinglist-message", () => [
  { path: "/create-packinglist-message" },
]);
jest.mock("../../../app/routes/pdf-non-ai", () => [{ path: "/pdf-non-ai" }]);

describe("router plugin", () => {
  test("should register routes when register is called", () => {
    const mockServer = {
      route: jest.fn(),
    };

    router.plugin.register(mockServer);

    expect(mockServer.route).toHaveBeenCalledWith(
      [].concat(
        nonaiRoutes,
        healthyRoutes,
        healthzRoutes,
        upsertIdcomsRoutes,
        aiRoutes,
        testDiConnRoutes,
        createPackingList,
        pdfNonAiRoutes,
      ),
    );
  });
});
