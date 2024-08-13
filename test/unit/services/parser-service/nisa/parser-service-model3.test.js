const ParserService = require("../../../../../app/services/parser-service");

const packingListJson = {
  sheet: [
    {
      A: "RMS_ESTABLISHMENT_NO",
    },
    {
      A: "RMS-GB-000025-003",
    },
    {},
    {
      C: "PRODUCT_TYPE_CATEGORY",
      E: "PART_NUMBER_DESCRIPTION",
      F: "TARIFF_CODE_EU",
      G: "PACKAGES",
      H: "NET_WEIGHT_TOTAL",
    },
    {
      C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
      E: "DAIRYLEA DUNKERS JUMBO PM80P",
      F: "2005995090",
      G: 2,
      H: 2.5,
    },
    {
      C: "900 - VEGETABLES PREPACK-C",
      E: "CO OP BROCCOLI",
      F: "0403209300",
      G: 1,
      H: 2,
    },
  ],
};
const filename = "packinglist-nisa3.xlsx";

describe("matchesNisaModel3", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Nisa Model 3 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [
          {
            commodity_code: "2005995090",
            description: "DAIRYLEA DUNKERS JUMBO PM80P",
            nature_of_products: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
            number_of_packages: 2,
            total_net_weight_kg: 2.5,
            type_of_treatment: null,
          },
          {
            commodity_code: "0403209300",
            description: "CO OP BROCCOLI",
            nature_of_products: "900 - VEGETABLES PREPACK-C",
            number_of_packages: 1,
            total_net_weight_kg: 2,
            type_of_treatment: null,
          },
        ],
        registration_approval_number: "RMS-GB-000025-003",
      },
    });
  });
});
