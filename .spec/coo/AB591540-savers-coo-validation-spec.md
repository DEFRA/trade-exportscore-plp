# Savers Country of Origin Validation Specification (AB#591540)

## Overview

This specification details the implementation of Country of Origin (CoO) validation for Savers retailer packing lists, applying the comprehensive NIRMS validation business rules defined in AB#592259. This enhancement ensures that Savers packing lists undergo the same rigorous NIRMS compliance validation as other retailers in the PLP system.

## Business Context

**User Story**: As a caseworker, I want the Packing List Parser to help me validate Country of Origin entries on packing lists so that I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements.

**Value**: Extends NIRMS compliance validation to Savers packing lists, ensuring consistent regulatory compliance across all retailers and protecting the Northern Ireland supply chain.

## Technical Scope

### Savers Format Recognition

#### Header Mappings

- **NIRMS Header**: `"NIRMS / SPS Item"` [Column J]
- **Country of Origin Header**: `"Country of Origin"` [Column G]
- **Treatment Type Header**: `"Type of Treatment"` [Column L]
- **Commodity Code Header**: `"EU Commodity Code"` [Column E]

#### Data Field Mapping

```javascript
// Savers column mapping
const SAVERS_HEADERS = {
  NIRMS: "J", // NIRMS / SPS Item
  COUNTRY_OF_ORIGIN: "G", // Country of Origin
  TREATMENT_TYPE: "L", // Type of Treatment
  COMMODITY_CODE: "E", // EU Commodity Code
};
```

### NIRMS Validation Business Rules (from AB#592259)

The following acceptance criteria from AB#592259 must be applied to Savers packing lists:

### AC1: Valid NIRMS Classification

```gherkin
Given a Savers packing list item has a NIRMS value specified
And it contains a valid value in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will pass
```

### AC2: Null NIRMS Value

```gherkin
Given a Savers packing list item has no NIRMS value specified
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

### AC3: Invalid NIRMS Value

```gherkin
Given a Savers packing list item doesn't have a NIRMS value in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y"
```

### AC4: Null NIRMS Value, More Than 3

```gherkin
Given a Savers packing list has more than 3 items with no NIRMS value specified
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC5: Invalid NIRMS Value, More Than 3

```gherkin
Given a Savers packing list has more than 3 items with invalid NIRMS values not in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC6: Null CoO Value

```gherkin
Given a Savers packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

### AC7: Invalid CoO Value

```gherkin
Given a Savers packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit codes
And the CoO value is not "X" or "x"
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

### AC8: Null CoO Value, More Than 3

```gherkin
Given a Savers packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC9: Invalid CoO Value, More Than 3

```gherkin
Given a Savers packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit codes
And the CoO value is not "X" or "x"
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC10: CoO Value is Acceptable Placeholder

```gherkin
Given a Savers packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is "X" or "x"
When the packing list is submitted
Then the packing list will pass for that field
```

### AC11: Prohibited Item with Treatment Type

```gherkin
Given a Savers packing list item has NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x")
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

### AC12: Prohibited Item without Treatment Type

```gherkin
Given a Savers packing list item has NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x")
And the commodity code is specified
And the treatment type is null
And the commodity code + CoO combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

### AC13: Prohibited Item, More Than 3

```gherkin
Given a Savers packing list has more than 3 prohibited items
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

## Data Structures

### Enhanced Savers Item Schema

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
  "nirms": "boolean", // True for NIRMS items, False for Non-NIRMS
  "typeOfTreatment": "string|null", // Treatment type if specified
  "rowLocation": "string"
}
```

### NIRMS Value Mapping

The Savers format supports the full standard NIRMS mapping that is supported in the existing validation utilities:

```javascript
// Standard NIRMS values supported by existing utilities:
// isNirms() recognizes: 'yes', 'nirms', 'green', 'y', 'g'
// isNotNirms() recognizes: 'no', 'non-nirms', 'non nirms', 'red', 'n', 'r'

