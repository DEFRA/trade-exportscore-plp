require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/booker/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/booker/model1");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");
const failureReasonsDescriptions = require("../../../../../app/services/validators/packing-list-failure-reasons");

jest.mock("../../../../../app/utilities/pdf-helper", () => {
  const actual = jest.requireActual("../../../../../app/utilities/pdf-helper");
  return {
    ...actual,
    extractPdf: jest.fn(),
  };
});

const filename = "test.pdf";

describe("findParser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("matches valid Booker Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    extractPdf.mockImplementation(() => {
      return model.validModel;
    });
    const result = await parserService.findParser({}, filename);
    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Booker Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    extractPdf.mockImplementation(() => {
      return model.invalidModel_MissingColumnCells;
    });
    const result = await parserService.findParser({}, filename);

    expect(result).toMatchObject(test_results.invalidTestResult_MissingCells);
  });

  test("returns 'No Match' for incorrect file extension", async () => {
    const filename = "packinglist.wrong";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: null,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };
    extractPdf.mockImplementation(() => {
      return invalidTestResult_NoMatch;
    });

    const result = await parserService.findParser({}, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });

  test("returns multiple rms failure reason", async () => {
    extractPdf.mockImplementation(() => {
      return model.multipleRms;
    });
    const result = await parserService.findParser({}, filename);
    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.MULTIPLE_RMS,
    );
  });
});
