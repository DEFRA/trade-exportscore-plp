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

- **ac1_NotNirms_Pass**: Set NIRMS column to a valid non-NIRMS value (e.g. "NON-NIRMS" or "No") for 2-3 data rows.
- **ac2_NullNirms_Fail**: Set NIRMS column to blank/empty for 2-3 data rows.
- **ac3_InvalidNirms_Fail**: Set NIRMS column to invalid values (e.g. "INVALID", "123", "Maybe") for 2-3 data rows.
- **ac4_NullNirmsMultiple_Fail**: Set NIRMS column to blank/empty for multiple data rows (at least 3).
- **ac5_InvalidNirmsMultiple_Fail**: Set NIRMS column to different invalid values for multiple data rows.
- **ac6_NullCoO_Fail**: Set country_of_origin column to blank/empty for 2-3 data rows.
- **ac7_InvalidCoO_Fail**: Set country_of_origin column to invalid values (e.g. "123", "GBR", "INVALID") for 2-3 data rows.
- **ac8_NullCoOMultiple_Fail**: Set country_of_origin column to blank/empty for multiple data rows (at least 3).
- **ac9_InvalidCoOMultiple_Fail**: Set country_of_origin column to different invalid values for multiple data rows.
- **ac10_xCoO_Pass**: Set country_of_origin column to "X" for 2-3 data rows.
- **ac11_HighRiskCoOTreatmentTypeSpecified_Fail**: Set country_of_origin to a high-risk value and type_of_treatment to a specified value that should fail validation.
- **ac12_HighRiskCoOTreatmentTypeSpecifiedMultiple_Fail**: Set multiple rows with high-risk country_of_origin and specified type_of_treatment values that should fail validation.
- **ac13_HighRiskCoOTreatmentTypeNotSpecified_Fail**: Set country_of_origin to a high-risk value and leave type_of_treatment blank or not specified for 2-3 data rows.
- **ac14_HighRiskCoOTreatmentTypeNotSpecified_COO_InvalidMultiple_Fail**: Set multiple rows with high-risk country_of_origin, missing type_of_treatment, and invalid country_of_origin values.
- **ac14_HighRiskCoOTreatmentTypeNotSpecifiedMultiple_Fail**: Set multiple rows with high-risk country_of_origin and missing type_of_treatment.
- **Happypath**: No mutation; copy the original happy path file.

**You must generate and mutate all scenarios above.**


## Documentation: Country of Origin, NIRMS, and High-Risk/Prohibited Items Scenario Types

- **ac1_NotNirms_Pass**: NIRMS column set to a valid non-NIRMS value (e.g. "NON-NIRMS" or "No"). Should pass validation.
- **ac2_NullNirms_Fail**: NIRMS column set to blank/empty. Should fail validation.
- **ac3_InvalidNirms_Fail**: NIRMS column set to invalid values (e.g. "INVALID", "123", "Maybe"). Should fail validation.
- **ac4_NullNirmsMultiple_Fail**: NIRMS column set to blank/empty for multiple rows. Should fail validation for all.
- **ac5_InvalidNirmsMultiple_Fail**: NIRMS column set to different invalid values for multiple rows. Should fail validation for all.
- **ac6_NullCoO_Fail**: country_of_origin column set to blank/empty. Should fail validation.
- **ac7_InvalidCoO_Fail**: country_of_origin column set to invalid values (e.g. "123", "GBR", "INVALID"). Should fail validation.
- **ac8_NullCoOMultiple_Fail**: country_of_origin column set to blank/empty for multiple rows. Should fail validation for all.
- **ac9_InvalidCoOMultiple_Fail**: country_of_origin column set to different invalid values for multiple rows. Should fail validation for all.
- **ac10_xCoO_Pass**: country_of_origin column set to "X". Should pass validation.
- **ac11_HighRiskCoOTreatmentTypeSpecified_Fail**: country_of_origin set to a high-risk value and type_of_treatment to a specified value that should fail validation (e.g. prohibited combination).
- **ac12_HighRiskCoOTreatmentTypeSpecifiedMultiple_Fail**: Multiple rows with high-risk country_of_origin and specified type_of_treatment values that should fail validation.
- **ac13_HighRiskCoOTreatmentTypeNotSpecified_Fail**: country_of_origin set to a high-risk value and type_of_treatment left blank or not specified. Should fail validation.
- **ac14_HighRiskCoOTreatmentTypeNotSpecified_COO_InvalidMultiple_Fail**: Multiple rows with high-risk country_of_origin, missing type_of_treatment, and invalid country_of_origin values. Should fail validation for all.
- **ac14_HighRiskCoOTreatmentTypeNotSpecifiedMultiple_Fail**: Multiple rows with high-risk country_of_origin and missing type_of_treatment. Should fail validation for all.
- **Happypath**: No mutation; copy the original happy path file. Should pass validation.

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
