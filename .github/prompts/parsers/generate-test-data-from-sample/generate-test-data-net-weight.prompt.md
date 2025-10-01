---
description: "Generate test data scenarios for net weight validation in the net-weight folder. Strictly follow the scenario list and mutation instructions below."
mode: "agent"
---


# Net Weight Test Scenarios

_Follow the generic instructions in `generate-test-data-from-sample.prompt.md` for folder creation, copying, and mutation steps._

## Scenarios

- **Alpha_Numeric_TotalNetWeight_Unparse**: Set total net weight to an alphanumeric value (e.g. 'Net We1ght').
- **Alpha_Numeric_UOM_Weight**: Set the unit of measure to an alphanumeric value (e.g. 'K9G').
- **Ambiguous_Units_in_Header_Pass**: Use ambiguous units in the header (e.g. 'Total Net Weight (Lbs/KGLbs)').
- **Data_empty_Netweight_Fail**: Leave total net weight cells empty.
- **Data_empty_NetweightUOM**: Leave unit of measure cells empty.
- **Extra_Spaces_In_Header_Unparse**: Add extra spaces in the net weight header (e.g. 'Total  Net  Weight').
- **Happypath**: No mutation; copy the original happy path file.
- **Header_Typos_or_SpecialCharacters_Unparse**: Introduce typos or special characters in the net weight header (e.g. 'Tot@l Net We!ght').
- **Header_With_Extra_Parentheses_Pass**: Add extra parentheses in the net weight header (e.g. 'Total Net Weight (KG) ()').
- **Header_With_Multiple_Units**: Add multiple units in the header (e.g. 'Total Net Weight (KG/LB)').
- **Header_With_Unit_And_Symbols_Pass**: Add symbols to the unit in the header (e.g. 'Total Net Weight (KG*)').
- **Incorrect_NetweightData_All_Fail**: Set all net weight data to invalid values (e.g. 'abc', '-1', '9999999999').
- **Invalid_Unit_Type_Fail**: Set unit of measure to an invalid type (e.g. 'LBS' if only 'KG' is valid).
- **Malformed_Header_Unit_Pass**: Malform the unit in the header (e.g. 'Total Net Weight (K-G)').
- **Missing_Header_Netweight_Unparse**: **Remove (clear/empty)** the net weight header column completely.
- **Missing_Header_NetweightUOM**: **Remove (clear/empty)** the unit of measure header column completely.
- **Missing_Paranthesis_in_Uom_Pass**: Remove parentheses from the unit in the header (e.g. 'Total Net Weight KG').
- **Missing_UOM_Weight_Fail**: Remove all unit of measure data.
- **MissingNetweightUOM_excludeKG**: Remove the unit of measure column if it only contains 'KG'.
- **MixedCase_Header_Pass**: Change the net weight header to mixed case (e.g. 'ToTal nEt WeIGHt').
- **MixedUnits_And_Casing_Pass**: Use mixed units and casing in the unit of measure data (e.g. 'Kg', 'kG', 'KG').
- **Netweight_HasEmpty_Parentheses_Fail**: Use empty parentheses in the header (e.g. 'Total Net Weight ()').
- **Splcharacters_Header_Netweight_Unparse**: Add special characters to the net weight header (e.g. 'Total Net Weight #$%').
- **TotalNetWeight_Without_UOMWeight**: Remove the unit of measure from the header (e.g. 'Total Net Weight').
- **Unit_Missing_Weight_Present_Fail**: Remove unit of measure data but keep net weight data.
- **UOMWeight_Without_TotalNetWeight_Unparse**: Remove the net weight column but keep the unit of measure column.
- **Valid_Unit_KG_Parentheses**: Use 'KG' in parentheses in the header (e.g. 'Total Net Weight (KG)').
- **Zero_Data_TotalNetWeight_Pass**: Set total net weight data to zero.
- **Zero_Data_UOM**: Set unit of measure data to zero.

**You must generate and mutate all 29 scenarios above.**

## Mutation Scope Guidelines

- **Missing vs Modification Scenarios**:
  - **"Missing_Header"**: **Remove/clear** headers completely (empty cells)
  - **Other header scenarios**: **Modify** headers with typos, extra characters, etc.
- **Standard scenarios**: Modify exactly **2-3 data rows** unless scenario specifies otherwise
- **Header scenarios**: Modify header row only, leave data rows unchanged
- **Data scenarios**: Modify exactly **2-3 data rows**, preserve header and remaining rows
- **"All" scenarios**: Modify **all data rows** when explicitly stated (e.g., "All_Fail")
- **Preserve remaining rows**: All other data rows should remain unchanged from the template
- **Do not modify all rows**: Only change the specified number of rows per scenario, not entire columns
- **Baseline scenario**: `Happypath` should remain completely unmodified

## Output
- Place all generated files in `app/packing-lists/{exporter}/test-scenarios/net-weight/`.
- Ensure all files have appropriate mutations applied.
