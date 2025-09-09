---
description: "Generate a suite of test data and Excel/CSV files for various test scenarios based on a provided happy path sample file, using## Cos

- Use `${happyPathFile}` to reference the user's provided sample file path.
- Use `${exporterProperty}` to reference the specific property name in `model-headers.js` to use for column mappings (e.g., 'BOOKER2', 'ASDA1', 'TESCO1').
- Output files should be written to `app/packing-lists/{exporter}/test-scenarios/` relative to `${workspaceFolder}`.
- The `{exporter}` directory name should be determined from the `${exporterProperty}` value.rter mapping logic from model-headers.js."
mode: "agent"
tools: ["mcp_excel_excel_read_sheet", "mcp_excel_excel_write_to_sheet", "mcp_excel_excel_describe_sheets", "list_dir", "file_search"]
---

# Generate Test Data from Sample File

You are a senior QA automation engineer with 8+ years of experience in test data design and Excel automation for Node.js/TypeScript projects. You are proficient in using tools such as `mcp_excel_excel_read_sheet`, `mcp_excel_excel_write_to_sheet`, `mcp_excel_excel_describe_sheets`, `list_dir`, and `file_search` to efficiently generate and manipulate test data.

## Column Classification Rules

### Mandatory vs Optional Columns

When analyzing the exporter configuration in `model-headers.js`, columns are classified as follows:

- **Mandatory Columns**: ALL fields defined within the `regex` property of the exporter configuration
- **Optional Columns**: Fields defined as separate root-level properties (excluding configuration flags)

### Example: BOOKER2 Classification

```javascript
BOOKER2: {
  establishmentNumber: { regex: /RMS-GB-000077-\d{3}/i },
  regex: {
    description: /Description of Goods/i,           // MANDATORY
    commodity_code: /Commodity Code/i,              // MANDATORY  
    number_of_packages: /No\. of Pkgs/i,           // MANDATORY
    total_net_weight_kg: /Net Weight/i,            // MANDATORY
    nature_of_products: /Nature of product/i,      // MANDATORY
    type_of_treatment: /Treatment Type/i,          // MANDATORY
  },
  country_of_origin: /Country of Origin/i,         // OPTIONAL
  nirms: /Lane/i,                                  // OPTIONAL
  validateCountryOfOrigin: true,                   // Configuration flag (ignore)
  findUnitInHeader: true                           // Configuration flag (ignore)
}
```

- **Mandatory**: `description`, `commodity_code`, `number_of_packages`, `total_net_weight_kg`, `nature_of_products`, `type_of_treatment`
- **Optional**: `country_of_origin`, `nirms`

## Task

