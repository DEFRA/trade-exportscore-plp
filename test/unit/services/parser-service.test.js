const MatchedModel = require("../../../app/services/matched-model");
const ParserService = require("../../../app/services/parser-service");

describe("failedParser", () => {
  test("parses json", () => {
    const packingListJson = {
      registration_approval_number: null,
      items: [],
      business_checks: {
        all_required_fields_present: false,
      },
    };

    const result = ParserService.failedParser();

    expect(result).toMatchObject(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toMatchObject([]);
    expect(result.business_checks.all_required_fields_present).toBeFalsy();
    expect(result.parserModel).toBe(MatchedModel.NOMATCH);
  });
});

describe("checkRequiredData", () => {
  test("missing remos number", () => {
    const packingList = {
      registration_approval_number: null,
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "type of treatment",
          commodity_code: "012345",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing commodity code", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing treatment type", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing nature of products", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: null,
          type_of_treatment: "treatment type",
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing description", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: null,
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing packages", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: null,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing net weight", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: null,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = ParserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });
});

describe("findParser", () => {
  test("removes empty items", () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
          C: "Trailer",
          D: "Seal",
          E: "Store",
          F: "STORENAME",
          G: "Order",
          H: "Cage/Ref",
          I: "Group",
          J: "TREATMENTTYPE",
          K: "Sub-Group",
          L: "Description",
          M: "Item",
          N: "Description",
          O: "Tariff/Commodity",
          P: "Cases",
          Q: "Gross Weight Kg",
          R: "Net Weight Kg",
          S: "Cost",
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
          J: "CHILLED",
          L: "Description",
          N: "Description",
          O: "0408192000",
          P: "2",
          R: "1.4",
        },
        {
          A: null,
          J: null,
          L: null,
          N: null,
          O: null,
          P: null,
          R: null,
        },
        {
          A: "RMS-GB-000010-001",
          J: "FRESH PRODUCTS",
          L: "LETTUCE & BAGGED SALADS",
          N: "FLORETTE SWEET & CRUNCHY 250G",
          O: "1602906100",
          P: "4",
          R: "8",
        },
      ],
    };
    const filename = "packinglist.xls";

    const result = ParserService.findParser(packingListJson, filename);
    expect(result.items).toHaveLength(2);
  });
});
