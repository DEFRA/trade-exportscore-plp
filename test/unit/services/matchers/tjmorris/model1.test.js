const Matcher = require("../../../../../app/services/matchers/tjmorris/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");

describe("matchesTjmorris", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          A: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xls";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Seal",
          E: "Store",
          F: "STORENAME",
          G: "Order",
          H: "Cage/Ref",
          I: "Group",
          J: "TREATMENTTYPE",
          K: "Sub-Group",
          L: "Description",
          M: "Item",
          N: "Description",
          O: "Incorrect",
          P: "Cases",
          Q: "Gross Weight Kg",
          R: "Net Weight Kg",
          S: "Cost",
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns wrong header for invalid header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns Correct", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
          C: "Trailer",
          D: "Seal",
          E: "Store",
          F: "STORENAME",
          G: "Order",
          H: "Cage/Ref",
          I: "Group",
          J: "TREATMENTTYPE",
          K: "Sub-Group",
          L: "Description",
          M: "Item",
          N: "Description",
          O: "Tariff/Commodity",
          P: "Cases",
          Q: "Gross Weight Kg",
          R: "Net Weight Kg",
          S: "Cost",
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });
});
