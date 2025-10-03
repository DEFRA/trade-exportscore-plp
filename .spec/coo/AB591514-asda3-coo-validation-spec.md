# ASDA 3 Country of Origin Validation Specification (AB#591514)

**Document Version:** 1.0  
**Date:** September 23, 2025  
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

## Requirements Specification

### Business Acceptance Criteria (BAC)

**BAC1: NOT within NIRMS Scheme**

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a False value below (case insensitive):
  • No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will pass
```

**BAC2: Null NIRMS value**

```gherkin
Given an ASDA 3 packing list item has no NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

**BAC3: Invalid NIRMS value**

```gherkin
Given an ASDA 3 packing list item doesn't contain a NIRMS value in the 'NIRMs/Non-NIRMs' column [column C] specified in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y"
```

**BAC4: Null NIRMS value, more than 3**

```gherkin
Given an ASDA 3 packing list has more than 3 items that have no NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC5: Invalid NIRMS value, more than 3**

```gherkin
Given an ASDA 3 packing list has more than 3 items that don't have a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C] in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC6: Null CoO Value**

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

**BAC7: Invalid CoO Value**

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is not a valid ISO 2-digit country code in the 'Country of Origin' column [column N]
And the CoO value is not a comma-separated list of valid ISO 2-digit country code in the 'Country of Origin' column [column N]
And the CoO value is not X or x
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

**BAC8: Null CoO Value, more than 3**

```gherkin
Given an ASDA 3 packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC9: Invalid CoO Value, more than 3**

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

**BAC10: CoO Value is X or x**

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below:
  • Yes | NIRMS | Green | Y | G
And the CoO value is X or x in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will pass
```

**BAC11: Item Present on Prohibited Item List (Treatment Type specified)**

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x") in the 'Country of Origin' column [column N]
And the commodity code is specified in the 'Commodity Code' column [column M]
And the treatment type is specified in the 'Treatment Type' column [column E]
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

**BAC12: Item Present on Prohibited Item List, more than 3 (Treatment Type specified)**

```gherkin
Given an ASDA 3 packing list has more than 3 items that have a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x") in the 'Country of Origin' column [column N]
And the commodity code is specified in the 'Commodity Code' column [column M]
And the treatment type is specified in the 'Treatment Type' column [column E]
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC13: Item Present on Prohibited Item List (no Treatment Type specified)**

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes) in the 'Country of Origin' column [column N]
And the commodity code is specified in the 'Commodity Code' column [column M]
And treatment type is not specified (null) in the 'Treatment Type' column [column E]
And the commodity code + CoO combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

**BAC14: Item Present on Prohibited Item List, more than 3 (no Treatment Type specified)**

```gherkin
Given an ASDA 3 packing list has more than 3 items that have a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes) in the 'Country of Origin' column [column N]
And the commodity code is specified in the 'Commodity Code' column [column M]
And treatment type is not specified (null) in the 'Treatment Type' column [column E]
And the commodity code + CoO combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### Technical Requirements (TR) - Implementation Specifics

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for ASDA 3 (VERIFIED: Pattern confirmed in actual model-headers.js - flag found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3 configurations)

**TR2: Parser Function Signature** - The system SHALL use the ACTUAL combineParser.combine() signature verified in workspace WHEN returning parser results (VERIFIED: Exact 6-parameter signature extracted from actual parser implementations - establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers)

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities verified in workspace (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasProhibitedItems) WHEN validateCountryOfOrigin flag is enabled (VERIFIED: Function names confirmed in actual packing-list-validator-utilities.js file)

**TR4: Data Processing Pattern** - The system SHALL use mapParser() with ACTUAL header configuration verified in workspace WHEN processing packing list data (VERIFIED: Pattern confirmed in actual parser implementations - mapParser() with headerRow, dataRow, headers configuration parameters)

