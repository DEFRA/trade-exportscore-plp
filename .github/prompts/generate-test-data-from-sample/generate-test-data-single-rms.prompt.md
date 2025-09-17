---
description: "Generate test data scenarios for establishment number validation in the single-rms folder. Strictly follow the scenario list and mutation instructions below."
mode: "agent"
---


# Single RMS Tests Scenario Generation and Seeding

Generate and seed test data and Excel/CSV files for establishment number validation scenarios. Each scenario must be based on the provided happy path sample file, with targeted mutations as described below. All files must be placed in `test-scenarios/single-rms/`.


## Instructions to Create Folders, Copy, and Seed Data

1. **Create the scenario folder** (if it does not exist):

	```powershell
	New-Item -ItemType Directory -Path "app/packing-lists/{exporter}/test-scenarios/single-rms" -Force
	```

2. **Copy the happy path sample file** to each scenario filename in `app/packing-lists/{exporter}/test-scenarios/single-rms/` using PowerShell or CLI. Do not create blank files from scratch. Example:

	```powershell
	Copy-Item "app/packing-lists/{exporter}/HappyPath.xlsx" "app/packing-lists/{exporter}/test-scenarios/single-rms/norms-missing-establishment-number.xlsx"
	# Repeat for each scenario file listed below...
	```

3. **For each scenario below,** use MCP Excel tools to apply the described mutations to the copied file. Never modify the original template file.
4. **For per-row establishment number patterns,** modify ALL data rows. For single per sheet, modify only the header/company area.
5. **After mutation,** verify that the file is no longer identical to the template.
6. **Track mutation progress** using PowerShell commands to ensure all files have been modified.


## Scenarios (GENERATE USING FILENAME AND MUTATION INSTRUCTIONS)

For each scenario below, generate a file named `{ScenarioName}.xlsx` and mutate the establishment number(s) in all data rows as described:

- **Happypath**: No mutation; copy the original happy path file.
- **RMSHasWrongFinal3DigitsShould_Pass**: Change the last 3 digits of the RMS number (e.g. RMS-GB-000015-666)
- **LowercaseAndMalformedPrefixInEstablishmentNumber_Pass**: Use lowercase and malformed prefix (e.g. rms-gb-000015-010)
- **MixedCaseEstablishmentNumberFormat_Pass**: Use mixed case (e.g. Rms-Gb-000015-010)
- **MultipleGBEstablishmentNumbersWithValid_InvalidLength_Pass**: Use two RMS numbers, one valid, one with invalid length (e.g. RMS-GB-000015-7865432,RMS-GB-000015-010)
- **DifferentCountryEstablishmentNumbersIncludingGB_Pass**: Use two RMS numbers, one with a different country code, one GB (e.g. RMS-US-000015-010,RMS-GB-000015-010)
- **DifferentCountryEstablishmentNumbersexcludesGB_Pass**: Use only a non-GB RMS number (e.g. RMS-US-000015-010)
- **MixedValidAndInvalidEstablishmentFormats_Pass**: Use one valid and one invalid format (e.g. RMSGB000015010,RMS-GB-000015-010)
- **RMSHasWrongMiddle6DigitsShouldBe_Unparse**: Change the middle 6 digits (e.g. RMS-GB-234515-010)
- **InvalidFormat_RmsGb_000000_000_Unparse**: Use all zeros (e.g. RMS-GB-000000-000)
- **RMSHasWrongRegexWithAdditionalHyphenShouldBe_Fail**: Double the hyphens (e.g. RMS--GB--000015--010)
- **InvalidEstablishmentFormats_Fail**: Remove all hyphens (e.g. RMSGB000015010)
- **Malformed_RMS_Number_Fail**: Add -extra to the end (e.g. RMS-GB-000015-010-extra)
- **Multipledifferent_Establishment_Numbers_Fail**: Use two different valid RMS numbers (e.g. RMS-GB-000015-010,RMS-GB-000015-211)
- **RMSWithExtraDashBeforeEstablishmentNumberShould_Fail**: Add an extra dash at the start (e.g. -RMS-GB-000015-010)
- **RMSWith7DigitsShould_Fail**: Use 7 digits at the end (e.g. RMS-GB-000015-7865432)
- **InvalidPrefixInEstablishmentNumber_Fail**: Use an invalid prefix (e.g. ARMS-GB-000015-010)
- **MalformedCountryCodeInEstablishmentNumber_Fail**: Use malformed country code (e.g. RMS-AGB-000015-010)
- **NonNumericAttheEndOfRMS_Fail**: Use non-numeric at the end (e.g. RMS-GB-000015-aaa)
- **TC_InvalidFormat_WithSpacesAndHyphens_Fail**: Add spaces and hyphens (e.g. RMS - G B - 00 0014-010)
- **Test_ValidInput_RmsGb_WithoutHyphens_Fail**: Remove all hyphens and spaces (e.g. RMSGB000014010)
- **Empty_RMS_Fail**: Remove the RMS number entirely (all data rows blank)
- **TC_InvalidFormat_RmsGb_15_10_Fail**: Use short format (e.g. RMS-GB-15-10)
- **RMSWithExtraDashEstablishmentNumberAtStartandEnd_Fail**: Add extra dash at start and end (e.g. -RMS-GB-000015-010-)

For each scenario, mutate the establishment number(s) in all data rows to match the described pattern. If multiple RMS numbers are listed, set them in consecutive rows. If the scenario is for an empty RMS, clear the establishment number in all data rows. If the value is malformed, use it as-is. Document the expected result and failure reason in the scenario folder's README for traceability.

## Documentation: Single RMS Scenario Types

Each scenario is named after its output filename (e.g. `RMSHasWrongFinal3DigitsShould_Pass.xlsx`).

- The RMS number(s) in all data rows are mutated according to the scenario description in the scenario list above.
- If multiple RMS numbers are listed, set them in consecutive rows.
- If the scenario is for an empty RMS, clear the establishment number in all data rows.
- If the value is malformed, use it as-is.

For each scenario, document the following in the scenario folder's README:
- **Scenario Filename**
- **Mutation Applied** (how the RMS number(s) were changed)
- **Expected Result** (e.g. Pass, Fail, Unparse)
- **Failure Reason** (if applicable)

This ensures traceability between the test data, the mutation applied, and the expected parser behavior.

## Output
- Place all generated files in `app/packing-lists/{exporter}/test-scenarios/single-rms/`.
- Ensure all files have appropriate mutations applied.
