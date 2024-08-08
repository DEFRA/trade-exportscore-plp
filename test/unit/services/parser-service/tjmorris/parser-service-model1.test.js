const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/tjmorris/model1/matcher");
const Parser = require("../../../../../app/services/parsers/tjmorris/model1/parser");

const filename = "packinglist.xls";
const packingListJson = [
  {
    A: "Consignor / Place o f Despatch",
    J: "TREATMENTTYPE",
    L: "SANDWICHES",
    N: "28 TUNA CRUNCH TIGER ROLL",
    O: "Tariff/Commodity",
    P: "Cases",
    R: "Net Weight Kg",
  },
  {
    A: "RMS-GB-000010-001",
    J: "CHILLED",
    L: "Description",
    N: "Description",
    O: "0408192000",
    P: "2",
    R: "1.4",
  },
  {
    A: "RMS-GB-000010-001",
    J: "FRESH PRODUCTS",
    L: "LETTUCE & BAGGED SALADS",
    N: "FLORETTE SWEET & CRUNCHY 250G",
    O: "1602906100",
    P: "4",
    R: "8",
  },
];

describe("matchesTJMorris", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});

describe("parsesTJMorrisModel1", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("TJMorrisMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid TJMorris file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});