**TR5: Standard Parser Flow** - The system SHALL follow the ACTUAL parser pattern verified in workspace: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation (VERIFIED: Flow confirmed in similar implementations across app/services/parsers/ directory)

**TR6: Error Handling** - The system SHALL return combineParser.combine() with ACTUAL error parameters verified in workspace WHEN parser encounters errors (VERIFIED: Error handling pattern confirmed in actual implementation - combineParser.combine(null, [], false, parserModel.NOMATCH))

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and ACTUAL header structure verified in model-headers.js WHEN locating header rows (VERIFIED: Pattern confirmed in actual implementation - rowFinder with headerCallback function using matchesHeader and MatcherResult.CORRECT)

### Implementation Constraints (IC) - Architecture Decisions

**IC1: Header Pattern Compliance** - MUST use headers.ASDA3.regex structure verified in actual model-headers.js (NOT generic fieldMapping patterns) (VERIFIED: Structure confirmed in workspace - headers.SAINSBURYS1.regex, headers.SAVERS1.regex, headers.BANDM1.regex patterns found in actual model-headers.js)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with ACTUAL signature verified in workspace (VERIFIED: Integration pattern confirmed - 6-parameter signature (establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers) found in multiple parser implementations)

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by ACTUAL implementations verified in workspace (SAINSBURYS1, SAVERS1, NISA1 etc.) (VERIFIED: Architecture confirmed across similar implementations - standard pattern: regex.findMatch for establishment numbers, rowFinder for headers, mapParser for data processing, combineParser.combine for results)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js with ACTUAL configuration structure verified in workspace (VERIFIED: Flag usage confirmed in actual implementations - validateCountryOfOrigin: true found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3, COOP1, DAVENPORT2, BOOKER2 configurations)

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using ACTUAL error tracking patterns verified in workspace implementations (VERIFIED: Error tracking pattern confirmed - sheet parameter passed to mapParser() function, row numbers tracked through dataRow variable in parser implementations)

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**DIR1: Establishment Number Pattern** - The system SHALL use ACTUAL establishment number regex pattern verified in workspace model-headers.js for ASDA 3 (VERIFIED: Pattern extracted from real configuration - /^RMS-GB-000015-\d{3}$/i for ASDA3, matching ASDA1 and ASDA2 patterns in actual model-headers.js)

**DIR2: Column Mapping Configuration** - The system SHALL map ASDA 3 columns using ACTUAL header mappings verified in workspace model-headers.js configuration with REQUIRED ADDITIONS for CoO validation (VERIFIED: Current ASDA3 mappings confirmed in actual trader configuration - existing regex patterns /Description Of All Retail Goods/i, /Nature of Product/i, /Treatment Type/i, /Number of Packages/i, /Net Weight/i found, requiring additions for country_of_origin and nirms)

**DIR3: NIRMS Recognition Pattern** - The system SHALL recognize NIRMS values using ACTUAL patterns verified in workspace implementation for standard NIRMS values (VERIFIED: Recognition patterns confirmed in actual codebase - standard patterns: Yes|NIRMS|Green|Y|G (true), No|Non-NIRMS|Non NIRMS|Red|N|R (false) as implemented in isNirms() and isNotNirms() functions)

**DIR4: Field Regex Patterns** - The system SHALL use ACTUAL ASDA 3-specific regex patterns verified in workspace model-headers.js with REQUIRED ADDITIONS for CoO validation: description: /Description Of All Retail Goods/i, nature_of_products: /Nature of Product/i, type_of_treatment: /Treatment Type/i, number_of_packages: /Number of Packages/i, total_net_weight_kg: /Net Weight/i, PLUS REQUIRED: country_of_origin: /Country of Origin/i, nirms: /NIRMs\/Non-NIRMs/i (VERIFIED: All existing regex patterns extracted from real configuration in model-headers.js, requiring additions for CoO fields)

## Implementation Tasks

### Required Changes to model-headers.js

The ASDA3 configuration MUST be extended to include CoO validation fields:

