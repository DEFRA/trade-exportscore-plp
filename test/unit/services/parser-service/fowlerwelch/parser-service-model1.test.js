const parserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xlsx";
const packingListJson = {
  "Customer Order": [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {
      A: "Item",
      B: "Product code",
      C: "Commodity code",
      D: "Online Check",
      E: "Meursing code",
      F: "Description of goods",
      G: "Country of Origin",
      H: "No. of pkgs \r\n(1547)",
      I: "Type of pkgs",
      J: "Total Gross Weight \r\n(11015.700kgs)",
      K: "Total Net Weight \r\n(7921.700kgs)",
      L: "Total Line Value \r\n(41662.4)",
      M: "NIIRMS Dispatch number",
      N: "Treatment Type (Chilled /Ambient)",
      O: "NIRMS Lane (R/G)",
      P: "Secondary Qty",
      Q: "Cert Type Req",
      R: "Cert Number",
    },
    {
      M: "RMS-GB-000216-004",
    },
  ],
};

describe("matchesFowlerWelchModel1", () => {
  test("returns isParsed as true", () => {
    const result = parserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid FowlerWelch Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [],
        registration_approval_number: "RMS-GB-000216-004",
      },
    });
  });
});