- Generate a suite of test data and Excel/CSV files for various test scenarios based on a user-provided “happy path” sample file.
- Scenarios must include both valid (happy path) and failure cases, such as missing or incorrect data in columns and column names.
- Use the `model-headers.js` file and the specified exporter property (`${exporterProperty}`) to:
  - Access the exporter configuration at `model-headers.js[${exporterProperty}]`.
  - Determine mandatory columns from the `regex` property for that exporter (ALL fields in the regex object are mandatory).
  - Identify optional columns from other root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` (excluding `validateCountryOfOrigin`, `findUnitInHeader`, and `invalidSheets`).
  - Ignore any sheets listed in the `invalidSheets` property for that exporter.
- Output files must be in `.xls`, `.xlsx`, or `.csv` format, matching the format of the input file.
- All generated files should be written to `app/packing-lists/{exporter}/test-scenarios/` (where `{exporter}` is determined from the `${exporterProperty}` value).
- The original template file should remain in `app/packing-lists/{exporter}/` as the authoritative source.
- Create a `manifest.json` file with structured test scenario definitions and a comprehensive `README.md` for documentation.

## Instructions

1. **File Organization**: The user must provide a valid sample file (happy path) in Excel format. This file will be used as the template for all scenario files and should remain in the main exporter directory as the source.
2. **Template Preservation**: All scenario files must be created by copying the original happy path file to preserve formatting, merged cells, and styles. Never create blank files from scratch.
3. **MCP Excel Tool Limitations**: MCP Excel tools cannot create new Excel files from scratch. Always use PowerShell/CLI to copy the template file to each scenario filename before applying mutations with MCP Excel tools.
4. **Directory Structure**: Create a `test-scenarios/` subdirectory under the exporter folder with organized subfolders by test purpose:
   - `test-scenarios/basic-tests/` - Core functionality tests (happy path, missing columns, data types, etc.)
   - `test-scenarios/single-rms/` - Single RMS establishment number tests (missing, invalid, case variations)
   - `test-scenarios/net-weight/` - Net weight validation tests (unit variations, formatting)
   - `test-scenarios/country-of-origin/` - Country of origin, NIRMS, and prohibited items validation tests (all related to country/origin validation)
   All generated test files go in these organized subdirectories, while the original template remains in the parent directory.
5. **Column Analysis for Merged Cells**: Excel templates often use merged cells and visual formatting that can create confusion about actual data column locations. To identify correct columns:
   - **MANDATORY**: Use `mcp_excel_excel_read_sheet` with `showStyle: true` to analyze the template structure before any mutations
   - **MANDATORY**: Read the header row AND multiple data rows to see where actual data resides (header row position varies by exporter)
   - **MANDATORY**: Identify merged cells by looking for duplicate/identical values in adjacent columns
   - **MANDATORY**: Test one small mutation first to verify correct column targeting before bulk mutations
   - Pay attention to empty cells and merged cell patterns that may shift column positions
   - Verify column mappings by checking both header text and data placement across multiple rows
   - Document actual column letters (A, B, C, etc.) rather than assuming sequential placement
   - **Critical**: For merged fields (like commodity codes), update ALL columns containing the merged data to maintain consistency
   - **Establishment Number Patterns**: RMS establishment numbers can appear in two different patterns depending on the exporter:
     - **Single per sheet** (e.g., Booker2): One establishment number for the entire sheet, typically in a header area or company information section
     - **Per row** (e.g., COOP): Establishment number appears in each data row, usually in a dedicated column
     - Always analyze the template to determine which pattern is used before applying establishment number mutations
6. **Conditional Scenario Generation**: Some scenarios are only applicable to certain exporters based on their configuration in model-headers.js:
   - **NIRMS scenarios** (nirms-blank-value, nirms-invalid-value): Only generate if the exporter has a `nirms` property defined
   - **Country of Origin validation scenarios** (country-of-origin-missing, country-of-origin-invalid-format): Only generate if the exporter has both `country_of_origin` property AND `validateCountryOfOrigin: true`
   - **Country of Origin success scenarios** (country-of-origin-valid-iso, country-of-origin-x-value): Only generate if the exporter has a `country_of_origin` property defined
   - **Prohibited items scenario** (prohibited-item): Only generate if the exporter has `country_of_origin`, `commodity_code`, and `type_of_treatment` properties defined (required for prohibited item validation)
   - If an exporter doesn't have these properties, skip the related scenarios and document this in the README.md
7. **Mutation Scope Rules**: Different scenarios require different mutation scopes for effective testing:
   
   **Default: 2-3 Rows Only** - Modify only a few data rows to test specific validation logic. This applies to all scenarios unless explicitly stated otherwise below.
   
   **Exceptions - ALL Rows Required**:
   - `failurereason-no-rows` - Must clear ALL data rows to test empty data handling
   - **Per-row establishment number scenarios** (when establishment numbers appear in each data row):
     - `norms-missing-establishment-number` - Clear establishment numbers in ALL data rows
     - `nomatch-invalid-establishment-number` - Replace establishment numbers in ALL data rows  
     - `success-establishment-number-case-variation` - Change case in ALL data rows
     - `norms-spaces-in-establishment-number` - Modify format in ALL data rows
     - `norms-7digits-in-establishment-number` - Modify format in ALL data rows
   
   **Single Location Only** (for single per-sheet establishment number patterns):
   - All establishment number scenarios for exporters like Booker2 - modify only the single establishment location in header/company area
8. Analyze the provided file to determine the establishment number and column headers.
8. Use `model-headers.js` to:
   - Match the establishment number to an exporter.
   - Identify mandatory columns from the `regex` property (ALL fields defined in the regex object are mandatory).
   - Identify optional columns from other root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` (excluding `validateCountryOfOrigin`, `findUnitInHeader`, and `invalidSheets`).
   - Identify any invalid sheets to ignore.
   - Check for `nirms` property to determine if NIRMS scenarios should be generated
   - Check for `country_of_origin` property and `validateCountryOfOrigin` flag to determine if Country of Origin scenarios should be generated
   - Check for presence of `country_of_origin`, `commodity_code` (from regex), and `type_of_treatment` properties to determine if prohibited items scenario should be generated
