# B&M Country of Origin Validation Specification (AB#591516)

## Overview

This specification details the implementation of Country of Origin (CoO) validation for B&M retailer packing lists as part of NIRMS (Northern Ireland Retail Movement Scheme) compliance requirements. This enhancement extends the existing PLP service to provide comprehensive validation of country of origin data and Ineligible items checking.

## Business Context

**User Story**: As a caseworker, I want the Packing List Parser to help me validate Country of Origin entries on packing lists so that I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements.

**Value**: Ensures NIRMS compliance by validating country of origin information and identifying Ineligible items before they enter the Northern Ireland supply chain.

## Technical Scope

### Parser Enhancement: B&M Format Recognition

#### Header Detection

- **Country of Origin Header**: `"COUNTRY OF ORIGIN"` (Column J)
- **Location**: Identified using `/COUNTRY OF ORIGIN/i` regex in header row
- **Mapping**: Maps to `country_of_origin` field in standardized output schema

#### Blanket Statement Detection

- **NIRMS Statement**: `"This consignment contains only NIRMS eligible goods"`
  - **Detection**: Uses `regex.test()` against entire sheet data
  - **Location**: Not cell-specific - searches entire document
  - **Purpose**: When detected, sets all items to `nirms: "NIRMS"`
  - **Configuration**: `blanketNirms` object in `model-headers.js`
- **Treatment Statement**: `"Treatment type: all products are processed"`
  - **Detection**: Uses `regex.test()` against entire sheet data
  - **Purpose**: When detected, sets all items to `type_of_treatment: "Processed"`
  - **Configuration**: `blanketTreatmentType` object in `model-headers.js`

### Validation Rules Implementation

### AC1: NIRMS Statement Validation

```gherkin
Given a B&M packing list does not contain "This consignment contains only NIRMS eligible goods"
When the packing list is processed
Then the validation should fail
And the failure reason should be "NIRMS/Non-NIRMS goods not specified"
And allRequiredFieldsPresent should be false
```

### AC2: Missing CoO with NIRMS Statement Present

```gherkin
Given a B&M packing list contains "This consignment contains only NIRMS eligible goods"
And the CoO value is null for one or more items
When the packing list is processed
Then the validation should fail
And the failure reason should include "Missing Country of Origin in sheet X row Y"
```

### AC3: Invalid CoO Format

```gherkin
Given a B&M packing list contains "This consignment contains only NIRMS eligible goods"
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit codes
And the CoO value is not "X" or "x"
When the packing list is processed
Then the validation should fail
And the failure reason should include "Invalid Country of Origin ISO Code in sheet X row Y"
```

### AC4: CoO Acceptable Placeholder

```gherkin
Given a B&M packing list contains "This consignment contains only NIRMS eligible goods"
And the CoO value is "X" or "x"
When the packing list is processed
Then the validation should pass for that field
```

### AC5: Ineligible Item with Treatment Type

```gherkin
Given a B&M packing list contains "This consignment contains only NIRMS eligible goods"
And the packing list contains "Treatment type: all products are processed"
And the CoO value is valid
And the commodity code is specified
And the commodity code + CoO combination matches an item on the Ineligible list
And the Ineligible item has treatment type "processed"
When the packing list is processed
Then the validation should fail
And the failure reason should include "Ineligible item identified on the packing list in sheet X row Y"
```

### AC6: Ineligible Item without Treatment Type

```gherkin
Given a B&M packing list contains "This consignment contains only NIRMS eligible goods"
And the packing list does NOT contain "Treatment type: all products are processed"
And the CoO value is valid
And the commodity code is specified
And the commodity code + CoO combination matches an item on the Ineligible list
When the packing list is processed
Then the validation should fail
And the failure reason should include "Ineligible item identified on the packing list in sheet X row Y"
```

### AC7: Multiple Missing CoO Values

```gherkin
Given a B&M packing list has more than 3 items with missing CoO values
When the packing list is processed
Then the failure reason should be "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC8: Multiple Invalid CoO Values

```gherkin
Given a B&M packing list has more than 3 items with invalid CoO values
When the packing list is processed
Then the failure reason should be "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC9: Multiple Ineligible Items