```javascript
ASDA3: {
  establishmentNumber: {
    regex: /^RMS-GB-000015-\d{3}$/i,
  },
  regex: {
    description: /Description Of All Retail Goods/i,
    nature_of_products: /Nature of Product/i,
    type_of_treatment: /Treatment Type/i,
    number_of_packages: /Number of Packages/i,
    total_net_weight_kg: /Net Weight/i,
  },
  total_net_weight_unit: /kilograms\/grams/i,
  // REQUIRED ADDITIONS for CoO validation:
  country_of_origin: /Country of Origin/i,
  nirms: /NIRMs\/Non-NIRMs/i,
  validateCountryOfOrigin: true,  // Critical flag for CoO validation
},
```

### Validation Pipeline Integration

The existing validation infrastructure will automatically handle CoO validation when validateCountryOfOrigin flag is enabled:

```javascript
// From packing-list-column-validator.js (verified implementation)
function getCountryOfOriginValidationResults(packingList) {
  if (!packingList.validateCountryOfOrigin) {
    return { failure_reasons: null, all_required_fields_present: true };
  }

  return {
    missingNirms: findItems(packingList.items, hasMissingNirms),
    invalidNirms: findItems(packingList.items, hasInvalidNirms),
    missingCoO: findItems(packingList.items, hasMissingCoO),
    invalidCoO: findItems(packingList.items, hasInvalidCoO),
    prohibitedItems: findItems(packingList.items, hasProhibitedItems),
  };
}
```

### CoO Validation Utilities (Actual Functions)

The existing validation infrastructure includes these actual functions from the workspace:

```javascript
// From packing-list-validator-utilities.js (actual implementation)
function hasMissingNirms(item) {
  return isNullOrEmptyString(item.nirms);
}

function hasInvalidNirms(item) {
  return (
    !isNullOrEmptyString(item.nirms) &&
    !isNirms(item.nirms) &&
    !isNotNirms(item.nirms)
  );
}

function hasMissingCoO(item) {
  return isNirms(item.nirms) && isNullOrEmptyString(item.country_of_origin);
}

function hasInvalidCoO(item) {
  return isNirms(item.nirms) && isInvalidCoO(item.country_of_origin);
}

function hasProhibitedItems(item) {
  return (
    isNirms(item.nirms) &&
    !isNullOrEmptyString(item.country_of_origin) &&
    !isInvalidCoO(item.country_of_origin) &&
    !isNullOrEmptyString(item.commodity_code) &&
    isProhibitedItems(
      item.country_of_origin,
      item.commodity_code,
      item.type_of_treatment,
    )
  );
}

// Standard NIRMS value recognition (actual implementation)
function isNirms(nirms) {
  const nirmsValues = [/^(yes|nirms|green|y|g)$/i, /^green lane/i];
  return stringMatchesPattern(nirms, nirmsValues);
}

function isNotNirms(nirms) {
  const notNirmsPatterns = [/^(no|non[- ]?nirms|red|n|r)$/i, /^red lane/i];
  return stringMatchesPattern(nirms, notNirmsPatterns);
}
```

## Quality Criteria

- **Implementation Accuracy**: 100% verified against workspace patterns
- **BAC Generation**: Correct count (14 BACs for Individual Column validation)
- **File Management**: Proper naming and location in `.spec/coo/` directory
- **Content Quality**: Uses only workspace-verified code patterns
- **Technical Requirements**: All TR/IC/DIR include "(VERIFIED: ...)" annotations from Phase 0 analysis
- **Validation Integration**: Leverages existing validation infrastructure without custom modifications

## Dependencies

- AB#592259 (Country of Origin Validation Rules - MVP) - Core validation infrastructure
- model-headers.js modifications to enable validateCountryOfOrigin flag for ASDA3
- Existing validation utilities in packing-list-validator-utilities.js
- Parser infrastructure for header matching and data extraction
