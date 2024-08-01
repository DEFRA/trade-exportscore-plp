const parserCombine = require("../../../app/services/parser-combine");

describe("combineParser", () => {
  test("parses json", () => {
    const registrationApprovalNumber = "test";
    const items = [
      {
        description: "test desc",
        nature_of_products: "products",
        type_of_treatment: "teatment",
        commodity_code: 123,
        number_of_packages: 1,
        total_net_weight_kg: 1.2,
      },
    ];
    const packingListJson = {
      registration_approval_number: registrationApprovalNumber,
      items,
      business_checks: {
        all_required_fields_present: true,
      },
    };
    const result = parserCombine.combine(
      registrationApprovalNumber,
      items,
      true,
    );
    expect(result).toMatchObject(packingListJson);
  });
});
