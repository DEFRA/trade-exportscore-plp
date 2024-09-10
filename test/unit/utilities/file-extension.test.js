const FileExtension = require("../../../app/utilities/file-extension");
const MatcherResult = require("../../../app/services/matcher-result");

describe("file-extension-check", () => {
  test.each([
    ["test-file.xls", "xls", MatcherResult.CORRECT],
    ["test-file.xlsX", "xlsx", MatcherResult.CORRECT],
    ["test-file.xlsX", "xLsx", MatcherResult.CORRECT],
    ["test-file.Xls", "xls", MatcherResult.CORRECT],
    ["test-file.csv", "csv", MatcherResult.CORRECT],
    ["test-file.Csv", "csv", MatcherResult.CORRECT],
    ["test-file.CsV", "cSV", MatcherResult.CORRECT],
    ["car", "xls", MatcherResult.WRONG_EXTENSION],
    ["car.abc", "xls", MatcherResult.WRONG_EXTENSION],
  ])(
    "matches: when the input is '%s' and the extension is '%s', the result should be '%s'",
    (filename, extension, expected) => {
      expect(FileExtension.matches(filename, extension)).toBe(expected);
    },
  );
  test.each([
    ["test-file.xls", true],
    ["test-file.xlsx", true],
    ["test-file.csv", false],
    ["test-file.pdf", false],
    ["test-file.abc", false],
    ["test-file", false],
  ])(
    "isExcel: when the input is '%s', the result should be '%s'",
    (filename, expected) => {
      expect(FileExtension.isExcel(filename)).toBe(expected);
    },
  );
});
