const parserService = require("../../../app/services/parser-service");
const MatcherResult = require("../../../app/services/matches-result");
const nisaMatcher = require("../../../app/services/nisa/matcher");
const nisaParser = require("../../../app/services/nisa/parser");

describe("matchesNisa", () => {
  test("returns true", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      Something: [
        {
          A: "RMS_ESTABLISHMENT_NO",
          I: "PRODUCT_TYPE_CATEGORY",
          K: "PART_NUMBER_DESCRIPTION",
          L: "TARIFF_CODE_EU",
          M: "PACKAGES",
          O: "NET_WEIGHT_TOTAL",
        },
        {
          A: "RMS-GB-000025-009",
        },
      ],
    };
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});

describe("findParser", () => {
  nisaMatcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("nisaMatcherMock");
  nisaParser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid Nisa file and calls parser", () => {
    const packingListJson = [
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
    ];
    const filename = "packinglist.xlsx";

    parserService.findParser(packingListJson, filename);
    expect(nisaParser.parse).toHaveBeenCalledTimes(1);
  });
});
