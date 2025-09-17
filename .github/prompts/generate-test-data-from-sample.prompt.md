---
description: "Generate a suite of test data and Excel/CSV files for various test scenarios based on a user-provided happy path sample file."
mode: "agent"
tools: ['codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'extensions', 'editFiles', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'excel']
---

# Generate Test Data from Sample File

> **Required Inputs:**
> - `happyPathFile`: Path to the user-provided happy path sample file (Excel/CSV)
> - `exporterProperty`: The exporter property name from model-headers.js (e.g., 'BOOKER2', 'ASDA1')
> - `scenarioFolders`: List of scenario folders to generate (e.g., ['basic-tests', 'single-rms'])

> **Note:** The list of tools available for this prompt is fixed in the header section above and does not need to be specified as an input.

You are a senior QA automation engineer with 8+ years of experience in test data design and Excel automation for Node.js/TypeScript projects. You are proficient in using tools such as `mcp_excel_excel_read_sheet`, `mcp_excel_excel_write_to_sheet`, `mcp_excel_excel_describe_sheets`, `list_dir`, and `file_search` to efficiently generate and manipulate test data.

## Column Mapping Manifest (Pre-Scenario Step)

Before creating any test scenario folders or files, generate a single `manifest.json` file in the test-scenarios folder (e.g., `app/packing-lists/{exporter}/test-scenarios/manifest.json`) containing:
- The detected column mappings (mandatory, optional, other) for the exporter and sample file
- Header row and data row locations
- Merged cell/column details
- Establishment number pattern (per sheet or per row)

This manifest must be confirmed and can be reused for all scenario generation and seeding. Do not regenerate the manifest for each scenario folder.

Scenario folder creation and seeding should always reference this manifest for column structure and mapping details. The manifest in the test-scenarios folder is the single source of truth for all scenario generation.

## Column Classification Rules

### Three-Category Field Classification

When analyzing the exporter configuration in `model-headers.js`, columns are classified into three categories:

- **Mandatory Columns**: ALL fields defined within the `regex` property of the exporter configuration
- **Optional Columns**: Fields defined as separate root-level properties (excluding configuration flags)
- **Other Columns**: Fields present in the template but not defined in either mandatory or optional categories

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

**Field Classification:**
- **Mandatory**: `description`, `commodity_code`, `number_of_packages`, `total_net_weight_kg`, `nature_of_products`, `type_of_treatment`
- **Optional**: `country_of_origin`, `nirms`
- **Other**: `row_number` (#), `product_code`, `type_of_pkgs`, `gross_weight` (present in template but not in configuration)

**Important**: Optional data scenarios must handle ALL non-mandatory fields (both optional and other categories).

### Three States of Header Columns

Header columns in the template are classified into three states based on the exporter configuration:

1. **Mandatory**: Fields defined within the `regex` property of the exporter configuration
   - Required for successful parsing
   - Missing or incorrect mandatory headers cause parsing failure
   - Example: `description`, `commodity_code`, `number_of_packages`, `total_net_weight_kg`

2. **Optional**: Fields defined as separate root-level properties (excluding configuration flags)
   - Not required for parsing, but used if present and correctly identified
   - Missing or incorrect optional headers still allow parsing to succeed
   - Example: `country_of_origin`, `nirms`

3. **Not Used**: Fields present in the template but not defined in either mandatory or optional categories
   - Ignored by the parser - not processed regardless of content
   - Can be modified without affecting parsing outcome
   - Example: `row_number`, `product_code`, `type_of_pkgs`, `gross_weight`

**Critical Rule for Optional Data Scenarios**: When clearing optional data (state 2), also clear "not used" data (state 3). This ensures that scenarios testing optional data behavior are comprehensive and test all non-mandatory fields together.

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
- **VERIFICATION**: Use PowerShell commands to track mutation progress and verify all scenario files have been properly modified.

## Field Mapping Confirmation (MANDATORY)

**Before any test data is created or mutated, you MUST display the detected field/column mappings (from both `model-headers.js` and the sample file) to the user and require explicit confirmation.**

- Present a summary of the detected mappings, including which columns in the sample file correspond to which fields in the exporter configuration.
- Allow the user to confirm, adjust, or reject the mappings interactively (e.g., via CLI prompt, UI, or other means).
- **Block all test data file creation and mutation until the user has confirmed the field mappings.**
- If the user rejects or adjusts the mappings, repeat the mapping detection and confirmation process until the user explicitly confirms.
- Only after confirmation, proceed to generate or mutate any test scenario files.

This confirmation step is required to prevent accidental data corruption and ensure that all test scenarios are based on correct and user-verified field mappings.

## Instructions

1. **File Organization**: The user must provide a valid sample file (happy path) in Excel format. This file will be used as the template for all scenario files and should remain in the main exporter directory as the source.
2. **Template Preservation**: All scenario files must be created by copying the entire original happy path file to each scenario file, preserving formatting, merged cells, and styles. Never create blank files from scratch, and never update the template in-place.
3. **MCP Excel Tool Limitations**: MCP Excel tools cannot create new Excel files from scratch. Always use PowerShell/CLI to copy the template file to each scenario filename before applying mutations with MCP Excel tools.
4. **Directory Structure**: Each scenario's instructions file is responsible for creating its own subdirectory (e.g., `test-scenarios/basic-tests/`, `test-scenarios/single-rms/`, etc.) only if its scenarios are being generated. The main instructions do not create subdirectories globally. All generated test files go in their respective subdirectories, while the original template remains in the parent directory.
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

7. **REQUIRED: Select which test-scenarios folders to generate.**

   When you run this prompt, you will be shown a list of all available scenario folders that can be created for the current exporter. You must select one or more from the following options:

   - `basic-tests` — Core functionality and data validation tests
   - `single-rms` — Establishment number validation tests
   - `net-weight` — Weight unit and formatting tests
   - `country-of-origin` — Country, NIRMS, and prohibited items tests

   **Only the selected folders will be created and seeded.**

   > **Important:** Scenario folders (e.g., `basic-tests/`, `single-rms/`, etc.) must only be created when their specific scenario instructions are executed. If a required folder does not exist, it must be created as part of the scenario generation process. Do not pre-create all folders for every exporter. This ensures that only relevant test data and structure are present for the scenarios being generated.


  For each selected folder, see the corresponding prompt file for detailed instructions (now located in the `generate-test-data-from-sample` subfolder):

  - `generate-test-data-from-sample/generate-test-data-basic-tests.prompt.md` for `basic-tests/`
  - `generate-test-data-from-sample/generate-test-data-single-rms.prompt.md` for `single-rms/`
  - `generate-test-data-from-sample/generate-test-data-net-weight.prompt.md` for `net-weight/`
  - `generate-test-data-from-sample/generate-test-data-country-of-origin.prompt.md` for `country-of-origin/`

  Each scenario's specific requirements and mutations are described in their own prompt file within the subfolder.

8. For instructions to create scenario folders and copy template files, see the specific prompt file for each scenario folder. Each scenario prompt contains the required steps for folder creation and file copying before mutation.
9. **Documentation Requirements**:
    - Create `manifest.json` with structured scenario definitions including expected results
    - Create comprehensive `README.md` documenting all scenarios, mutations, and testing instructions
    - Include exporter configuration details (establishment number regex, column mappings)
    - Document column classification (mandatory vs optional) based on `regex` property vs root-level properties
10. **Do not modify the original input file** - it should remain in the main exporter directory as the authoritative template.
11. **Line Break Handling**: For multi-line cell values, use `\n` for line breaks (never `<br>`). Excel's "Wrap Text" feature should display these correctly. If you see `<br>` in a cell, replace it with `\n`.
12. **Error Handling**: Handle MCP Excel tool limitations gracefully. If file creation fails, fall back to PowerShell file operations and provide clear guidance.

## Implementation Steps

1. **Analyze Template**: Read the happy path file to identify establishment number, headers, and data structure
2. **Match Exporter**: Use model-headers.js to determine the correct exporter configuration
4. **Create Directory**: Each scenario's instructions file is responsible for creating its own subdirectory (e.g., `basic-tests/`, `single-rms/`, `net-weight/`, `country-of-origin/`) only if its scenarios are being generated. The main instructions do not create subdirectories globally.
5. **Copy Files**: Use PowerShell to copy the entire template file to all scenario filenames in their appropriate subdirectories. Do not update the template in-place; always copy the whole file for each scenario.
7. **Generate Documentation**: Create manifest.json and README.md with comprehensive scenario descriptions, including conditional scenario explanations

## MANDATORY - Systematic Mutation Completion Tracking

**CRITICAL REQUIREMENT**: All scenario files must have appropriate mutations applied. No files should remain as unchanged copies of the template (except the baseline happypath.xlsx).

### Mutation Progress Tracking Commands

Use these PowerShell commands to track mutation progress:

```powershell
# Check total files created
Get-ChildItem -Path "app/packing-lists/{exporter}/test-scenarios" -Recurse -File | Measure-Object

# Check files modified today (after mutations)
Get-ChildItem -Path "app/packing-lists/{exporter}/test-scenarios" -Recurse -File | Where-Object {$_.LastWriteTime -gt (Get-Date).Date} | Measure-Object

# List files that still need mutations (unchanged since template copy)
Get-ChildItem -Path "app/packing-lists/{exporter}/test-scenarios" -Recurse -File | Where-Object {$_.LastWriteTime -lt (Get-Date).Date} | Select-Object Name, LastWriteTime
```

### Systematic Mutation Process

1. **Initial File Copy**: Copy template to all scenario filenames
2. **Track Progress**: Use commands above to identify which files need mutations
3. **Apply Mutations Systematically**: Go through each file and apply appropriate mutations
4. **Verify Completion**: Ensure all files except happypath.xlsx have been modified
5. **Final Validation**: Check that all scenarios have proper mutations applied

### Common Issues & Troubleshooting

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


