---
description: "Generate a suite of test data and Excel/CSV files fo- Use `${file}` to reference the user's provided sample file.
- Output files should be written to `app/packing-lists/{exporter}/test-scenarios/` relative to `${workspaceFolder}`.
- Original template remains in `app/packing-lists/{exporter}/` for reference and future regeneration.arious test scenarios based on a user-provided happy path sample file, using exporter mapping logic from model-headers.js."
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
- Use the `model-headers.js` file to:
  - Identify the correct exporter by matching the establishment number regex (`establishmentNumber.regex`).
  - Determine mandatory columns from the `regex` property for that exporter (ALL fields in the regex object are mandatory).
  - Identify optional columns from other root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` (excluding `validateCountryOfOrigin`, `findUnitInHeader`, and `invalidSheets`).
  - Ignore any sheets listed in the `invalidSheets` property for that exporter.
- Output files must be in `.xls`, `.xlsx`, or `.csv` format, matching the format of the input file.
- All generated files should be written to `app/packing-lists/{exporter}/test-scenarios/` (where `{exporter}` is determined by the matched exporter in `model-headers.js`).
- The original template file should remain in `app/packing-lists/{exporter}/` as the authoritative source.
- Create a `manifest.json` file with structured test scenario definitions and a comprehensive `README.md` for documentation.

## Instructions

1. **File Organization**: The user must provide a valid sample file (happy path) in Excel format. This file will be used as the template for all scenario files and should remain in the main exporter directory as the source.
2. **Template Preservation**: All scenario files must be created by copying the original happy path file to preserve formatting, merged cells, and styles. Never create blank files from scratch.
3. **MCP Excel Tool Limitations**: MCP Excel tools cannot create new Excel files from scratch. Always use PowerShell/CLI to copy the template file to each scenario filename before applying mutations with MCP Excel tools.
4. **Directory Structure**: Create a `test-scenarios/` subdirectory under the exporter folder. All generated test files go in this subdirectory, while the original template remains in the parent directory.
5. **Column Analysis for Merged Cells**: Excel templates often use merged cells and visual formatting that can create confusion about actual data column locations. To identify correct columns:
   - Use `mcp_excel_excel_read_sheet` with `showStyle: true` to analyze the template structure
   - Read the header row AND a few data rows to see where actual data resides
   - Pay attention to empty cells and merged cell patterns that may shift column positions
   - Verify column mappings by checking both header text and data placement
   - Document actual column letters (A, B, C, etc.) rather than assuming sequential placement
6. **Conditional Scenario Generation**: Some scenarios are only applicable to certain exporters based on their configuration in model-headers.js:
   - **NIRMS scenarios** (nirms-blank-value, nirms-invalid-value): Only generate if the exporter has a `nirms` property defined
   - **Country of Origin validation scenarios** (country-of-origin-missing, country-of-origin-invalid-format): Only generate if the exporter has both `country_of_origin` property AND `validateCountryOfOrigin: true`
   - **Country of Origin success scenarios** (country-of-origin-valid-iso, country-of-origin-x-value): Only generate if the exporter has a `country_of_origin` property defined
   - **Prohibited items scenario** (prohibited-item): Only generate if the exporter has `country_of_origin`, `commodity_code`, and `type_of_treatment` properties defined (required for prohibited item validation)
   - If an exporter doesn't have these properties, skip the related scenarios and document this in the README.md
7. Analyze the provided file to determine the establishment number and column headers.
8. Use `model-headers.js` to:
   - Match the establishment number to an exporter.
   - Identify mandatory columns from the `regex` property (ALL fields defined in the regex object are mandatory).
   - Identify optional columns from other root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` (excluding `validateCountryOfOrigin`, `findUnitInHeader`, and `invalidSheets`).
   - Identify any invalid sheets to ignore.
   - Check for `nirms` property to determine if NIRMS scenarios should be generated
   - Check for `country_of_origin` property and `validateCountryOfOrigin` flag to determine if Country of Origin scenarios should be generated
   - Check for presence of `country_of_origin`, `commodity_code` (from regex), and `type_of_treatment` properties to determine if prohibited items scenario should be generated
