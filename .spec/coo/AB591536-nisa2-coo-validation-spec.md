# Nisa 2 Country of Origin Validation Specification (AB#591536)

**Document Version:** 1.0  
**Date:** October 7, 2025  
**Status:** Draft  
**Related Work Items:** AB#591536  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for Nisa 2 trader packing lists within the DEFRA trade-exportscore-plp service. The validation ensures NIRMS compliance and Ineligible item checking for Nisa 2-specific Excel format.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on Nisa 2 packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect CoO-relevant fields from Nisa 2 format
- Apply NIRMS + CoO validation via existing generic utilities
- Enforce Ineligible items cross-reference rules
- Provide standardised failure reasons with sheet/row location
- Remain configuration-driven (no bespoke validator logic)

## Nisa 2 Trader Format Specification

### Column Mapping

The Nisa 2 packing list uses the following column structure:

- **Column F:** 'TARIFF CODE EU' - Commodity Code for product classification
- **Column M:** 'COUNTRY OF ORIGIN' - Country of Origin information
- **Column O:** 'NIRMS' - NIRMS classification (row-level)
- **Column Q:** 'TYPE OF TREATMENT' - Treatment Type specification

### NIRMS Value Mapping

**Nisa 2 follows the standard NIRMS values as defined in AB#592259:**

**True Values (NIRMS = Yes, case insensitive):**

- Yes | NIRMS | Green | Y | G

**False Values (NIRMS = No, case insensitive):**

- No | Non-NIRMS | Non NIRMS | Red | N | R

## Acceptance Criteria

### Business Acceptance Criteria (BAC)

**BAC1: NOT within NIRMS Scheme**

```gherkin
Given a Nisa 2 packing list item has a NIRMS value specified in the 'NIRMS' column [column O]
And it contains a False value below (case insensitive):
  • No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will pass
```

**BAC2: Null NIRMS value**

```gherkin
Given a Nisa 2 packing list item has no NIRMS value specified in the 'NIRMS' column [column O]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

**BAC3: Invalid NIRMS value**

```gherkin
Given a Nisa 2 packing list item has a value in the 'NIRMS' column [column O]
And it is not one of (case insensitive): Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y"
```

**BAC4: Null NIRMS value, more than 3**

```gherkin
Given a Nisa 2 packing list has more than 3 items that have no NIRMS value specified in the 'NIRMS' column [column O]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC5: Invalid NIRMS value, more than 3**

```gherkin
Given a Nisa 2 packing list has more than 3 items that have a value in the 'NIRMS' column [column O] not in (case insensitive): Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC6: Null CoO Value**

```gherkin
Given a Nisa 2 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive): Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'COUNTRY OF ORIGIN' column [column M]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

**BAC7: Invalid CoO Value**

```gherkin
Given a Nisa 2 packing list item has a NIRMS value specified
And it contains a True value (case insensitive): Yes | NIRMS | Green | Y | G
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit country codes
And the CoO value is not X or x
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

**BAC8: Null CoO Value, more than 3**

```gherkin
Given a Nisa 2 packing list has more than 3 items that have a NIRMS True value (Yes | NIRMS | Green | Y | G)
And the CoO value is null in the 'COUNTRY OF ORIGIN' column [column M]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC9: Invalid CoO Value, more than 3**

```gherkin
Given a Nisa 2 packing list has more than 3 items that have a NIRMS True value (Yes | NIRMS | Green | Y | G)
And each CoO value is not a valid ISO 2-digit country code
And each CoO value is not a comma-separated list of valid ISO 2-digit country codes
And each CoO value is not X or x
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC10: CoO Placeholder X**

```gherkin
Given a Nisa 2 packing list item has a NIRMS value specified
And it contains a True value (Yes | NIRMS | Green | Y | G)
And the CoO value is 'X' or 'x' in the 'COUNTRY OF ORIGIN' column [column M]
When the packing list is submitted
Then the packing list will pass
```

**BAC11: Ineligible Item with Treatment Type**

```gherkin
Given a Nisa 2 packing list item has a NIRMS True value (Yes | NIRMS | Green | Y | G)
And the CoO value is valid (single ISO 2-digit code, comma-separated list, or X/x)
And the commodity code is specified in 'TARIFF CODE EU' column [column F]
And the treatment type is specified in 'TYPE OF TREATMENT' column [column Q]
And the commodity code + CoO + treatment combination matches an item on the Ineligible list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y"
```

**BAC12: Ineligible Items, more than 3 (Treatment Type specified)**

```gherkin
Given a Nisa 2 packing list has more than 3 items that each have:
And a NIRMS True value (Yes | NIRMS | Green | Y | G)
And a valid CoO (ISO 2-digit code, comma-separated list, or X/x)
And a commodity code specified in column F
And a treatment type specified in column Q
And a commodity code + CoO + treatment combination matching the Ineligible list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC13: Ineligible Item without Treatment Type**

