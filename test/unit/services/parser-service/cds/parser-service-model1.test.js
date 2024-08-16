const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xlsx";
const packingListJson = {
  PackingList_Extract: [
    {
      A: "TruckID",
      B: "Dept",
      C: "SubDept",
      D: "Product",
      E: "# Packages",
      F: "# Units",
      G: "GrossWeight",
      H: "NetWeight",
      I: "NatureOfProduct",
      J: "Treatment",
      K: "PlaceOfDispatch",
    },
    {
      K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
    },
  ],
};

describe("matchesCdsModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid CDS Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [],
        registration_approval_number: "RMS-GB-000252-002",
      },
    });
  });
});