9. Generate the following scenarios (at minimum):
   - **success-happy-path**: Exact copy of the input file for baseline validation
   - **nomatch-missing-required-column**: Remove or rename a mandatory column header (from the `regex` property in model-headers.js)
   - **success-missing-optional-column**: Remove or rename an optional column header (from root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` in model-headers.js)
   - **failurereason-invalid-data-type**: Insert non-numeric values in the columns matched by the exporter's `commodity_code`, `number_of_packages`, and `total_net_weight_kg` regexes (see model-headers.js)
   - **success-empty-rows**: Include empty rows in the data section
   - **failurereason-no-rows**: no rows in the data section
   - **success-special-characters**: Update the values in the column matched by the exporter's `description` regex (from model-headers.js) to use Unicode, special characters, and symbols
   - **norms-missing-establishment-number**: Remove or invalidate the establishment number (preserve any additional text in the cell)
   - **nomatch-invalid-establishment-number**: Use establishment number that doesn't match exporter regex (preserve any additional text in the cell)
   - **success-establishment-number-case-variation**: Change only the case of the establishment number in the cell (e.g., lower-case), preserving any additional text in the cell
   - **success-header-variations**: Change the case of headers that are used by the exporter, as defined in model-headers.js (e.g., description, commodity_code, number_of_packages, total_net_weight_kg, etc.), to test case/formatting variations
   - **failurereasons-numeric-formatting**: Test various numeric formats (commas, leading zeros, etc.) in the columns matched by the exporter's `commodity_code`, `number_of_packages`, and `total_net_weight_kg` regexes (see model-headers.js)
   - **failurereason-net-weight-no-kilos**: Change the header matched by the exporter's `total_net_weight_kg` regex (from model-headers.js) to 'Net Weight' (removes 'Kilos')
   - **failurereason-net-weight-lbs**: Change the header matched by the exporter's `total_net_weight_kg` regex (from model-headers.js) to 'Net Weight (lbs)' (uses pounds instead of kilos)
   - **failurereason-nirms-blank-value**: Set blank/empty values in the column matched by the exporter's `nirms` property (from model-headers.js) - only if exporter has nirms column
   - **failurereason-nirms-invalid-value**: Set invalid values (not recognized NIRMS values like "Yes", "No", "Green", "Red", etc.) in the column matched by the exporter's `nirms` property (from model-headers.js) - only if exporter has nirms column
   - **failurereason-country-of-origin-missing**: Set blank/empty values in the column matched by the exporter's `country_of_origin` property (from model-headers.js) - only if exporter has country_of_origin column and validateCountryOfOrigin is true
   - **failurereason-country-of-origin-invalid-format**: Set values that are not 2-digit ISO codes or "X" in the column matched by the exporter's `country_of_origin` property (e.g., "INVALID", "123", "GB123") - only if exporter has country_of_origin column and validateCountryOfOrigin is true
   - **success-country-of-origin-valid-iso**: Set valid 2-digit ISO country codes in the column matched by the exporter's `country_of_origin` property (e.g., "GB", "FR", "DE") - only if exporter has country_of_origin column
   - **success-country-of-origin-x-value**: Set "X" values in the column matched by the exporter's `country_of_origin` property - only if exporter has country_of_origin column
   - **failurereason-prohibited-item**: Set a combination of country_of_origin, commodity_code, and type_of_treatment values that match an entry in the prohibited items list (services/data/data-prohibited-items.json) - only if exporter has all three required fields
10. **File Copying Process**:
   - Use PowerShell commands to copy template to all scenario filenames first
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
4. **Create Directory**: Ensure `app/packing-lists/{exporter}/test-scenarios/` exists
5. **Copy Files**: Use PowerShell to copy template to all scenario filenames in test-scenarios directory
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

- Output is a set of new Excel files in `app/packing-lists/{exporter}/test-scenarios/`, matching the input schema and format.
- A `manifest.json` file with structured test scenario definitions and expected results.
- A comprehensive `README.md` documenting all scenarios, mutations, and testing instructions.
- Original template file preserved in `app/packing-lists/{exporter}/` unchanged.

## Quality & Validation

- Success is measured by the creation of all required output artifacts (Excel files, manifest.json, and README.md) in the correct test-scenarios directory, with valid data and clear descriptions.
- Output files must be valid Excel format, match the input schema, preserve original formatting, and include appropriate mutations for each test scenario.
- The manifest.json must include structured scenario definitions with expected results, and README.md must provide comprehensive documentation.
- **Column Mapping Verification**: Always verify that column mappings in documentation match the actual Excel file structure, especially when merged cells are present.
- If the input file does not match any exporter in model-headers.js, or if output files are invalid or missing, provide a clear error message and do not create partial artifacts.

## Common Issues & Troubleshooting

### Merged Cells and Column Mapping
- **Issue**: Excel templates with merged cells can cause confusion about actual data column locations
- **Solution**: Use `mcp_excel_excel_read_sheet` with `showStyle: true` to analyze structure before making assumptions
- **Example**: A template might show headers in visual columns C-F but actual data resides in column D only

### Column Position Verification
- **Best Practice**: Always read both header row and data rows to confirm actual column placement
- **Documentation**: Record exact column letters (D, H, K, L, etc.) rather than assumed positions
- **Validation**: Cross-reference column mappings in manifest.json with actual Excel file structure

### MCP Excel Tool Usage
- **File Creation**: Never attempt to create new Excel files from scratch with MCP tools
- **Workflow**: Copy template → Apply mutations → Verify results
- **Error Handling**: If MCP operations fail, fall back to PowerShell and provide clear guidance

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
