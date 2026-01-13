const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/mands/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/mands/model1");
const failureReasonsDescriptions = require("../../../../../app/services/validators/packing-list-failure-reasons");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");

const filename = "mands-model1.pdf";

jest.mock("../../../../../app/utilities/pdf-helper", () => {
  const actual = jest.requireActual("../../../../../app/utilities/pdf-helper");
  return {
    ...actual,
    extractPdf: jest.fn(),
  };
});

jest.mock("../../../../../app/utilities/pdf-helper");
jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "INELIGIBLE_ITEM_ISO",
]);
jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "INELIGIBLE_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "INELIGIBLE_ITEM_TREATMENT",
  },
]);

describe("findParser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    extractPdf.mockImplementation(() => {
      return model.validModel;
    });

    const result = await parserService.findParser({}, filename);
    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid MandS Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    extractPdf.mockImplementation(() => {
      return model.invalidModel_MissingColumnCells;
    });

    const result = await parserService.findParser({}, filename);

    expect(result).toMatchObject(test_results.invalidTestResult_MissingCells);
  });

  test("wrong file extension", async () => {
    const filename = "packinglist.wrong";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: null,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parser_model.NOMATCH,
    };
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });
    const result = await parserService.findParser({}, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });

  test("parses model multiple RMS", async () => {
    extractPdf.mockImplementation(() => {
      return model.multipleRms;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.MULTIPLE_RMS,
    );
  });

  test("parses model missing unit of weight", async () => {
    extractPdf.mockImplementation(() => {
      return model.missingKgunit;
    });

    const result = await parserService.findParser({}, filename);
    expect(result.business_checks.failure_reasons).toBe(
      "Net Weight Unit of Measure (kg) not found.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for invalid NIRMS", async () => {
    extractPdf.mockImplementation(() => {
      return model.invalidNirms;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.NIRMS_INVALID + " in page 1 row 1.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as true for valid NIRMS", async () => {
    extractPdf.mockImplementation(() => {
      return model.nonNirms;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for missing NIRMS", async () => {
    extractPdf.mockImplementation(() => {
      return model.missingNirms;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.NIRMS_MISSING + " in page 1 row 1.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for missing CoO", async () => {
    extractPdf.mockImplementation(() => {
      return model.missingCoO;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.COO_MISSING +
        " in page 1 row 1, page 1 row 2, page 1 row 3 in addition to 2 other locations.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for invalid CoO", async () => {
    extractPdf.mockImplementation(() => {
      return model.invalidCoO;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.COO_INVALID +
        " in page 1 row 1, page 1 row 2, page 1 row 3 in addition to 2 other locations.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as true for X CoO", async () => {
    extractPdf.mockImplementation(() => {
      return model.xCoO;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for ineligible items", async () => {
    extractPdf.mockImplementation(() => {
      return model.ineligibleItems;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.PROHIBITED_ITEM +
        " in page 1 row 1 and page 1 row 3.\n",
    );
  });
});
