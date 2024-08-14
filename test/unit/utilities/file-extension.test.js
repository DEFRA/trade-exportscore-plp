const FileExtension = require("../../../app/utilities/file-extension");
const MatcherResult = require("../../../app/services/matches-result");

describe("file-extension-check", () => {
  test.each([
    ["test-file.xls", "xls", MatcherResult.CORRECT],
    ["test-file.xlsX", "xlsx", MatcherResult.CORRECT],
    ["test-file.xlsX", "xLsx", MatcherResult.CORRECT],
    ["test-file.Xls", "xls", MatcherResult.CORRECT],
    ["test-file.csv", "csv", MatcherResult.CORRECT],
    ["test-file.Csv", "csv", MatcherResult.CORRECT],
    ["test-file.CsV", "cSV", MatcherResult.CORRECT],
    ["car", "xls", MatcherResult.WRONG_EXTENSIONS],
    ["car.abc", "xls", MatcherResult.WRONG_EXTENSIONS],
  ])(
    "when the input is '%s' and the extension is '%s', then the numeric result is as expected",
    (filename, extension, expected) => {
      expect(FileExtension.matches(filename, extension)).toBe(expected);
    },
  );
});