```gherkin
Given a B&M packing list has more than 3 Ineligible items
When the packing list is processed
Then the failure reason should be "Ineligible item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

## Data Structures

### Enhanced Item Schema

```json
{
  "itemId": "uuid",
  "description": "string",
  "commodityCode": "string (10 digits)",
  "numberOfPackages": "integer",
  "totalWeight": "float",
  "countryOfOrigin": "string (ISO 2-digit code or comma-separated list or 'X')",
  "applicationId": "bigint",
  "totalWeightUnit": "string",
  "nirms": "boolean", // Set based on NIRMS statement presence
  "typeOfTreatment": "string|null", // "processed" if treatment statement present, null otherwise
  "rowLocation": "string"
}
```

### Validation Response Schema

```json
{
  "allRequiredFieldsPresent": "boolean",
  "parserModel": "BANDM",
  "registrationApprovalNumber": "string|null",
  "dispatchLocationNumber": "string|null",
  "reasonsForFailure": "string[]|null",
  "packingListContents": "Item[]"
}
```

## Implementation Requirements

### B&M Parser Integration

The CoO validation for B&M uses the standard parser architecture:

1. **Header configuration** in `model-headers.js`:

   ```javascript
   BANDM1: {
     establishmentNumber: {
       regex: /^RMS-GB-000005-\d{3}$/i,
     },
     regex: {
       description: /ITEM DESCRIPTION/i,
       commodity_code: commodityCodeRegex,
       number_of_packages: /TOTAL NUMBER OF CASES/i,
       total_net_weight_kg: netWeight,
     },
     findUnitInHeader: true,
     validateCountryOfOrigin: true,  // ✅ CoO validation enabled
     country_of_origin: /COUNTRY OF ORIGIN/i,  // ✅ CoO field mapping
     blanketNirms: {
       regex: /This consignment contains only NIRMS eligible goods/i,
       value: "NIRMS",
     },
     blanketTreatmentType: {
       regex: /Treatment type: all products are processed/i,
       value: "Processed",
     },
   }
   ```

2. **Parser uses standard `mapParser()`**:

   ```javascript
   // app/services/parsers/bandm/model1.js
   packingListContentsTemp = mapParser(
     packingListJson[sheet],
     headerRow,
     dataRow,
     headers.BANDM1, // Passes header configuration
     sheet,
   );

   return combineParser.combine(
     establishmentNumber,
     packingListContents,
     true,
     parserModel.BANDM1,
     establishmentNumbers,
     headers.BANDM1, // Passes header with validateCountryOfOrigin: true
   );
   ```

3. **Existing validation pipeline** handles CoO validation automatically:
   - `packingListValidator.validatePackingList()` checks the `validateCountryOfOrigin` flag
   - Uses existing validation utilities: `hasMissingCoO()`, `hasInvalidCoO()`, `hasMissingNirms()`, `hasInvalidNirms()`, `hasineligibleItems()`
   - Column validator applies CoO validation rules when flag is enabled

### B&M-Specific Processing

#### Blanket Statement Detection (WORKING)

- **NIRMS Statement**: `"This consignment contains only NIRMS eligible goods"`
  - **Detection**: Uses `regex.test()` against entire sheet (not cell-specific)
  - **Processing**: `mapParser()` applies `nirms: "NIRMS"` to all items when detected
  - **Configuration**: `blanketNirms` object in header configuration
- **Treatment Statement**: `"Treatment type: all products are processed"`
  - **Detection**: Uses `regex.test()` against entire sheet
  - **Processing**: `mapParser()` applies `type_of_treatment: "Processed"` to all items when detected
  - **Configuration**: `blanketTreatmentType` object in header configuration

#### Data Mapping

```javascript
// parser-map.js automatically handles B&M format
const blanketNirms = regex.test(header.blanketNirms?.regex, packingListJson)
  ? header.blanketNirms?.value
  : null;
const blanketTreatmentType = regex.test(header.blanketTreatmentType?.regex, packingListJson)
  ? header.blanketTreatmentType?.value
  : null;

// Applied to each item:
nirms: columnValue(col[headerCols.nirms]) ??
       (isNotEmpty(col, headerCols) && blanketNirms) ??
       null,
type_of_treatment: columnValue(col[headerCols.type_of_treatment]) ??
                   (isNotEmpty(col, headerCols) && blanketTreatmentType) ??
                   null,
