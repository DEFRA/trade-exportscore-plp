const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/nisa/model2/matcher");
const Parser = require("../../../../../app/services/parsers/nisa/model2/parser");

const packingListJson = [
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
];
const filename = "packinglist-nisa2.xlsx";

// ToDo - fix this!!!
describe("matchesNisaModel2", () => {
  test.skip("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});