// For Savers parser - map to standard format
function mapSaversNirmsToStandardFormat(nirmsValue) {
  // Existing utilities handle all NIRMS value recognition
  return nirmsValue; // Pass through to existing validation utilities
}
```

## Technical Implementation

### Savers Parser Integration

The CoO validation for Savers uses the configuration-driven approach:

1. **Header configuration** in `model-headers.js`:

   ```javascript
   SAVERS: {
     establishmentNumber: /RMS-GB-\d{6}-\d{3}/,
     fieldMapping: {
       // ... existing mappings ...
       nirms: /nirms|rms/i,
       country_of_origin: /country.?of.?origin/i,
       type_of_treatment: /treatment|processed/i
     },
     validateCountryOfOrigin: true
   }
   ```

2. **Parser passes header object** to `combineParser.combine()`:

   ```javascript
   return combineParser.combine(
     packingListContents,
     establishmentNumbers,
     "SAVERS",
     headers, // Pass header configuration including validateCountryOfOrigin flag
   );
   ```

3. **Existing validation pipeline** handles CoO validation automatically:
   - `packingListValidator.validatePackingList()` checks the `validateCountryOfOrigin` flag
   - Uses existing validation utilities: `hasMissingCoO()`, `hasInvalidCoO()`, `hasMissingNirms()`, `hasInvalidNirms()`, `hasProhibitedItems()`
   - Column validator applies CoO validation rules when flag is enabled

## Technical Implementation

The validation integrates with existing infrastructure:

```javascript
function validateSaversCountryOfOrigin(cooValue, isNIRMSItem) {
  if (!isNIRMSItem) return { valid: true }; // No validation needed for non-NIRMS

  if (!cooValue) return { valid: false, error: "missing_coo" };
  if (cooValue.toLowerCase() === "x") return { valid: true };

  // Validate ISO codes (single or comma-separated)
  const codes = cooValue.split(",").map((code) => code.trim());
  const invalidCodes = codes.filter((code) => !isValidISOCode(code));

  return invalidCodes.length === 0
    ? { valid: true }
    : { valid: false, error: "invalid_coo", invalidCodes };
}
```

### Validation Engine Integration

1. **Apply AB#592259 Rules**

   - Integrate all 14 acceptance criteria validation logic
   - Ensure proper error message formatting and aggregation
   - Handle prohibited items cross-reference

2. **Error Aggregation**
   ```javascript
   function aggregateValidationErrors(errors, maxDisplay = 3) {
     const errorsByType = groupBy(errors, "type");

     return Object.entries(errorsByType).map(([type, typeErrors]) => {
       if (typeErrors.length <= maxDisplay) {
         return formatErrorMessage(type, typeErrors);
       } else {
         const displayed = typeErrors.slice(0, maxDisplay);
         const remaining = typeErrors.length - maxDisplay;
         return formatErrorMessage(type, displayed, remaining);
       }
     });
   }
   ```

### Prohibited Items Integration

1. **Load Prohibited Items List**

   - Reference: "Prohibited Items List V.1.3 (NILT).xlsx" from AB#592259
   - Cache prohibited items for efficient lookup
   - Support commodity code prefix matching + CoO + treatment type

2. **Cross-Reference Logic**
   ```javascript
   function checkProhibitedItems(
     commodityCode,
     countryOfOrigin,
     treatmentType,
   ) {
     const potentialMatches = prohibitedItemsList.filter(
       (item) =>
         commodityCode.startsWith(item.commodityPrefix) &&
         item.countries.includes(countryOfOrigin),
     );

     const exactMatch = potentialMatches.find((item) => {
       // If treatment type is specified in prohibited list, it must match
       // If not specified in prohibited list, any treatment (or null) matches
       return !item.treatmentType || item.treatmentType === treatmentType;
     });

     return exactMatch
       ? { prohibited: true, item: exactMatch }
       : { prohibited: false };
   }
   ```

## Test Data Requirements

### Positive Test Cases

1. **Valid Non-NIRMS Items** - Various "No", "Non-NIRMS", "Red", "N", "R" values
2. **Valid NIRMS Items** - "Yes", "NIRMS", "Green", "Y", "G" with valid CoO
3. **Valid CoO Formats** - Single ISO codes, comma-separated lists, "X" placeholders
4. **Treatment Type Scenarios** - Items with and without treatment types

### Negative Test Cases

1. **Missing NIRMS Values** - Null/empty NIRMS fields
2. **Invalid NIRMS Values** - Values not in accepted list
3. **Missing CoO for NIRMS** - NIRMS items without country of origin
4. **Invalid CoO Formats** - Non-ISO codes, invalid formats
5. **Prohibited Items** - Items matching prohibited list with various treatment combinations

### Error Aggregation Test Cases

1. **Multiple Errors (≤3)** - Standard error message format
2. **Multiple Errors (>3)** - Aggregated error message with "in addition to Z other locations"
3. **Mixed Error Types** - Combination of NIRMS, CoO, and prohibited item errors

## Quality Assurance

### Test Coverage Requirements

- **Unit Tests**: 100% coverage for all validation functions
- **Integration Tests**: End-to-end Savers packing list processing with all 14 rule scenarios
- **Regression Tests**: Ensure existing Savers functionality unaffected
- **Performance Tests**: Validation should add <200ms to processing time

### Compliance Validation

- **Business Rules**: All 14 acceptance criteria from AB#592259
- **Error Messages**: Exact error message formats as specified
- **Case Sensitivity**: Proper case-insensitive handling for NIRMS values
- **ISO Code Validation**: Integration with current ISO country code validation

### Data Integrity

- **Prohibited Items Sync**: Regular updates from latest prohibited items list
- **CoO Code Updates**: Maintain current ISO 2-digit country code list
- **Treatment Type Standardization**: Consistent treatment type values

## Acceptance Criteria Summary

The Savers Country of Origin Validation feature will be considered complete when:

1. ✅ **AC1**: Non-NIRMS items pass without CoO validation (AB#592259-AC1)
2. ✅ **AC2**: Null NIRMS values fail with specific error message (AB#592259-AC2)
3. ✅ **AC3**: Invalid NIRMS values fail with specific error message (AB#592259-AC3)
4. ✅ **AC4-5**: Multiple NIRMS errors aggregate properly (AB#592259-AC4,5)
5. ✅ **AC6**: Missing CoO for NIRMS items fails appropriately (AB#592259-AC6)
6. ✅ **AC7**: Invalid CoO formats fail with ISO validation (AB#592259-AC7)
7. ✅ **AC8-9**: Multiple CoO errors aggregate properly (AB#592259-AC8,9)
8. ✅ **AC10**: "X"/"x" CoO placeholders are accepted (AB#592259-AC10)
9. ✅ **AC11-12**: Prohibited items with treatment types fail (AB#592259-AC11,12)
10. ✅ **AC13-14**: Prohibited items without treatment types fail (AB#592259-AC13,14)
11. ✅ All validation integrates seamlessly with existing Savers parser
12. ✅ Performance impact within acceptable limits (<200ms)
13. ✅ Test coverage meets quality standards (100% unit test coverage)

## Deployment Considerations

### Environment Rollout

1. **Development**: Complete implementation with all 14 business rules
2. **Test Environment**: Full regression testing with comprehensive Savers test data
3. **Sandbox**: Business validation with actual Savers packing lists
4. **Pre-production**: Performance testing under load
5. **Production**: Phased rollout with monitoring

### Monitoring and Alerting

- Track NIRMS vs Non-NIRMS item ratios for Savers
- Monitor CoO validation failure rates by error type
- Alert on prohibited items detection for Savers
- Track processing time impact

### Documentation Updates

- Update API documentation with Savers CoO validation capabilities
- Update business rules documentation referencing AB#592259
- Create operator guides for new error messages
- Update troubleshooting guides

---

**Work Item**: AB#591540  
**Related Business Rules**: AB#592259 (14 Acceptance Criteria)  
**Status**: Resolved (Code complete and unit tests pass)  
**Implementation**: September 2025  
**Dependencies**: AB#592259 validation engine, Prohibited Items List V.1.3
