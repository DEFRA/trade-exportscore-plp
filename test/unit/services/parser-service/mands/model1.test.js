require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/mands/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/mands/model1");
const failureReasonsDescriptions = require("../../../../../app/services/validators/packing-list-failure-reasons");

const filename = "mands-model1.pdf";

jest.mock("../../../../../app/services/document-intelligence");
jest.mock("../../../../../app/config", () => {
  return {
    isDiEnabled: true,
    mdmConfig: {
      useLocalData: true,
      maxRetries: 3,
      retryDelayMs: 2000,
    },
  };
});
jest.mock("../../../../../app/utilities/pdf-helper");
jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
]);
jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "PROHIBITED_ITEM_TREATMENT",
  },
]);

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../../app/services/document-intelligence");
const {
  extractPdf,
  extractEstablishmentNumbers,
} = require("../../../../../app/utilities/pdf-helper");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

describe("findParser", () => {
  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.validModel;
    });

    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });
    const result = await parserService.findParser(model.validModel, filename);
    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid MandS Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.invalidModel_MissingColumnCells;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

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
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });

  test("parses model multiple RMS", async () => {
    extractPdf.mockImplementation(() => {
      return {
        pages: [
          {
            content: [
              { str: "RMS-GB-000008-000" },
              { str: "RMS-GB-000008-001" },
            ],
          },
        ],
      };
    });

    extractEstablishmentNumbers.mockImplementation(() => {
      return ["RMS-GB-000008-000", "RMS-GB-000008-001"];
    });

    runAnalysis.mockImplementationOnce(() => {
      return model.validModel;
    });

    const result = await parserService.findParser({}, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.MULTIPLE_RMS,
    );
  });

  test("parses model missing unit of weight", async () => {
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    extractEstablishmentNumbers.mockImplementation(() => {
      return ["RMS-GB-000008-001"];
    });

    runAnalysis.mockImplementationOnce(() => {
      return model.missingKgunit;
    });

    const result = await parserService.findParser({}, filename);
    expect(result.business_checks.failure_reasons).toBe(
      "Net Weight Unit of Measure (kg) not found.\n",
    );
  });
  test("extracts rms number from sentence string", async () => {
    extractPdf.mockImplementation(() => {
      return {
        pages: [
          {
            content: [{ str: "Depot Approval Number: RMS-GB-000008-001" }],
          },
        ],
      };
    });

    extractEstablishmentNumbers.mockImplementation(() => {
      return ["RMS-GB-000008-001"];
    });

    runAnalysis.mockImplementationOnce(() => {
      return model.validModel;
    });

    const result = await parserService.findParser({}, filename);
    expect(result.establishment_numbers).toEqual(["RMS-GB-000008-001"]);
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for invalid NIRMS", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.invalidNirms;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(model.invalidNirms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.NIRMS_INVALID + " in page 1 row 1.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as true for valid NIRMS", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.nonNirms;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(model.nonNirms, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for missing NIRMS", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.missingNirms;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(model.missingNirms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.NIRMS_MISSING + " in page 1 row 1.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for missing CoO", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.missingCoO;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(model.missingCoO, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.COO_MISSING +
        " in page 1 row 1, page 1 row 2, page 1 row 3 in addition to 2 other locations.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for invalid CoO", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.invalidCoO;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(model.invalidCoO, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.COO_INVALID +
        " in page 1 row 1, page 1 row 2, page 1 row 3 in addition to 2 other locations.\n",
    );
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as true for X CoO", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.xCoO;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(model.xCoO, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("matches valid MandS Model 1 file, calls parser and returns all_required_fields_present as false for prohibited items", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.ineligibleItems;
    });
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    const result = await parserService.findParser(
      model.ineligibleItems,
      filename,
    );

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.PROHIBITED_ITEM +
        " in page 1 row 1 and page 1 row 3.\n",
    );
  });
});
