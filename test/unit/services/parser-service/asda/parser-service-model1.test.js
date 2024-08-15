const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xls";
const packingListJson = {
  PackingList_Extract: [
    {
      A: "[Description Of All Retail Goods]",
      B: "[Nature Of Product]",
      C: "[Treatment Type]",
      D: "[Number Of Establishment]",
      E: "[Destination Store Establishment Number]",
      F: "[Number of Packages]",
      G: "[Net Weight]",
      H: "[kilograms/grams]",
    },
    {
      D: "RMS-GB-000015-001",
    },
    {
      A: "169 STOREY TREEHOUSE",
      B: "BOOKS",
      C: "GM",
      D: "RMS-GB-000015-006",
      E: "RMS-NI-000008-017",
      F: 2,
      G: 0.38,
      H: "kgs",
    },
    {
      A: "19 CRIMES",
      B: "WINES",
      C: "AMBIENT",
      D: "RMS-GB-000015-006",
      E: "RMS-NI-000008-017",
      F: 1,
      G: 0.3457,
      H: "kgs",
    },
  ],
};

describe("matchesAsdaModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Asda Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [
          {
            commodity_code: null,
            description: "169 STOREY TREEHOUSE",
            nature_of_products: "BOOKS",
            number_of_packages: 2,
            total_net_weight_kg: 0.38,
            type_of_treatment: "GM",
          },
          {
            commodity_code: null,
            description: "19 CRIMES",
            nature_of_products: "WINES",
            number_of_packages: 1,
            total_net_weight_kg: 0.3457,
            type_of_treatment: "AMBIENT",
          },
        ],
        registration_approval_number: "RMS-GB-000015-001",
      },
    });
  });

  test("matches valid Asda Model 1 file and calls parser but all_required_fields_present is false when column empty", () => {
    const packingListJson_MissingData = {
      PackingList_Extract: [
        {
          A: "[Description Of All Retail Goods]",
          B: "[Nature Of Product]",
          C: "[Treatment Type]",
          D: "[Number Of Establishment]",
          E: "[Destination Store Establishment Number]",
          F: "[Number of Packages]",
          G: "[Net Weight]",
          H: "[kilograms/grams]",
        },
        {
          D: "RMS-GB-000015-001",
        },
        {
          A: "169 STOREY TREEHOUSE",
          B: null,
          C: "GM",
          D: "RMS-GB-000015-006",
          E: "RMS-NI-000008-017",
          F: 2,
          G: 0.38,
          H: "kgs",
        },
        {
          A: "19 CRIMES",
          B: "WINES",
          C: null,
          D: "RMS-GB-000015-006",
          E: "RMS-NI-000008-017",
          F: 1,
          G: 0.3457,
          H: "kgs",
        },
      ],
    };
    const result = ParserService.findParser(
      packingListJson_MissingData,
      filename,
    );

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: false,
        },
        items: [
          {
            commodity_code: null,
            description: "169 STOREY TREEHOUSE",
            nature_of_products: null,
            number_of_packages: 2,
            total_net_weight_kg: 0.38,
            type_of_treatment: "GM",
          },
          {
            commodity_code: null,
            description: "19 CRIMES",
            nature_of_products: "WINES",
            number_of_packages: 1,
            total_net_weight_kg: 0.3457,
            type_of_treatment: null,
          },
        ],
        registration_approval_number: "RMS-GB-000015-001",
      },
    });
  });
});
