# ASDA 3 Country of Origin Validation Specification

**Document Version:** 1.0  
**Date:** September 11, 2025  
**Status:** Draft  
**Related Work Items:** AB#591514  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for ASDA 3 trader packing lists within the DEFRA trade-exportscore-plp service. The validation ensures NIRMS compliance and prohibited item checking for ASDA 3-specific Excel format.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on ASDA 3 packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect relevant CoO fields from ASDA 3 trader format
- Provide basic validation for Country of Origin compliance
- Enforce NIRMS scheme validation rules
- Check against prohibited items list
- Generate comprehensive error messages with location details

## ASDA 3 Trader Format Specification

### Column Mapping

The ASDA 3 packing list uses the following column structure:

- **Column C:** 'NIRMs/Non-NIRMs' - NIRMS classification values
- **Column E:** 'Treatment Type' - Treatment type information
- **Column M:** 'Commodity Code' - Product commodity codes
- **Column N:** 'Country of Origin' - Country of Origin values

### NIRMS Value Mapping

**ASDA 3 follows the standard NIRMS values as defined in AB#592259:**

**True Values (NIRMS = Yes, case insensitive):**

- Yes | NIRMS | Green | Y | G

**False Values (NIRMS = No, case insensitive):**

- No | Non-NIRMS | Non NIRMS | Red | N | R

## Acceptance Criteria

### AC1: NOT within NIRMS Scheme

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a False value below (case insensitive):
  • No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will pass
```

### AC2: Null NIRMS value

```gherkin
Given an ASDA 3 packing list item has no NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

### AC3: Invalid NIRMS value

```gherkin
Given an ASDA 3 packing list item doesn't contain a NIRMS value in the 'NIRMs/Non-NIRMs' column [column C] specified in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y"
```

### AC4: Null NIRMS value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that have no NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC5: Invalid NIRMS value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that don't have a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C] in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC6: Null CoO Value

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

### AC7: Invalid CoO Value

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is not a valid ISO 2-digit country code in the 'Country of Origin' column [column N]
And the CoO value is not a comma-separated list of valid ISO 2-digit country code in the 'Country of Origin' column [column N]
And the CoO value is not X or x in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

### AC8: Null CoO Value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC9: Invalid CoO Value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is not a valid ISO 2-digit country code in the 'Country of Origin' column [column N]
And the CoO value is not a comma-separated list of valid ISO 2-digit country code in the 'Country of Origin' column [column N]
And the CoO value is not X or x in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC10: CoO Value is X or x

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below:
  • Yes | NIRMS | Green | Y | G
And the CoO value is X or x in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will pass
```

### AC11: Item Present on Prohibited Item List (Treatment Type specified)

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column M]
And the treatment type is specified in the 'Treatment Type' column [column E]
And the commodity code starts with and CoO, and treatment type matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

### AC12: Item Present on Prohibited Item List, more than 3 (Treatment Type specified)

```gherkin
Given an ASDA 3 packing list have more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column M]
And the treatment type is specified in the 'Treatment Type' column [column E]
And the commodity code starts with, and CoO, and treatment type matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC13: Item Present on Prohibited Item List (no Treatment Type specified)

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column M]
And treatment type is not specified (null) in the 'Treatment Type' column [column E]
And the commodity code starts with, and CoO matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

### AC14: Item Present on Prohibited Item List, more than 3 (no Treatment Type specified)

```gherkin
Given an ASDA 3 packing list have more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column M]
And treatment type is not specified (null) in the 'Treatment Type' column [column E]
And the commodity code starts with, and CoO matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

## Technical Implementation

### ASDA 3 Parser Integration

The CoO validation will be integrated into the existing parser pipeline using the configuration-driven approach:

1. **Header configuration** in `model-headers.js`:

   ```javascript
   ASDA3: {
     establishmentNumber: /existing regex/,
     fieldMapping: {
       // ... existing mappings ...
       nirms: /nirms.?non.?nirms|nirms|column.?c/i,         // Column C: NIRMs/Non-NIRMs
       type_of_treatment: /treatment.?type|column.?e/i,      // Column E: Treatment Type
       country_of_origin: /country.?of.?origin|column.?n/i,  // Column N: Country of Origin
       commodity_code: /commodity.?code|column.?m/i          // Column M: Commodity Code
     },
     validateCountryOfOrigin: true
   }
   ```

2. **Parser passes header object** to `combineParser.combine()`:

   ```javascript
   return combineParser.combine(
     packingListContents,
     establishmentNumbers,
     "ASDA3",
     headers, // Pass header configuration including validateCountryOfOrigin flag
   );
   ```

3. **Existing validation pipeline** handles CoO validation automatically:
   - `packingListValidator.validatePackingList()` checks the `validateCountryOfOrigin` flag
   - Uses existing validation utilities: `hasMissingCoO()`, `hasInvalidCoO()`, `hasMissingNirms()`, `hasInvalidNirms()`, `hasProhibitedItems()`
   - Column validator applies CoO validation rules when flag is enabled

#### ASDA 3 NIRMS Value Mapping

ASDA 3 uses the full standard NIRMS values that are supported by existing validation:

- **Standard True Values:** Yes | NIRMS | Green | Y | G → Maps to existing `isNirms()`
- **Standard False Values:** No | Non-NIRMS | Non NIRMS | Red | N | R → Maps to existing `isNotNirms()`

### Implementation Details

#### Error Collection and Validation

```javascript
function validateAsda3PackingList(packingListData) {
  const errors = {
    nullNirms: [],
    invalidNirms: [],
    nullCoo: [],
    invalidCoo: [],
    prohibitedItems: [],
  };

  packingListData.forEach((item, index) => {
    const standardItem = mapAsda3DataToStandardFormat(item);
    const location = `sheet ${item._sheetName || "Sheet1"} row ${index + 2}`;

    // Use existing generic validation utilities
    if (hasMissingNirms(standardItem)) {
      errors.nullNirms.push({ location });
    } else if (hasInvalidNirms(standardItem)) {
      errors.invalidNirms.push({ location, value: standardItem.nirms });
    }

    if (hasMissingCoO(standardItem)) {
      errors.nullCoo.push({ location });
    } else if (hasInvalidCoO(standardItem)) {
      errors.invalidCoo.push({
        location,
        value: standardItem.country_of_origin,
      });
    }

    if (hasProhibitedItems(standardItem)) {
      errors.prohibitedItems.push({ location });
    }
  });

  return generateErrorMessages(errors);
}
```

### Error Aggregation and Reporting

#### Error Message Generation using Generic Utilities

```javascript
const {
  generateAggregatedErrorMessage,
} = require("../../utilities/error-utils");

