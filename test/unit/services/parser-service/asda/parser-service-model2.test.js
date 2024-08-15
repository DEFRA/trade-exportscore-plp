const ParserService = require("../../../../../app/services/parser-service");

describe("matchesAsdaModel2", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Asda Model 2 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [
          {
            "commodity_code": null,
            "description": "4PK X 17 PINK LADY APPLES",
            "nature_of_products": "TOP FRUIT",
            "number_of_packages": 20,
            "total_net_weight_kg": 255,
            "type_of_treatment": "PRODUCE"
          }, {
            "commodity_code": null,
            "description": "ASDA BABY WATERMELON X10",
            "nature_of_products": "MELON HARD",
            "number_of_packages": 5,
            "total_net_weight_kg": 60,
            "type_of_treatment": "PRODUCE",
          },
        ],
        registration_approval_number: "RMS-GB-000015-010",
      },
    });
  });

  test("matches valid Asda Model 2 file and calls parser but all_required_fields_present is false when column empty", () => {
    const result = ParserService.findParser(packingListJsonMissingCell, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: false,
        },
        items: [
          {
            "commodity_code": null,
            "description": "4PK X 17 PINK LADY APPLES",
            "nature_of_products": "TOP FRUIT",
            "number_of_packages": 20,
            "total_net_weight_kg": 255,
            "type_of_treatment": "PRODUCE"
          }, {
            "commodity_code": null,
            "description": "ASDA BABY WATERMELON X10",
            "nature_of_products": "MELON HARD",
            "number_of_packages": 5,
            "total_net_weight_kg": 60,
            "type_of_treatment": null,
          },
        ],
        registration_approval_number: "RMS-GB-000015-010",
      },
    });
  });
});

const filename = "packinglist.xls";
const packingListJson = {
  Sheet1: [
    {
      B: "[Description Of All Retail Go",
      D: "[Nature Of Product]",
      F: "[Treatment Ty",
      H: "Establishment Number",
      J: "Cases",
      L: "Case Weight",
      N: "NET Weight",
    },
    {
      B: "4PK X 17 PINK LADY APPLES",
      D: "TOP FRUIT",
      F: "PRODUCE",
      H: "RMS-GB-000015-010",
      J: 20,
      L: 12.75,
      N: 255,
    },
    {
      B: "ASDA BABY WATERMELON X10",
      D: "MELON HARD",
      F: "PRODUCE",
      H: "RMS-GB-000015-010",
      J: 5,
      L: 12,
      N: 60,
    },
  ],
};

const packingListJsonMissingCell = {
  Sheet1: [
    {
      B: "[Description Of All Retail Go",
      D: "[Nature Of Product]",
      F: "[Treatment Ty",
      H: "Establishment Number",
      J: "Cases",
      L: "Case Weight",
      N: "NET Weight",
    },
    {
      B: "4PK X 17 PINK LADY APPLES",
      D: "TOP FRUIT",
      F: "PRODUCE",
      H: "RMS-GB-000015-010",
      J: 20,
      L: 12.75,
      N: 255,
    },
    {
      B: "ASDA BABY WATERMELON X10",
      D: "MELON HARD",
      F: null,
      H: "RMS-GB-000015-010",
      J: 5,
      L: 12,
      N: 60,
    },
  ],
};
