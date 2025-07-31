const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/mands/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/mands/model1");

const filename = "mands-model1.pdf";

jest.mock("../../../../../app/services/document-intelligence");
jest.mock("../../../../../app/config", () => {
  return {
    isDiEnabled: true,
  };
});
jest.mock("../../../../../app/utilities/pdf-helper");

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
      "Multiple GB Place of Dispatch (Establishment) numbers found on packing list.\n",
    );
  });

  test("parses model missing unit of weight", async () => {
    extractPdf.mockImplementation(() => {
      return { pages: [{ content: [{ remos: "RMS-GB-000008-001" }] }] };
    });

    runAnalysis.mockImplementationOnce(() => {
      return model.missingKgunit;
    });

    const result = await parserService.findParser({}, filename);
    expect(result.business_checks.failure_reasons).toBe(
      "Net Weight Unit of Measure (kg) not found.\n",
    );
  });
});
