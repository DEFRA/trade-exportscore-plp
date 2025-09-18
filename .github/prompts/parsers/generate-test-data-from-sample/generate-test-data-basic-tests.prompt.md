---
description: "Generate test data scenarios for core functionality and data validation in the basic-tests folder. Strictly follow the scenario list and mutation instructions below."
mode: "agent"
---


# Basic Tests Scenario Generation and Seeding


Generate and seed a suite of test data and Excel/CSV files for core functionality and data validation scenarios. Each scenario must be based on the provided happy path sample file, with targeted mutations as described below. All files must be placed in `test-scenarios/basic-tests/`.


# Basic Test Scenarios

_Follow the generic instructions in `generate-test-data-from-sample.prompt.md` for folder creation, copying, and mutation steps._

**IMPORTANT: Only generate scenarios if the required data/columns are present in the template.**

- If a scenario relies on a field (e.g., optional data, optional header, or a specific mandatory field) that is not present in the template, that scenario should be skipped and not generated.
- For example, if there are no optional columns in the template, do not generate any OptionalData or OptionalHeader scenarios.
- If there is no `type_of_treatment` field present, do not generate the `MandatoryHeader_TreatmentType` scenario.
- If a mandatory field is missing from both the template and the configuration, skip all scenarios that require it.

Document in the scenario folder's README which scenarios were skipped due to missing fields.

## Scenarios (CONDITIONAL GENERATION)

**Only generate a scenario if the required field/column is present in the template.**

- Happypath.xlsx: Exact copy of the input file for baseline validation.
- Missing_OptionalHeader_All_Pass.xlsx: Only generate if optional columns are present. Remove or rename all optional column headers (from root-level properties like `country_of_origin`, `nirms`, `type_of_treatment` in model-headers.js) so they do not match the original regex patterns.
- Missing_OptionalData_All_Pass.xlsx: Only generate if optional columns are present. Clear all data in optional columns while preserving headers.
- Incorrect_OptionalData_All_Pass.xlsx: Only generate if optional columns are present. Insert invalid/incorrect data in all optional columns.
- Incorrect_OptionalHeader_All_Pass.xlsx: Only generate if optional columns are present. Modify optional column headers to incorrect but non-matching values.
- OnlyMandatoryDataIsFilled_Pass.xlsx: Only generate if optional columns are present. Clear all optional data while keeping mandatory data intact.
- DescriptionHasDoubleQuotesShould_Pass.xlsx: Add double quotes to description field data to test special character handling.
- MandatoryHeaders_CaseInSensitive_Pass.xlsx: Change the case of mandatory headers to test case/formatting variations.
- Incorrect_Mandatatypes_Excl_netandNopkgs_ProductCode_Pass.xlsx: Insert non-standard data types in non-critical mandatory fields excluding net weight and number of packages.
- Incorrect_MandatoryHeader_CommodityCode_Unparse.xlsx: Only generate if commodity_code field is present. Remove the header name for the commodity_code column.
- Incorrect_MandatoryHeader_All_Unparse.xlsx: Remove ALL mandatory header names.
- Incorrect_MandatoryHeader_Desc_Unparse.xlsx: Only generate if description field is present. Remove the header name for the description column.
- Incorrect_MandatoryHeader_TotNetweight_Unparse.xlsx: Only generate if total_net_weight_kg field is present. Remove the header name for the total_net_weight_kg column.
- Incorrect_MandatoryHeader_NoofPakgs_Unparse.xlsx: Only generate if number_of_packages field is present. Remove the header name for the number_of_packages column.
- Incorrect_MandatoryHeader_TreatmentType_Unparse.xlsx: Only generate if type_of_treatment field is present. Remove the header name for the type_of_treatment column.
- Incorrect_MandatoryHeader_CommodityCode_Unparse.xlsx: Only generate if commodity_code field is present. Alternative test for commodity code header removal.
- Incorrect_MandatoryHeader_TotNetweightKGS_Fail.xlsx: Only generate if total_net_weight_kg field is present. Modify the net weight header to use different unit terminology that doesn't match the regex.
- Empty_MultipleRowsColumns_Pass.xlsx: Include empty rows in the data section while maintaining valid structure.
- Missing_MandatoryHeader_All_Unparse.xlsx: Remove ALL mandatory header names completely.
- Missing_MandatoryHeader_Description_unparse.xlsx: Only generate if description field is present. Remove only the description header.
- Missing_MandatoryHeader_CommodityCode_Unparse.xlsx: Only generate if commodity_code field is present. Remove only the commodity code header.
- Missing_MandatoryHeader_NoofPacakges_Unparse.xlsx: Only generate if number_of_packages field is present. Remove only the number of packages header.
- Missing_MandatoryHeader_TotNetWeight_Unparse.xlsx: Only generate if total_net_weight_kg field is present. Remove only the total net weight header.
- Incorrect_MandatoryData_MultipleRowsWithMultipleLocations_All_Fail.xlsx: Insert invalid data types in mandatory fields across multiple rows and locations.
- Missing_MandatoryData_MultipleRowsWithMultipleLocations_All_Fail.xlsx: Clear mandatory data across multiple rows and locations.
- Missing_MandatoryData_CommodityCode_Fail.xlsx: Only generate if commodity_code field is present. Clear commodity code data in multiple rows.
- Missing_MandatoryData_CommodityCode_Nature_Fail.xlsx: Only generate if commodity_code and nature_of_products fields are present. Clear both commodity code and nature of products data.
- Missing_MandatoryData_Desc_Fail.xlsx: Only generate if description field is present. Clear description data in multiple rows.
- Missing_MandatoryData_Noofpkgs_Fail.xlsx: Only generate if number_of_packages field is present. Clear number of packages data in multiple rows.
- Missing_MandatoryData_Totnetweight_Fail.xlsx: Only generate if total_net_weight_kg field is present. Clear total net weight data in multiple rows.
- AllMandatoryDataIsMissing_Fail.xlsx: Clear ALL mandatory data while keeping headers.
- NoData_ExceptSingleRMS_Fail.xlsx: Remove all data rows except establishment number information.
- InvalidCommodityCode_MultipleRows_Fail.xlsx: Only generate if commodity_code field is present. Insert invalid commodity code formats across multiple rows.

**You must generate and mutate all scenarios above, if the required fields are present.**