```

### B&M-Specific Processing

#### Blanket Statement Detection (WORKING)

- **NIRMS Statement**: `"This consignment contains only NIRMS eligible goods"`
  - **Detection**: Uses `regex.test()` against entire sheet (not cell-specific)
  - **Processing**: `mapParser()` applies `nirms: "NIRMS"` to all items when detected
  - **Configuration**: `blanketNirms` object in header configuration
- **Treatment Statement**: `"Treatment type: all products are processed"`
  - **Detection**: Uses `regex.test()` against entire sheet
  - **Processing**: `mapParser()` applies `type_of_treatment: "Processed"` to all items when detected
  - **Configuration**: `blanketTreatmentType` object in header configuration

````

## Supporting Utilities

The B&M CoO validation leverages the existing validation infrastructure without requiring new utility functions:

1. **Existing Validation Pipeline**
   ```javascript
   // Uses existing utilities from packing-list-validator.js
   packingListValidator.validatePackingList(result, headers.BANDM1);
````

2. **Standard Configuration-Driven Validation**
   - **CoO Validation**: Enabled via `validateCountryOfOrigin: true` in header config
   - **Existing Utilities**: Uses `hasMissingCoO()`, `hasInvalidCoO()`, `hasineligibleItems()` functions
   - **Standard Pipeline**: No B&M-specific validation functions required

### Database Schema Updates

No database schema changes required - existing Item and PackingList models support the new validation fields.

### Test Data Requirements

1. **Happy Path Test Cases**
   - Valid ISO country codes (single and comma-separated)
   - Acceptable "X" placeholder values
   - Valid NIRMS and treatment statements

2. **Negative Test Cases**
   - Missing NIRMS statement
   - Missing CoO values
   - Invalid CoO formats
   - Ineligible items scenarios
   - Multiple error combinations

3. **Edge Cases**
   - Empty CoO fields
   - Whitespace handling
   - Case sensitivity for "X" values
   - Very long comma-separated lists

## Quality Assurance

### Test Coverage Requirements

- **Unit Tests**: 100% coverage for validation functions
- **Integration Tests**: End-to-end B&M packing list processing
- **Regression Tests**: Ensure existing B&M functionality unaffected

### Performance Considerations

- **Validation Performance**: CoO validation should add <100ms to processing time
- **Memory Usage**: Ineligible items list should be cached efficiently
- **Error Handling**: Multiple errors should be collected in single pass

### Security Considerations

- **Input Sanitization**: All CoO values must be sanitized before validation
- **Data Protection**: Country of origin data is considered trade-sensitive
- **Audit Logging**: All validation failures must be logged for compliance

## Acceptance Criteria Summary

The B&M Country of Origin Validation feature will be considered complete when:

1. ✅ NIRMS statement detection functions correctly (AC1)
2. ✅ Missing CoO values are properly identified and reported (AC2, AC4)
3. ✅ Invalid CoO formats are validated against ISO standards (AC3, AC5)
4. ✅ "X" placeholder values are accepted as valid (AC6)
5. ✅ Ineligible items are identified correctly with and without treatment statements (AC7-10)
6. ✅ Missing treatment types with null commodity codes fail appropriately (AC11)
7. ✅ Error message aggregation works for multiple occurrences
8. ✅ All validation logic integrates seamlessly with existing B&M parser
9. ✅ Performance impact is within acceptable limits
10. ✅ Test coverage meets quality standards

## Deployment Considerations

### Environment Rollout

1. **Development**: Complete unit and integration testing
2. **Test Environment**: Full regression testing with B&M test data
3. **Sandbox**: User acceptance testing with caseworkers
4. **Pre-production**: Performance and load testing
5. **Production**: Gradual rollout with monitoring

### Monitoring and Alerting

- Track validation failure rates by error type
- Monitor processing time impact
- Alert on Ineligible items detection frequency
- Track NIRMS compliance rates

### Rollback Plan

- Feature flag to disable enhanced validation if issues arise
- Ability to revert to previous B&M parser version
- Database rollback not required (no schema changes)

---

**Work Item**: AB#591516  
**Status**: Resolved (Code complete and unit tests pass)  
**Implementation**: September 2025  
**Related Work**: AB#579360 (Parent), AB#592259, AB#609383 (Follow-up tasks)
