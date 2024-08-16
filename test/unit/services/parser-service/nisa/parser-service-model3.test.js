const parserService = require("../../../../../app/services/parser-service");
const ParserModel = require("../../../../../app/services/parser-model");

const packingListJson = {
  sheet: [
    {
      A: "RMS_ESTABLISHMENT_NO",
    },
    {
      A: "RMS-GB-000025-003",
    },
    {
      C: "PRODUCT TYPE CATEGORY",
      E: "PART NUMBER DESCRIPTION",
      F: "TARIFF CODE EU",
      G: "PACKAGES",
      I: "NET WEIGHT TOTAL",
    },
    {
      C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
      E: "DAIRYLEA DUNKERS JUMBO PM80P",
      F: "2005995090",
      G: 2,
      I: 2.5,
    },
    {
      C: "900 - VEGETABLES PREPACK-C",
      E: "CO OP BROCCOLI",
      F: "0403209300",
      G: 1,
      I: 2,
    },
  ],
};
const filename = "packinglist-nisa3.xlsx";

describe("matchesNisaModel3", () => {
  test("matches valid Nisa Model 3 file and calls parser", () => {
    const result = parserService.findParser(packingListJson, filename);

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
      registration_approval_number: "RMS-GB-000025-003",
      parserModel: ParserModel.NISA3,
    });
  });
});
