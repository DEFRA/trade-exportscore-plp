# Mars Country of Origin Validation Specification

**Document Version:** 1.0  
**Date:** September 11, 2025  
**Status:** Draft  
**Related Work Items:** AB#599300  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for Mars trader packing lists within the DEFRA trade-exportscore-plp service. The validation ensures NIRMS compliance and prohibited item checking for Mars-specific Excel format.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on Mars packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect relevant CoO fields from Mars trader format
- Provide basic validation for Country of Origin compliance
- Enforce NIRMS scheme validation rules
- Check against prohibited items list
- Generate comprehensive error messages with location details

## Mars Trader Format Specification

### Column Mapping

The Mars packing list uses the following column structure:

- **Column C:** 'Type of Treatment' - Treatment type information
- **Column I:** 'Commodity Code' - Product commodity codes
- **Column J:** 'Country Code' - Country of Origin values
- **Column M:** 'SPS' - NIRMS classification values

### NIRMS Value Mapping

**Mars-specific True Values (NIRMS = Yes):**

- Green (case insensitive)

**Mars-specific False Values (NIRMS = No):**

- Red (case insensitive)

## Acceptance Criteria

### AC1: NOT within NIRMS Scheme

```gherkin
Given a Mars packing list item has a NIRMS value specified in the 'SPS' column [column M]
And it contains a False value below (case insensitive):
  • Red
When the packing list is submitted
Then the packing list will pass
```

### AC2: Null NIRMS value

```gherkin
Given a Mars packing list item has no NIRMS value specified in the 'SPS' column [column M]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

### AC3: Invalid NIRMS value

```gherkin
Given a Mars packing list item doesn't contain a NIRMS value in the 'SPS' column [column M] specified in the following (case insensitive):
  • Green | Red
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y"
```

### AC4: Null NIRMS value, more than 3

```gherkin
Given a Mars packing list has more than 3 items that have no NIRMS value specified in the 'SPS' column [column M]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC5: Invalid NIRMS value, more than 3

```gherkin
Given a Mars packing list has more than 3 items that don't have a NIRMS value specified in the 'SPS' column [column M] in the following (case insensitive):
  • Green | Red
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC6: Null CoO Value

```gherkin
Given a Mars packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is null in the 'Country Code' column [column J]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

### AC7: Invalid CoO Value

```gherkin
Given a Mars packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is not a valid ISO 2-digit country code in the 'Country Code' column [column J]
And the CoO value is not a comma-separated list of valid ISO 2-digit country code in the 'Country Code' column [column J]
And the CoO value is not X or x in the 'Country Code' column [column J]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

### AC8: Null CoO Value, more than 3

```gherkin
Given a Mars packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is null in the 'Country Code' column [column J]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC9: Invalid CoO Value, more than 3

```gherkin
Given a Mars packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is not a valid ISO 2-digit country code in the 'Country Code' column [column J]
And the CoO value is not a comma-separated list of valid ISO 2-digit country code in the 'Country Code' column [column J]
And the CoO value is not X or x in the 'Country Code' column [column J]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC10: CoO Value is X or x

```gherkin
Given a Mars packing list item has a NIRMS value specified
And it contains a True value below:
  • Green
And the CoO value is X or x in the 'Country Code' column [column J]
When the packing list is submitted
Then the packing list will pass
```

### AC11: Item Present on Prohibited Item List (Treatment Type specified)

```gherkin
Given a Mars packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column I]
And the treatment type is specified in the 'Type of Treatment' column [column C]
And the commodity code starts with and CoO, and treatment type matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

### AC12: Item Present on Prohibited Item List, more than 3 (Treatment Type specified)

```gherkin
Given a Mars packing list have more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column I]
And the treatment type is specified in the 'Type of Treatment' column [column C]
And the commodity code starts with, and CoO, and treatment type matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### AC13: Item Present on Prohibited Item List (no Treatment Type specified)

```gherkin
Given a Mars packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Country Code' column [column I]
And treatment type is not specified (null) in the 'Type of Treatment' column [column C]
And the commodity code starts with, and CoO matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

### AC14: Item Present on Prohibited Item List, more than 3 (no Treatment Type specified)

```gherkin
Given a Mars packing list have more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Green
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified in the 'Commodity Code' column [column I]
And treatment type is not specified (null) in the 'Type of Treatment' column [column C]
And the commodity code starts with, and CoO matches an item on the prohibited item list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

## Technical Implementation

### Parser Integration

The CoO validation will be integrated into the existing parser pipeline using the configuration-driven approach:

1. **Header configuration** in `model-headers.js`:

   ```javascript
   MARS: {
     establishmentNumber: /existing regex/,
     fieldMapping: {
       // ... existing mappings ...
       country_of_origin: /country.?of.?origin|origin/i,
       nirms: /nirms|rms/i,
       type_of_treatment: /treatment|process/i
     },
     validateCountryOfOrigin: true
   }
   ```

2. **Parser passes header object** to `combineParser.combine()`:

   ```javascript
   return combineParser.combine(
     packingListContents,
     establishmentNumbers,
     "MARS",
     headers, // Pass header configuration including validateCountryOfOrigin flag
   );
   ```

3. **Existing validation pipeline** handles CoO validation automatically:
   - `packingListValidator.validatePackingList()` checks the `validateCountryOfOrigin` flag
   - Uses existing validation utilities: `hasMissingCoO()`, `hasInvalidCoO()`, `hasMissingNirms()`, `hasInvalidNirms()`, `hasProhibitedItems()`
   - Column validator applies CoO validation rules when flag is enabled