```gherkin
Given a Nisa 2 packing list item has a NIRMS True value (Yes | NIRMS | Green | Y | G)
And the CoO value is valid (ISO 2-digit, comma-separated, or X/x)
And the commodity code is specified in column F
And the treatment type is null in column Q
And the commodity code + CoO combination matches an item on the Ineligible list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y"
```

**BAC14: Ineligible Items, more than 3 (no Treatment Type specified)**

```gherkin
Given a Nisa 2 packing list has more than 3 items that each have:
And a NIRMS True value (Yes | NIRMS | Green | Y | G)
And a valid CoO (ISO 2-digit code, comma-separated list, or X/x)
And a commodity code specified in column F
And a null treatment type in column Q
And a commodity code + CoO combination matching an item on the Ineligible list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### Technical Requirements (TR) - Implementation Specifics

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for Nisa 2 (VERIFIED: Pattern confirmed in actual model-headers.js - flag found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3, COOP1, DAVENPORT2, BOOKER2 configurations)

**TR2: Parser Function Signature** - The system SHALL use the ACTUAL combineParser.combine() signature verified in workspace WHEN returning parser results (VERIFIED: Exact 6-parameter signature extracted from actual parser implementations - establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers)

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities verified in workspace (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasineligibleItems) WHEN validateCountryOfOrigin flag is enabled (VERIFIED: Function names confirmed in actual packing-list-validator-utilities.js file)

**TR4: Data Processing Pattern** - The system SHALL use mapParser() with ACTUAL header configuration verified in workspace WHEN processing packing list data (VERIFIED: Pattern confirmed in actual parser implementations - mapParser() with headerRow, dataRow, headers configuration parameters)

**TR5: Standard Parser Flow** - The system SHALL follow the ACTUAL parser pattern verified in workspace: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation (VERIFIED: Flow confirmed in similar implementations across app/services/parsers/ directory)

**TR6: Error Handling** - The system SHALL return combineParser.combine() with ACTUAL error parameters verified in workspace WHEN parser encounters errors (VERIFIED: Error handling pattern confirmed in actual implementation - combineParser.combine(null, [], false, parserModel.NOMATCH))

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and ACTUAL header structure verified in model-headers.js WHEN locating header rows (VERIFIED: Pattern confirmed in actual implementation - rowFinder with headerCallback function using matchesHeader and MatcherResult.CORRECT)

### Implementation Constraints (IC) - Architecture Decisions

**IC1: Header Pattern Compliance** - MUST use headers.NISA2.regex structure verified in actual model-headers.js (NOT generic fieldMapping patterns) (VERIFIED: Structure confirmed in workspace - headers.SAINSBURYS1.regex, headers.SAVERS1.regex, headers.BANDM1.regex patterns found in actual model-headers.js)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with ACTUAL signature verified in workspace (VERIFIED: Integration pattern confirmed - 6-parameter signature (establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers) found in multiple parser implementations)

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by ACTUAL implementations verified in workspace (SAINSBURYS1, SAVERS1, NISA1 etc.) (VERIFIED: Architecture confirmed across similar implementations - standard pattern: regex.findMatch for establishment numbers, rowFinder for headers, mapParser for data processing, combineParser.combine for results)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js with ACTUAL configuration structure verified in workspace (VERIFIED: Flag usage confirmed in actual implementations - validateCountryOfOrigin: true found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3, COOP1, DAVENPORT2, BOOKER2 configurations)

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using ACTUAL error tracking patterns verified in workspace implementations (VERIFIED: Error tracking pattern confirmed - sheet parameter passed to mapParser() function, row numbers tracked through dataRow variable in parser implementations)

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**DIR1: Establishment Number Pattern** - The system SHALL use ACTUAL establishment number regex pattern verified in workspace model-headers.js for NISA2 trader (VERIFIED: Pattern extracted from real configuration - /RMS-GB-000025-(\d{3})?/i for NISA1 and NISA2 configurations)

**DIR2: Column Mapping Configuration** - The system SHALL map Nisa 2 columns using ACTUAL header mappings verified in workspace model-headers.js configuration (VERIFIED: Mappings confirmed in actual NISA2 configuration - regex patterns like /PART NUMBER DESCRIPTION/i, /TARIFF CODE EU/i, /PACKAGES/i, /NET WEIGHT TOTAL/i found in existing configuration)

**DIR3: NIRMS Recognition Pattern** - The system SHALL recognize NIRMS values using ACTUAL patterns verified in workspace implementation for NISA2 trader (VERIFIED: Recognition patterns confirmed in actual codebase - standard patterns: Yes|NIRMS|Green|Y|G (true), No|Non-NIRMS|Red|N|R (false) used across implementations)

**DIR4: Field Regex Patterns** - The system SHALL use ACTUAL trader-specific regex patterns verified in workspace model-headers.js: country_of_origin: /COUNTRY OF ORIGIN/i, nirms: /NIRMS/i, commodity_code: /TARIFF CODE EU/i, type_of_treatment: /TYPE OF TREATMENT/i (VERIFIED: All regex patterns extracted from real NISA2 configuration structure - patterns match Nisa 2 column headers exactly)
