const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const packingListJson = {
  sheet: [
    {
      A: "RMS_ESTABLISHMENT_NO",
      I: "PRODUCT_TYPE_CATEGORY",
      K: "PART_NUMBER_DESCRIPTION",
      L: "TARIFF_CODE_EU",
      M: "PACKAGES",
      O: "NET_WEIGHT_TOTAL",
    },
    {
      A: "RMS-GB-000025-001",
      I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
      K: "DAIRYLEA DUNKERS JUMBO PM80P",
      L: "2005995090",
      M: 2,
      O: 2.5,
    },
    {
      A: "RMS-GB-000025-001",
      I: "900 - VEGETABLES PREPACK-C",
      K: "CO OP BROCCOLI",
      L: "0403209300",
      M: 1,
      O: 2,
    },
  ],
};
const filename = "packinglist-nisa-model-1.xlsx";

describe("findParser", () => {
  test("matches valid Nisa Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
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
      registration_approval_number: "RMS-GB-000025-001",
      parserModel: ParserModel.NISA1,
    });
  });
});
