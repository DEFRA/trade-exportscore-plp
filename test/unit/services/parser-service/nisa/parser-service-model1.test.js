const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/nisa/model1/matcher");
const Parser = require("../../../../../app/services/parsers/nisa/model1/parser");

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

describe("matchesNisaModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});

describe("parsesNisaModel1", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("nisaMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid Nisa file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});