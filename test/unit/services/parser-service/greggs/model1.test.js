const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/greggs/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/greggs/model1");

const filename = "greggs-model1.pdf";

jest.mock("../../../../../app/utilities/pdf-helper");
jest.mock("../../../../../app/services/document-intelligence");
jest.mock("../../../../../app/config", () => {
  return {
    isDiEnabled: true,
  };
});

const {
  createDocumentIntelligenceClient,
  runAnalysis,
} = require("../../../../../app/services/document-intelligence");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

extractPdf.mockImplementation(() => {
  return { pages: [{ content: [{ remos: "RMS-GB-000021-000" }] }] };
});

describe("findParser", () => {
  test("matches valid Greggs Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.validModel;
    });

    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Greggs Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.invalidModel_MissingColumnCells;
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
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });
});
