const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xlsx";
const packingListJson = {
  Sheet1: [
    {
      A: "Delivery Date",
      B: "Load Ref\r\n(Trailer Number)",
      C: "Product Type / Category",
      D: "Product / Part Number",
      E: "Product / Part Number Description",
      F: "Packed Singles",
      G: "Packages",
      H: "Net\r\nWeight / Package KG",
      I: "Gross\r\nWeight / Package KG",
      J: "Packaging Type",
      K: "Excise Code",
      L: "Final Destination ID",
      M: "Dispatch Unit ID",
      N: "RMS Number (based on depot)",
      O: "Commodity Code",
    },
    {
      N: "RMS-GB-000094-001",
    },
  ],
};

describe("matchesSainsburysModel1", () => {
  test("matches valid Sainsburys Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000094-001",
      parserModel: ParserModel.SAINSBURYS1,
    });
  });
});