9. Generate the following scenarios (at minimum), organized into appropriate subdirectories:

   **Basic Tests** (`test-scenarios/basic-tests/`):
   - **success-happy-path**: Exact copy of the input file for baseline validation
   - **nomatch-missing-required-column**: Remove or rename a mandatory column header (from the `regex` property in model-headers.js)
   - **success-missing-optional-column**: Remove or rename an optional column header (from root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` in model-headers.js) - ensure the new header name does not match the original regex pattern
   - **failurereason-invalid-data-type**: Insert non-numeric values in the columns matched by the exporter's `commodity_code`, `number_of_packages`, and `total_net_weight_kg` regexes (see model-headers.js) - modify only 2-3 data rows, not all rows
   - **success-empty-rows**: Include empty rows in the data section
   - **failurereason-no-rows**: no rows in the data section
   - **success-special-characters**: Update the values in the column matched by the exporter's `description` regex (from model-headers.js) to use Unicode, special characters, and symbols - modify only 2-3 data rows, not all rows
   - **success-header-variations**: Change the case of headers that are used by the exporter, as defined in model-headers.js (e.g., description, commodity_code, number_of_packages, total_net_weight_kg, etc.), to test case/formatting variations
   - **failurereasons-numeric-formatting**: Test various numeric formats (commas, leading zeros, etc.) in the columns matched by the exporter's `commodity_code`, `number_of_packages`, and `total_net_weight_kg` regexes (see model-headers.js) - modify only 2-3 data rows, not all rows

   **Single RMS Tests** (`test-scenarios/single-rms/`):
   - **norms-missing-establishment-number**: Remove or invalidate the establishment number. Implementation depends on establishment pattern:
     - **Single per sheet** (e.g., Booker2): Clear or invalidate the establishment number in the header/company information area
     - **Per row** (e.g., COOP): Clear establishment numbers in ALL data rows (required for complete test coverage)
   - **nomatch-invalid-establishment-number**: Use establishment number that doesn't match exporter regex. Implementation depends on establishment pattern:
     - **Single per sheet** (e.g., Booker2): Replace establishment number in header/company information area with invalid format
     - **Per row** (e.g., COOP): Replace establishment numbers in ALL data rows with invalid format (required for complete test coverage)
   - **success-establishment-number-case-variation**: Change only the case of the establishment number. Implementation depends on establishment pattern:
     - **Single per sheet** (e.g., Booker2): Change case in header/company information area (e.g., lower-case)
     - **Per row** (e.g., COOP): Change case in ALL data rows (e.g., lower-case) (required for complete test coverage)
   - **norms-spaces-in-establishment-number**: Replace hyphens with spaces in the establishment number. Implementation depends on establishment pattern:
     - **Single per sheet** (e.g., Booker2): Modify establishment number in header/company information area (e.g., "RMS-GB-000077-001" becomes "RMS GB 000077 001")
     - **Per row** (e.g., COOP): Modify establishment numbers in ALL data rows (e.g., "RMS-GB-000009-001" becomes "RMS GB 000009 001") (required for complete test coverage)
   - **norms-7digits-in-establishment-number**: Use 7 digits instead of 6 in the establishment number. Implementation depends on establishment pattern:
     - **Single per sheet** (e.g., Booker2): Modify establishment number in header/company information area (e.g., "RMS-GB-000077-001" becomes "RMS-GB-0000777-001")
     - **Per row** (e.g., COOP): Modify establishment numbers in ALL data rows (e.g., "RMS-GB-000009-001" becomes "RMS-GB-0000009-001") (required for complete test coverage)
   - **nomatch-ni-establishment-number**: Replace GB with NI in the establishment number to test Northern Ireland format rejection. Implementation depends on establishment pattern:
     - **Single per sheet** (e.g., Booker2): Modify establishment number in header/company information area (e.g., "RMS-GB-000077-001" becomes "RMS-NI-000077-001")
     - **Per row** (e.g., COOP): Modify establishment numbers in ALL data rows (e.g., "RMS-GB-000009-001" becomes "RMS-NI-000009-001") (required for complete test coverage)

   **Net Weight Tests** (`test-scenarios/net-weight/`):
   - **failurereason-net-weight-no-kilos**: Change the header matched by the exporter's `total_net_weight_kg` regex (from model-headers.js) to 'Net Weight' (removes 'Kilos')
   - **failurereason-net-weight-lbs**: Change the header matched by the exporter's `total_net_weight_kg` regex (from model-headers.js) to 'Net Weight (lbs)' (uses pounds instead of kilos)

   **Country of Origin Tests** (`test-scenarios/country-of-origin/`) - All country/origin-related validation tests:
   - **failurereason-country-of-origin-missing**: Set blank/empty values in the column matched by the exporter's `country_of_origin` property (from model-headers.js) - modify only 2-3 data rows, not all rows - only if exporter has country_of_origin column and validateCountryOfOrigin is true
   - **failurereason-country-of-origin-invalid-format**: Set values that are not 2-digit ISO codes or "X" in the column matched by the exporter's `country_of_origin` property (e.g., "INVALID", "123", "GB123") - modify only 2-3 data rows, not all rows - only if exporter has country_of_origin column and validateCountryOfOrigin is true
   - **success-country-of-origin-valid-iso**: Set valid 2-digit ISO country codes in the column matched by the exporter's `country_of_origin` property (e.g., "GB", "FR", "DE") - modify only 2-3 data rows, not all rows - only if exporter has country_of_origin column
   - **success-country-of-origin-x-value**: Set "X" values in the column matched by the exporter's `country_of_origin` property - modify only 2-3 data rows, not all rows - only if exporter has country_of_origin column
   - **failurereason-nirms-blank-value**: Set blank/empty values in the column matched by the exporter's `nirms` property (from model-headers.js) - modify only 2-3 data rows, not all rows - only if exporter has nirms column
   - **failurereason-nirms-invalid-value**: Set invalid values (not recognized NIRMS values like "Yes", "No", "Green", "Red", etc.) in the column matched by the exporter's `nirms` property (from model-headers.js) - modify only 2-3 data rows, not all rows - only if exporter has nirms column
   - **failurereason-prohibited-item**: Set a combination of country_of_origin, commodity_code, and type_of_treatment values that match an entry in the prohibited items list (services/data/data-prohibited-items.json) - modify only 2-3 data rows, not all rows - only if exporter has all three required fields

10. **File Copying Process**:
   - Create organized subdirectories first: `basic-tests/`, `single-rms/`, `net-weight/`, `country-of-origin/`
   - Use PowerShell commands to copy template to all scenario filenames in their appropriate subdirectories
   - Then use MCP Excel tools to apply targeted mutations to specific cells
   - Never modify the original template file
11. **Documentation Requirements**:
    - Create `manifest.json` with structured scenario definitions including expected results
    - Create comprehensive `README.md` documenting all scenarios, mutations, and testing instructions
    - Include exporter configuration details (establishment number regex, column mappings)
    - Document column classification (mandatory vs optional) based on `regex` property vs root-level properties
    - Document the scenario types:
       - **net-weight-no-kilos**: The header matched by the exporter's `total_net_weight_kg` regex (see model-headers.js) is changed to 'Net Weight' (removes 'Kilos')
       - **net-weight-lbs**: The header matched by the exporter's `total_net_weight_kg` regex (see model-headers.js) is changed to 'Net Weight (lbs)' (uses pounds instead of kilos)
       - **nirms-blank-value**: Empty/blank values in the NIRMS column (only for exporters with `nirms` property in model-headers.js)
       - **nirms-invalid-value**: Invalid NIRMS values that don't match expected patterns (only for exporters with `nirms` property in model-headers.js)
       - **country-of-origin-missing**: Empty/blank country of origin values (only for exporters with `country_of_origin` property and `validateCountryOfOrigin: true`)
       - **country-of-origin-invalid-format**: Invalid country codes that are not 2-digit ISO or "X" (only for exporters with `country_of_origin` property and `validateCountryOfOrigin: true`)
       - **country-of-origin-valid-iso**: Valid 2-digit ISO country codes (only for exporters with `country_of_origin` property)
       - **country-of-origin-x-value**: Valid "X" country code values (only for exporters with `country_of_origin` property)
       - **prohibited-item**: Items matching the prohibited items list based on country_of_origin + commodity_code + type_of_treatment combination (only for exporters with all three required fields)
12. **Do not modify the original input file** - it should remain in the main exporter directory as the authoritative template.
13. **Line Break Handling**: For multi-line cell values, use `\n` for line breaks (never `<br>`). Excel's "Wrap Text" feature should display these correctly. If you see `<br>` in a cell, replace it with `\n`.
14. **Error Handling**: Handle MCP Excel tool limitations gracefully. If file creation fails, fall back to PowerShell file operations and provide clear guidance.

## Implementation Steps

1. **Analyze Template**: Read the happy path file to identify establishment number, headers, and data structure
2. **Match Exporter**: Use model-headers.js to determine the correct exporter configuration
3. **Conditional Scenario Planning**: Based on exporter configuration, determine which scenarios to generate:
   - Check if `nirms` property exists → generate NIRMS scenarios
   - Check if `country_of_origin` property exists → generate Country of Origin success scenarios
   - Check if both `country_of_origin` AND `validateCountryOfOrigin: true` → generate Country of Origin validation scenarios
   - Check if `country_of_origin`, `commodity_code` (from regex), and `type_of_treatment` properties exist → generate prohibited items scenario
4. **Create Directory**: Ensure organized subdirectories exist under `app/packing-lists/{exporter}/test-scenarios/`:
   - `basic-tests/` - Core functionality and data validation tests
   - `single-rms/` - Establishment number validation tests  
   - `net-weight/` - Weight unit and formatting tests
   - `country-of-origin/` - Country, NIRMS, and prohibited items tests (all country/origin-related validation)
5. **Copy Files**: Use PowerShell to copy template to all scenario filenames in their appropriate subdirectories
6. **Apply Mutations**: Use MCP Excel tools to modify specific cells for each scenario, including:
   - **NIRMS Validation**: For exporters with `nirms` property, test blank values and invalid patterns (should be recognizable values like "Yes", "No", "Green", "Red", "NIRMS", "NON-NIRMS", etc.)
   - **Country of Origin Validation**: For exporters with `validateCountryOfOrigin: true`, test blank values and invalid formats (should be 2-digit ISO codes like "GB", "FR", "DE" or "X")
   - **Prohibited Items**: For exporters with all required fields, select a prohibited item from services/data/data-prohibited-items.json and set the appropriate country_of_origin, commodity_code, and type_of_treatment values in the data rows
7. **Generate Documentation**: Create manifest.json and README.md with comprehensive scenario descriptions, including conditional scenario explanations

## Context & Variables

- Use `${file}` to reference the user’s provided sample file.
- Output files should be written to `app/packing-lists/{exporter}/` relative to `${workspaceFolder}`.
- No additional input variables required unless scenario customization is needed.

## Output

- Output is a set of new Excel files organized in subdirectories under `app/packing-lists/{exporter}/test-scenarios/`:
  - `basic-tests/` - Core functionality tests
  - `single-rms/` - Establishment number tests
  - `net-weight/` - Weight validation tests
  - `country-of-origin/` - Country, NIRMS, and prohibited items tests (all country/origin-related validation)
- A `manifest.json` file with structured test scenario definitions and expected results.
- A comprehensive `README.md` documenting all scenarios, mutations, and testing instructions.
- Original template file preserved in `app/packing-lists/{exporter}/` unchanged.

## Quality & Validation

- Success is measured by the creation of all required output artifacts (Excel files, manifest.json, and README.md) in the correct test-scenarios directory, with valid data and clear descriptions.
- Output files must be valid Excel format, match the input schema, preserve original formatting, and include appropriate mutations for each test scenario.
- The manifest.json must include structured scenario definitions with expected results, and README.md must provide comprehensive documentation.
- **Column Mapping Verification**: Always verify that column mappings in documentation match the actual Excel file structure, especially when merged cells are present.
- If the input file does not match any exporter in model-headers.js, or if output files are invalid or missing, provide a clear error message and do not create partial artifacts.

## CRITICAL - Excel Column Structure Analysis & Mutation Rules

**MANDATORY STEP**: Before applying any mutations, perform comprehensive column structure analysis to identify actual data positions, especially when merged cells are present.

### Column Structure Discovery Process

1. **Identify Header Row**: Header row location varies by exporter - scan the template to find the row containing column headers that match model-headers.js regex patterns
2. **Read Template Structure**: Use `mcp_excel_excel_read_sheet` to examine both header row AND data rows
3. **Identify Merged Cells**: Look for repeated values across adjacent columns (indicates merged cells)
4. **Map Data Positions**: Document exact column letters (A, B, C, etc.) where actual data resides
5. **Verify Field Mappings**: Cross-reference with model-headers.js regex patterns to confirm field locations

### Header Row Detection Strategy

Different exporters place headers at different row positions:
- **Scan approach**: Read the first 20-30 rows of the template to identify header patterns
- **Pattern matching**: Look for text that matches the regex patterns in model-headers.js for the specific exporter
- **Common indicators**: Headers often contain terms like "Description", "Commodity Code", "Net Weight", "Country of Origin"
- **Context clues**: Headers are typically followed immediately by data rows with corresponding value types (text, numbers, codes)

**Example Detection**:
- Read rows 1-25 and look for row containing "Description of Goods", "Commodity Code", "Net Weight" etc.
- Once header row is identified, data rows typically start in the next row
- Some exporters may have header row 5, others row 18, others row 12 - there's no standard

### Universal Mutation Rules

**For Merged Cell Fields** (e.g., commodity codes, descriptions):
- **Rule**: Update ALL columns that contain the same merged data with identical values
- **Example**: If commodity codes appear in both columns L and M, update both with identical values
- **Critical**: Failing to update all merged columns causes data inconsistency
- **Validation**: After mutation, verify all merged columns show same value

**For Single Column Fields** (e.g., country of origin, NIRMS):
- **Rule**: Identify the exact single column containing the data and update only that column
- **Common Error**: Assuming field position based on visual layout rather than actual data location
- **Example**: NIRMS might visually appear in column Q but data actually resides in column R
- **Validation**: Read back the mutated cell to confirm correct targeting

**For Optional vs Mandatory Fields**:
- **Mandatory Fields**: Preserve data unless specifically testing field absence/corruption
- **Optional Fields**: Safe to clear/modify for negative test scenarios
- **Mixed Scenarios**: Ensure mandatory fields remain valid when testing optional field failures

**For Multi-line Cell Values**:
- **Rule**: Use `\n` for line breaks in cell content (never `<br>`)
- **Preservation**: When mutating cells with existing line breaks, preserve the structure
- **Example**: "Booker Limited \nWA11 9WD\nRMS-GB-000077-001" becomes "Booker Limited \nWA11 9WD\nRMS GB 000077 001"

### Column Position Verification Checklist

Before applying mutations to any exporter, COMPLETE ALL STEPS:

1. ✅ **Read header row** to see column labels and their positions (header row position varies by exporter)
2. ✅ **Read multiple data rows** to see actual data placement patterns (data typically starts immediately after header row)  
3. ✅ **Identify merged cells** by comparing values across multiple data rows - look for identical values in adjacent columns
4. ✅ **Map field types** to exact column letters (not assumed positions) - record mappings like "commodity_code: L,M (merged)" or "country_of_origin: N (single)"
5. ✅ **Cross-reference with model-headers.js** to understand which fields are mandatory vs optional
6. ✅ **Test one small mutation** first (like changing one cell) to verify correct column targeting
7. ✅ **Document verified structure** in manifest.json with accurate column mappings before bulk operations
8. ✅ **Apply mutations systematically** using verified column positions, updating all merged columns consistently

### Common Merged Cell Patterns

Based on BOOKER2 analysis and common Excel template structures:

- **Commodity Codes**: Often merged across 2+ columns (e.g., columns L,M) with identical 10-digit values
- **Product Descriptions**: Often merged across 3-4 columns with same descriptive text
- **Weight Fields**: May have separate header and unit columns but data in single column
- **NIRMS/Lane**: Frequently misaligned from visual column position (visual Q may be actual R)
- **Country of Origin**: Usually single column but position may not match visual layout
- **Establishment Numbers**: Often in multi-line cells with additional company information

**Critical Reminder**: Visual column layout in Excel != actual data column positions. Always verify through data inspection.

**Debugging Tip**: When mutations don't appear where expected, re-read the affected cell to confirm actual column targeting.

## Common Issues & Troubleshooting

### Merged Cells and Column Mapping
- **Issue**: Excel templates with merged cells can cause confusion about actual data column locations
- **Root Cause**: Visual layout doesn't match actual data positions, especially with merged cells
- **Solution**: ALWAYS use `mcp_excel_excel_read_sheet` with `showStyle: true` and analyze multiple data rows before making assumptions
- **Example**: A template might show headers visually in columns C-F but actual data resides in columns D,E with merged content
- **Critical**: For merged fields, update ALL columns containing the merged data with identical values

### Column Position Verification
- **Best Practice**: Always read both header row and multiple data rows to confirm actual column placement patterns
- **Documentation**: Record exact column letters with merge status (e.g., "commodity_code: L,M (merged)" or "country_of_origin: N (single)")
- **Validation**: Cross-reference column mappings in manifest.json with actual Excel file structure after mutations
- **Testing**: Apply one small test mutation first to verify correct column targeting before bulk operations

### Data Consistency in Merged Cells
- **Issue**: Updating only one column of a merged cell field causes data inconsistency
- **Example**: BOOKER2 commodity codes in columns L,M must both be updated with identical values
- **Solution**: Identify all columns containing merged data and update all with same value
- **Verification**: Read back all merged columns after mutation to ensure consistency

### MCP Excel Tool Usage
- **File Creation**: Never attempt to create new Excel files from scratch with MCP tools - they cannot create new Excel files
- **Workflow**: Copy template with PowerShell → Apply mutations with MCP tools → Verify results with read operations
- **Error Handling**: If MCP operations fail, fall back to PowerShell and provide clear guidance
- **Bulk Operations**: Process mutations systematically, verifying each step rather than assuming success

### BOOKER2 Implementation Lessons Learned

#### Establishment Number Pattern Recognition
- **BOOKER2 Pattern**: Single establishment number per sheet in header/company information area (Column B, multi-line with company details)
- **COOP Pattern**: Establishment number appears in each data row (Column E, repeated per row)
- **Pattern Detection**: Always analyze template structure to determine which pattern is used:
  - Check header/company information areas for single establishment number
  - Check data rows for establishment number columns
  - Apply mutations accordingly - single location vs. multiple rows

#### Actual Column Structure (Based on Template Analysis)
- **Establishment Number**: Column B (multi-line with company details) - SINGLE PER SHEET PATTERN
- **Description**: Column D (single column, not merged)
- **Commodity Code**: Columns L,M (merged - both must be updated identically)
- **Number of Packages**: Column H (single column)
- **Net Weight**: Column K (single column) 
- **Nature of Products**: Column I (single column)
- **Type of Treatment**: Column J (single column)
- **Country of Origin**: Column N (single column)
- **NIRMS**: Column Q (single column)

#### Common Misconceptions
- **Visual ≠ Actual**: Column positions in Excel display don't match data positions
- **Header ≠ Data**: Header row layout may differ from actual data column usage
- **Merged Cell Handling**: Failing to update all merged columns causes inconsistent data
- **Multi-line Preservation**: Establishment numbers often contain line breaks that must be preserved

#### Verification Strategy
1. **Structure Analysis**: Read template with showStyle to understand layout
2. **Data Sampling**: Read multiple data rows to confirm patterns
3. **Test Mutation**: Apply one small change to verify column targeting
4. **Bulk Application**: Apply remaining mutations using verified column positions
5. **Final Verification**: Read back sample cells to confirm correct mutations

This systematic approach prevents the column mapping errors encountered during initial BOOKER2 implementation.

### NIRMS and Country of Origin Validation Patterns

#### NIRMS Validation (for exporters with `nirms` property)
- **Valid NIRMS Values**: "Yes", "No", "Green", "Red", "NIRMS", "NON-NIRMS", "NIRMS Eligible", "Non-NIRMS", etc.
- **Invalid NIRMS Values**: "INVALID", "Maybe", "Unknown", "123", blank/empty values
- **Test Patterns**: 
  - Blank/empty cells in NIRMS column should trigger validation failure
  - Unrecognized text values should trigger validation failure

#### Country of Origin Validation (for exporters with `validateCountryOfOrigin: true`)
- **Valid Country Codes**: 2-digit ISO codes ("GB", "FR", "DE", "IE", "NL", etc.) or "X"
- **Invalid Country Codes**: 3+ digit codes ("GBR", "FRA"), numeric values ("123"), text ("INVALID"), blank/empty values
- **Test Patterns**:
  - Missing/blank country of origin should trigger validation failure
  - Non-ISO format codes should trigger validation failure
  - Valid 2-digit ISO codes should pass validation
  - "X" value should pass validation (used for mixed/unknown origins)

#### Prohibited Items Validation (for exporters with country_of_origin, commodity_code, and type_of_treatment fields)
- **Prohibited Combinations**: Items that match entries in services/data/data-prohibited-items.json based on exact combination of country_of_origin + commodity_code + type_of_treatment
- **Common Examples**: 
  - CN + 07061000 + Chilled (Chinese carrots, chilled)
  - BR + 0207 + Fresh (Brazilian poultry, fresh)
  - ZA + 08054000 + Raw (South African grapefruit, raw)
  - IN + 100610 + Fresh (Indian rice, fresh)
- **Test Patterns**:
  - Select any entry from the prohibited items JSON file
  - Set the corresponding values in the data rows (not headers)
  - Should trigger FAILUREREASON due to prohibited item detection
  - Use realistic descriptions for the prohibited items (e.g., "Chinese Fresh Carrots", "Brazilian Raw Chicken", etc.)
