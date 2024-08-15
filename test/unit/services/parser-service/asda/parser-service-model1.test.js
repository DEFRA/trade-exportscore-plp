const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xls";
const model = require("../../../test-helpers/asda/model1/data-model");

describe("matchesAsdaModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(model.validModel, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Asda Model 1 file and calls parser", () => {
    const result = ParserService.findParser(model.validModel, filename);

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
        registration_approval_number: "RMS-GB-000015-006",
      },
    });
  });

  test("matches valid Asda Model 1 file and calls parser but all_required_fields_present is false when column empty", () => {
    const result = ParserService.findParser(
      model.invalidModel_MissingColumnCells,
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
