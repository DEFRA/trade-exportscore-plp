# Regression Test Suite

This directory contains regression tests for the Packing List Parser (PLP) service.

## Quick Reference

```bash
# Run all tests
npm run test:regression

# Run with filter (using -- to pass arguments)
npm run test:regression -- --testFilter=Coopparser
npm run test:regression -- --testFilter=ASDA
npm run test:regression -- --testFilter=_Pass
```

## Running Tests

### Run All Regression Tests

```bash
npm run test:regression
```

### Run Filtered Tests

You can pass a filter argument to npm scripts using `--` followed by `--testFilter=pattern`:

```bash
# Run only Co-op parser tests
npm run test:regression -- --testFilter=Coopparser

# Run only ASDA tests
npm run test:regression -- --testFilter=ASDA

# Run only TESCO tests
npm run test:regression -- --testFilter=TESCO

# Run only SingleRMS tests
npm run test:regression -- --testFilter=SingleRMS

# Run only files that should pass
npm run test:regression -- --testFilter=_Pass

# Run only files that should fail
npm run test:regression -- --testFilter=_Fail

# Run only files that should be unparsed
npm run test:regression -- --testFilter=_Unparse
```

### More Filter Examples

The filter is **case-insensitive** and matches any part of the filename path:

```bash
# Filter by specific folder
npm run test:regression -- --testFilter=Basic_

# Filter by a specific file pattern
npm run test:regression -- --testFilter=Happypath

# Filter by parser variant (e.g., ASDA1, ASDA2)
npm run test:regression -- --testFilter=ASDA1
```

### Custom Test Folder

You can specify a custom folder containing test files using the `TEST_FOLDER_PATH` environment variable:

```bash
RUN_QA_REGRESSION=1 TEST_FOLDER_PATH="/path/to/custom/test/files" npx jest --runTestsByPath test/regression/process-non-ai.test.js --runInBand
```

### Combine Custom Folder with Filter

```bash
RUN_QA_REGRESSION=1 TEST_FOLDER_PATH="/path/to/custom/test/files" npx jest --runTestsByPath test/regression/process-non-ai.test.js --runInBand -- --testFilter=Coopparser
```

## Expected Outcomes JSON

The `Expected_Outcomes.json` file contains the expected results for each test file:

```json
{
  "expected_results": [
    {
      "filename": "Basic_Coopparser/Happypath_Pass.xlsx",
      "expected_outcome": "Pass",
      "failure_reason": ""
    },
    {
      "filename": "Basic_Coopparser/Missing_MandatoryData_Fail.xlsx",
      "expected_outcome": "Fail",
      "failure_reason": "Product description is missing in sheet \"Sheet1\" row 10."
    }
  ]
}
```

### Fields

- **filename**: Relative path from the base packing-lists directory
- **expected_outcome**: `"Pass"`, `"Fail"`, or `"Unparse"`
- **failure_reason**: Expected error message (for Fail outcomes)

### Important: File Path Matching

⚠️ **The folder structure and filenames in the `app/packing-lists/` directory must exactly match the `filename` values in the JSON.**

For example:
- If the JSON has `"filename": "Basic_Coopparser/Happypath_Pass.xlsx"`
- The actual file must be located at: `app/packing-lists/Basic_Coopparser/Happypath_Pass.xlsx`

The test uses the relative path from the packing-lists directory to match files with their expected outcomes. Mismatched paths will result in:
- Files being processed but marked as "Unknown" (no expected outcome found)
- Expected outcomes in JSON not being tested (no matching file found)

**Tip**: When adding new test files, always update the `Expected_Outcomes.json` with the correct relative path.

## Test Output

Test results are saved as CSV files in the `test-output/` directory with timestamps:

- `ID`: Sequential test number
- `Folder`: Main folder name
- `SubFolder`: Subfolder name
- `FileName`: File name
- `Expected`: Expected outcome from JSON or filename pattern
- `Actual`: Actual outcome from parser
- `Matching`: Whether Expected = Actual (`Pass`/`Fail`)
- `ExpectedMessage`: Expected failure message (validation mode only)
- `ActualMessage`: Actual failure message
- `MessageMatching`: Whether messages match (`Pass`/`Fail`/`N/A`/`Unknown`)

## Tips

1. **Quick smoke test**: Use `--testFilter=Happypath` to test only happy path scenarios
2. **Parser-specific**: Filter by parser name like `Coopparser`, `ASDA`, `TESCO`, etc.
3. **Outcome-specific**: Filter by `_Pass`, `_Fail`, or `_Unparse` to test specific scenarios
4. **Folder-specific**: Filter by folder names like `Basic_`, `SingleRMS`, etc.