function generateAsda3ErrorMessages(errors) {
  const messages = [];

  // Use existing error message patterns
  if (errors.nullNirms.length > 0) {
    messages.push(
      ...generateAggregatedErrorMessage(
        errors.nullNirms,
        "NIRMS/Non-NIRMS goods not specified in",
      ),
    );
  }

  if (errors.invalidNirms.length > 0) {
    messages.push(
      ...generateAggregatedErrorMessage(
        errors.invalidNirms,
        "Invalid entry for NIRMS/Non-NIRMS goods in",
      ),
    );
  }

  if (errors.nullCoo.length > 0) {
    messages.push(
      ...generateAggregatedErrorMessage(
        errors.nullCoo,
        "Missing Country of Origin in",
      ),
    );
  }

  if (errors.invalidCoo.length > 0) {
    messages.push(
      ...generateAggregatedErrorMessage(
        errors.invalidCoo,
        "Invalid Country of Origin ISO Code in",
      ),
    );
  }

  if (errors.prohibitedItems.length > 0) {
    messages.push(
      ...generateAggregatedErrorMessage(
        errors.prohibitedItems,
        "Prohibited item identified on the packing list in",
      ),
    );
  }

  return {
    isValid: messages.length === 0,
    errors: messages,
  };
}
```

### ASDA 3 Parser Integration Points

#### Parser Registration

```javascript
// ASDA 3 parser integration using existing validation utilities
if (matchedRetailer === "ASDA3") {
  // Map ASDA 3 format to standard format for existing validation utilities
  const standardFormatData = packingListData.map(mapAsda3DataToStandardFormat);

  // Use existing validation pattern from other parsers
  const validationErrors = validatePackingListItems(standardFormatData);
  if (validationErrors.length > 0) {
    return combineParser.combine([], [], "VALIDATION_FAILED", validationErrors);
  }
}
```

#### Testing Strategy

```javascript
// ASDA 3-specific test cases using standard field names
const asda3TestCases = {
  validNirmsNo: {
    nirms: "No", // Maps to existing isNotNirms()
    expected: "PASS",
  },
  validNirmsYesWithValidCoo: {
    nirms: "Yes", // Maps to existing isNirms()
    country_of_origin: "GB", // Uses existing isInvalidCoO()
    expected: "PASS",
  },
  invalidNirmsNull: {
    nirms: null, // Uses existing hasMissingNirms()
    expected: "FAIL",
    error: "NIRMS/Non-NIRMS goods not specified",
  },
  invalidCooForNirms: {
    nirms: "Yes",
    country_of_origin: "INVALID", // Uses existing hasInvalidCoO()
    expected: "FAIL",
    error: "Invalid Country of Origin ISO Code",
  },
  validCooExceptional: {
    nirms: "Green",
    country_of_origin: "X", // Handled by existing isInvalidCoO()
    expected: "PASS",
  },
  validNirmsGreen: {
    nirms: "Green",
    country_of_origin: "FR,DE", // Comma-separated handled by isInvalidCoO()
    expected: "PASS",
  },
  validNirmsRed: {
    nirms: "Red", // Maps to existing isNotNirms()
    expected: "PASS",
  },
};
```

## Dependencies and Integration

### External Dependencies

- **ISO Country Codes List:** Validation against 2-digit ISO country codes
- **Prohibited Items List:** Reference data for prohibited item checking
- **AB#592259 Implementation:** Core validation engine and error handling

### Parser System Integration

- **Matcher Registration:** ASDA 3 format detection in matcher system
- **Column Mapping:** Integration with existing column extraction utilities
- **Error Handling:** Consistent with existing PLP error reporting patterns
- **Logging:** Comprehensive audit trail for validation decisions

## Validation and Testing

### Test Coverage Requirements

1. **NIRMS Validation:** All valid/invalid NIRMS value combinations per AB#592259
2. **CoO Validation:** ISO code validation, comma-separated lists, exceptional values
3. **Prohibited Items:** With and without treatment type specifications
4. **Error Aggregation:** Multiple errors, location reporting, message formatting
5. **Edge Cases:** Null values, empty strings, case sensitivity, whitespace handling

### Success Criteria

- All 14 acceptance criteria pass automated testing
- Error messages provide precise location information
- Performance impact minimal on existing parser throughput
- Integration maintains existing parser system stability
- Comprehensive audit logging for regulatory compliance

## Implementation Timeline

1. **Phase 1:** ASDA 3 column mapping and NIRMS validation
2. **Phase 2:** Country of Origin validation logic
3. **Phase 3:** Prohibited items checking integration
4. **Phase 4:** Error aggregation and message formatting
5. **Phase 5:** Testing and system integration
6. **Phase 6:** Documentation and deployment

---

_This specification implements AB#591514 requirements using the foundational validation rules established in AB#592259, adapted for ASDA 3 trader-specific format and business rules._
