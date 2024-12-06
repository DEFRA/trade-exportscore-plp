const packingListValidator = require("../../../../app/services/parsers/packing-list-validator");

describe("validatePackingList", () => {
    test("valid data", () => {
        const packingList = {
            registration_approval_number: "RMS/2024/12345",
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeTruthy();
    });

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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
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

        const result = packingListValidator.validatePackingList(packingList);

        expect(result.hasAllFields).toBeFalsy();
    });
});

describe("cleansePackingList", () => {
    test("Number of pkgs and total net weight are both NaN", () => {
        const packingList = {
            registration_approval_number: "RMS-GB-000022-999",
            items: [
                {
                    description: 1234,
                    nature_of_products: null,
                    type_of_treatment: "Type C",
                    commodity_code: "Text",
                    number_of_packages: "Text",
                    total_net_weight_kg: "Text",
                },
            ],
            business_checks: {
                all_required_fields_present: false,
            },
        };

        const result = packingListValidator.cleansePackingList(packingList);

        expect(result.items[0].number_of_packages).toBeNull();
        expect(result.items[0].total_net_weight_kg).toBeNull();
    });

    test("Number of pkgs and total net weight are both numbers", () => {
        const packingList = {
            registration_approval_number: "RMS-GB-000022-998",
            items: [
                {
                    description: "CONTIGO AUTO-POP BOTTLE 720ML",
                    nature_of_products: null,
                    type_of_treatment: "Ambient",
                    commodity_code: "9617000000",
                    number_of_packages: 1,
                    total_net_weight_kg: 1.4155,
                },
            ],
            business_checks: {
                all_required_fields_present: true,
            },
        };

        const result = packingListValidator.cleansePackingList(packingList);

        expect(result.items[0].number_of_packages).toBe(1);
        expect(result.items[0].total_net_weight_kg).toBe(1.4155);
    });

    test("return true for length greater than 0", () => {
        const packingList = {
            registration_approval_number: "RMS-GB-000022-999",
            items: [
                {
                    description: 1234,
                    nature_of_products: null,
                    type_of_treatment: "Type C",
                    commodity_code: "Text",
                    number_of_packages: "Text",
                    total_net_weight_kg: "Text",
                },
            ],
            business_checks: {
                all_required_fields_present: false,
            },
        };

        const result = packingListValidator.cleansePackingList(packingList);

        expect(result.items.length).toBe(1);
    });

    test("return false for length equals 0", () => {
        const packingList = {
            registration_approval_number: "RMS-GB-000022-999",
            items: [],
            business_checks: {
                all_required_fields_present: false,
            },
        };

        const result = packingListValidator.cleansePackingList(packingList);

        expect(result.items.length).toBe(0);
    });
});