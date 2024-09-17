const ParserModel = require("../../../app/services/parser-model");
const parserService = require("../../../app/services/parser-service");

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

    const result = parserService.checkRequiredData(packingList);

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

    const result = parserService.checkRequiredData(packingList);

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

    const result = parserService.checkRequiredData(packingList);

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

    const result = parserService.checkRequiredData(packingList);

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

    const result = parserService.checkRequiredData(packingList);

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

    const result = parserService.checkRequiredData(packingList);

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

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });
});
