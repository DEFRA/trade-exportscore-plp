const { isTotalRow } = require("../../../../../app/services/parsers/nisa/utilities");

describe("itilities tests", () => {
    test.each([
        [null, null, 1, 1, true],
        [null, null, 1, null, false],
        [null, null, null, 1, false],
        [null, null, null, null, false],
        ["null", null, 1, 1, false],
        [null, "null", 1, 1, false],
        ["null", "null", 1, 1, false],
    ])("isTotalRow", (description, commodity_code, total_net_weight_kg, number_of_packages, expected) => {
        const input = {
            description,
            commodity_code,
            nature_of_products: null,
            type_of_treatment: null,
            total_net_weight_kg,
            number_of_packages,
        };

        const actual = isTotalRow(input);
        expect(actual).toBe(expected);
    }
    );
})