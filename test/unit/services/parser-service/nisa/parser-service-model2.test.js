const MatchedModel = require("../../../../../app/services/matched-model");
const ParserService = require("../../../../../app/services/parser-service");

const packingListJson = {
  sheet: [
    {
      B: "RMS_ESTABLISHMENT_NO",
      J: "PRODUCT_TYPE_CATEGORY",
      L: "PART_NUMBER_DESCRIPTION",
      M: "TARIFF_CODE_EU",
      N: "PACKAGES",
      P: "NET_WEIGHT_TOTAL",
    },
    {
      B: "RMS-GB-000025-001",
      J: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
      L: "DAIRYLEA DUNKERS JUMBO PM80P",
      M: "2005995090",
      N: 2,
      P: 2.5,
    },
    {
      B: "RMS-GB-000025-001",
      J: "900 - VEGETABLES PREPACK-C",
      L: "CO OP BROCCOLI",
      M: "0403209300",
      N: 1,
      P: 2,
    },
  ],
};
const filename = "packinglist-nisa2.xlsx";

describe("matchesNisaModel2", () => {
  test("matches valid Nisa Model 2 file and calls parser", () => {
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
      parserModel: MatchedModel.NISA2,
    });
  });
});
