const mockDatabaseService = {
  models: {
    packingList: {
      create: jest.fn(),
    },
    item: {
      bulkCreate: jest.fn(),
    },
  },
  sequelize: {
    transaction: jest
      .fn()
      .mockImplementation((callback) => Promise.resolve(callback())),
    authenticate: jest
      .fn()
      .mockImplementation((callback) => Promise.resolve(callback())),
  },
};
jest.mock("../../../app/services/database-service", () => mockDatabaseService);

const packingListIndex = require("../../../app/packing-list/index");
const parserModel = require("../../../app/services/parser-model");

describe("Packing list", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test("should create a new packing list if it not exists", async () => {
    const packingListJson = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature_of_products",
          type_of_treatment: "type_of_treatment",
          commodity_code: 123,
          number_of_packages: 1,
          total_net_weight_kg: 0.5,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
      parserModel: parserModel.ASDA1,
    };
    jest.mock("../../../app/packing-list/index", () => ({
      packingListMapper: jest.fn().mockResolvedValue({}),
      createPackingList: jest.fn(),
    }));

    await packingListIndex.createPackingList(packingListJson, "123");

    expect(mockDatabaseService.models.packingList.create).toHaveBeenCalled();
    expect(mockDatabaseService.models.item.bulkCreate).toHaveBeenCalled();
  });

  test("itemsMapper should return correct object", () => {
    const item = {
      description: "description",
      nature_of_products: "nature_of_products",
      type_of_treatment: "type_of_treatment",
      commodity_code: 123,
      number_of_packages: 1,
      total_net_weight_kg: 0.5,
    };

    const result = packingListIndex.itemsMapper(item, "123");
    expect(result.description).toBe(item.description);
    expect(result.natureOfProducts).toBe(item.nature_of_products);
    expect(result.typeOfTreatment).toBe(item.type_of_treatment);
    expect(result.commodityCode).toBe(item.commodity_code);
    expect(result.numberOfPackages).toBe(item.number_of_packages);
    expect(result.totalWeight).toBe(item.total_net_weight_kg);
    expect(result.applicationId).toBe("123");
  });

  test("itemsMapper undefined items", () => {
    const result = packingListIndex.itemsMapper(undefined, "123");

    expect(result).not.toBeDefined();
  });

  test("packingListMapper should map correctly for failure", () => {
    const packingListJson = {
      items: [
        {
          description: "description",
          nature_of_products: "nature_of_products",
          type_of_treatment: "type_of_treatment",
          commodity_code: 123,
          number_of_packages: 1,
          total_net_weight_kg: 0.5,
        },
      ],
      registration_approval_number: "test",
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = packingListIndex.packingListMapper(packingListJson, "123");

    expect(result.applicationId).toBe("123");
    expect(result.registrationApprovalNumber).toBe(
      packingListJson.registration_approval_number,
    );
    expect(result.allRequiredFieldsPresent).toBe(
      packingListJson.business_checks.all_required_fields_present,
    );
    expect(result.item[0].description).toBe(
      packingListJson.items[0].description,
    );
    expect(result.item[0].natureOfProducts).toBe(
      packingListJson.items[0].nature_of_products,
    );
    expect(result.item[0].typeOfTreatment).toBe(
      packingListJson.items[0].type_of_treatment,
    );
    expect(result.item[0].commodityCode).toBe(
      packingListJson.items[0].commodity_code,
    );
    expect(result.item[0].numberOfPackages).toBe(
      packingListJson.items[0].number_of_packages,
    );
    expect(result.item[0].totalWeight).toBe(
      packingListJson.items[0].total_net_weight_kg,
    );
    expect(result.item[0].applicationId).toBe("123");
  });

  test("packingListMapper should map correctly", () => {
    const packingListJson = {
      items: [
        {
          description: null,
          nature_of_products: "nature_of_products",
          type_of_treatment: "type_of_treatment",
          commodity_code: 123,
          number_of_packages: 1,
          total_net_weight_kg: 0.5,
        },
      ],
      registration_approval_number: "test",
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: "Product description is missing in row 3.\n",
      },
    };

    const result = packingListIndex.packingListMapper(packingListJson, "123");

    expect(result.applicationId).toBe("123");
    expect(result.registrationApprovalNumber).toBe(
      packingListJson.registration_approval_number,
    );
    expect(result.allRequiredFieldsPresent).toBe(
      packingListJson.business_checks.all_required_fields_present,
    );
    expect(result.reasonsForFailure).toBe(
      packingListJson.business_checks.failure_reasons,
    );
    expect(result.item[0].description).toBeNull();
    expect(result.item[0].natureOfProducts).toBe(
      packingListJson.items[0].nature_of_products,
    );
    expect(result.item[0].typeOfTreatment).toBe(
      packingListJson.items[0].type_of_treatment,
    );
    expect(result.item[0].commodityCode).toBe(
      packingListJson.items[0].commodity_code,
    );
    expect(result.item[0].numberOfPackages).toBe(
      packingListJson.items[0].number_of_packages,
    );
    expect(result.item[0].totalWeight).toBe(
      packingListJson.items[0].total_net_weight_kg,
    );
    expect(result.item[0].applicationId).toBe("123");
  });

  test("packingListMapper errors ", () => {
    const result = packingListIndex.packingListMapper(null, "123");

    expect(result).not.toBeDefined();
  });
});
