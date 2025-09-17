---
description: "Generate test data scenarios for country of origin, NIRMS, and prohibited items validation in the country-of-origin folder. Strictly follow the scenario list and mutation instructions below."
mode: "agent"
---


# Country of Origin Tests Scenario Generation and Seeding

Generate and seed test data and Excel/CSV files for country of origin, NIRMS, and prohibited items validation scenarios. Each scenario must be based on the provided happy path sample file, with targeted mutations as described below. All files must be placed in `test-scenarios/country-of-origin/`.


## Instructions to Create Folders, Copy, and Seed Data

1. **Create the scenario folder** (if it does not exist):

	```powershell
	New-Item -ItemType Directory -Path "app/packing-lists/{exporter}/test-scenarios/country-of-origin" -Force
	```

2. **Copy the happy path sample file** to each scenario filename in `app/packing-lists/{exporter}/test-scenarios/country-of-origin/` using PowerShell or CLI. Do not create blank files from scratch. Example:

	```powershell
	Copy-Item "app/packing-lists/{exporter}/HappyPath.xlsx" "app/packing-lists/{exporter}/test-scenarios/country-of-origin/failurereason-country-of-origin-missing.xlsx"
	# Repeat for each scenario file listed below...
	```

3. **For each scenario below,** use MCP Excel tools to apply the described mutations to the copied file. Never modify the original template file.
4. **Unless otherwise stated,** modify only 2-3 data rows per scenario.
5. **After mutation,** verify that the file is no longer identical to the template.
6. **Track mutation progress** using PowerShell commands to ensure all files have been modified.

## Scenarios (STRICTLY FOLLOW THIS LIST)

- failurereason-country-of-origin-missing: Set blank/empty values in the column matched by the exporter's `country_of_origin` property (only if exporter has country_of_origin column and validateCountryOfOrigin is true).
- failurereason-country-of-origin-invalid-format: Set values that are not 2-digit ISO codes or "X" in the column matched by the exporter's `country_of_origin` property (only if exporter has country_of_origin column and validateCountryOfOrigin is true).
- success-country-of-origin-valid-iso: Set valid 2-digit ISO country codes in the column matched by the exporter's `country_of_origin` property (only if exporter has country_of_origin column).
- success-country-of-origin-x-value: Set "X" values in the column matched by the exporter's `country_of_origin` property (only if exporter has country_of_origin column).
- failurereason-nirms-blank-value: Set blank/empty values in the column matched by the exporter's `nirms` property (only if exporter has nirms column).
- failurereason-nirms-invalid-value: Set invalid values in the column matched by the exporter's `nirms` property (only if exporter has nirms column).
- failurereason-prohibited-item: Set a combination of country_of_origin, commodity_code, and type_of_treatment values that match an entry in the prohibited items list (only if exporter has all three required fields).

## Documentation: Country of Origin, NIRMS, and Prohibited Items Scenario Types

- **failurereason-country-of-origin-missing**: Set blank/empty values in the country_of_origin column (only if exporter has country_of_origin column and validateCountryOfOrigin is true).
- **failurereason-country-of-origin-invalid-format**: Set values that are not 2-digit ISO codes or "X" in the country_of_origin column (only if exporter has country_of_origin column and validateCountryOfOrigin is true).
- **success-country-of-origin-valid-iso**: Set valid 2-digit ISO country codes in the country_of_origin column (only if exporter has country_of_origin column).
- **success-country-of-origin-x-value**: Set "X" values in the country_of_origin column (only if exporter has country_of_origin column).
- **failurereason-nirms-blank-value**: Set blank/empty values in the nirms column (only if exporter has nirms column).
- **failurereason-nirms-invalid-value**: Set invalid values in the nirms column (only if exporter has nirms column).
- **failurereason-prohibited-item**: Set a combination of country_of_origin, commodity_code, and type_of_treatment values that match an entry in the prohibited items list (only if exporter has all three required fields).

## NIRMS and Country of Origin Validation Patterns

### NIRMS Validation (for exporters with `nirms` property)
- **Valid NIRMS Values**: "Yes", "No", "Green", "Red", "NIRMS", "NON-NIRMS", "NIRMS Eligible", "Non-NIRMS", etc.
- **Invalid NIRMS Values**: "INVALID", "Maybe", "Unknown", "123", blank/empty values
- **Test Patterns**: 
  - Blank/empty cells in NIRMS column should trigger validation failure
  - Unrecognized text values should trigger validation failure

### Country of Origin Validation (for exporters with `validateCountryOfOrigin: true`)
- **Valid Country Codes**: 2-digit ISO codes ("GB", "FR", "DE", "IE", "NL", etc.) or "X"
- **Invalid Country Codes**: 3+ digit codes ("GBR", "FRA"), numeric values ("123"), text ("INVALID"), blank/empty values
- **Test Patterns**:
  - Missing/blank country of origin should trigger validation failure
  - Non-ISO format codes should trigger validation failure
  - Valid 2-digit ISO codes should pass validation
  - "X" value should pass validation (used for mixed/unknown origins)

### Prohibited Items Validation (for exporters with country_of_origin, commodity_code, and type_of_treatment fields)

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

## Conditional Scenario Planning

Based on the exporter configuration, determine which country-of-origin-related scenarios to generate:

- If the exporter has a `nirms` property, generate NIRMS scenarios.
- If the exporter has a `country_of_origin` property, generate Country of Origin success scenarios.
- If the exporter has both `country_of_origin` and `validateCountryOfOrigin: true`, generate Country of Origin validation scenarios.
- If the exporter has `country_of_origin`, `commodity_code` (from regex), and `type_of_treatment` properties, generate prohibited items scenario.

## Apply Mutations

Use MCP Excel tools to modify specific cells for each scenario:

- **NIRMS Validation**: For exporters with `nirms` property, test blank values and invalid patterns (should be recognizable values like "Yes", "No", "Green", "Red", "NIRMS", "NON-NIRMS", etc.)
- **Country of Origin Validation**: For exporters with `validateCountryOfOrigin: true`, test blank values and invalid formats (should be 2-digit ISO codes like "GB", "FR", "DE" or "X")
- **Prohibited Items**: For exporters with all required fields, select a prohibited item from services/data/data-prohibited-items.json and set the appropriate country_of_origin, commodity_code, and type_of_treatment values in the data rows

## Output
- Place all generated files in `app/packing-lists/{exporter}/test-scenarios/country-of-origin/`.
- Ensure all files have appropriate mutations applied.
