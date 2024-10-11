const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/iceland/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/iceland/model1");
const config = require("../../../../../app/config");

const filename = "iceland-model1.pdf";

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

createDocumentIntelligenceClient.mockImplementation(() => {
  return jest.fn();
});

describe("findParser", () => {
  test("matches valid Iceland Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.validModel;
    });

    const result = await parserService.findParser("", filename);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("matches valid Iceland Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    runAnalysis.mockImplementationOnce(() => {
      return model.invalidModel_MissingColumnCells;
    });

    const result = await parserService.findParser("", filename);

    expect(result).toEqual(test_results.invalidTestResult_MissingCells);
  });

  test("wrong file extension", async () => {
    const filename = "packinglist.xls";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parser_model.NOMATCH,
    };
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
