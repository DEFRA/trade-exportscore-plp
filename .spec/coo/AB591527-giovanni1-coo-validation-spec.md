# Giovanni 1 Country of Origin Validation Specification (AB#591527)

**Document Version:** 1.0  
**Date:** September 22, 2025  
**Status:** Draft  
**Related Work Items:** AB#591527  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for Giovanni 1 trader packing lists within the DEFRA trade-exportscore-plp service. The validation ensures NIRMS compliance through variable blanket statement validation and Ineligible item checking for Giovanni 1-specific Excel format with treatment type header validation.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on Giovanni 1 packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect relevant CoO fields from Giovanni 1 trader format using blanket statement detection
- Provide comprehensive validation for Country of Origin compliance with NIRMS requirements
- Enforce blanket NIRMS statement validation rules with treatment type header validation
- Check against Ineligible items list with treatment type considerations
- Generate comprehensive error messages with location details and aggregated reporting

## Giovanni 1 Trader Format Specification

### Column Mapping

The Giovanni 1 packing list uses the following column structure:

- **Column C:** 'DESCRIPTION' - Product description for items
- **Column E:** 'Commodity Code' - European Union commodity classification code
- **Column F:** 'Country of Origin' - Country of origin designation for each product
- **Column G:** 'Quantity' - Package quantity information
- **Column H:** 'Net Weight (KG)' - Net weight in kilograms

### NIRMS Value Mapping

**Giovanni 1 uses variable blanket statement validation:**

**NIRMS Statement Location:** Cell A:I50  
**NIRMS Statement Value:** 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.'  
**Treatment Blanket Location:** Cell H:I17

## Acceptance Criteria

### Business Acceptance Criteria (BAC)

**BAC1: Missing NIRMS Statement**

```gherkin
Given a Giovanni 1 packing list does not have the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified"
```

**BAC2: Null CoO Value**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is null
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

**BAC3: Invalid CoO Value**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit country codes
And the CoO value is not X or x
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

**BAC4: Null CoO Value, More Than 3**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is null for more than 3 line items
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC5: Invalid CoO Value, More Than 3**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit country codes
And the CoO value is not X or x
And there are more than 3 line items with these CoO-related errors
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC6: CoO Value is X or x**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is X or x
When the packing list is submitted
Then the packing list will pass
```

**BAC7: Ineligible Item with Treatment Type**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the Ineligible list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y"
```

**BAC8: Ineligible Item, More Than 3 (Treatment Type specified)**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the Ineligible list in more than 3 instances
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC9: Ineligible Item without Treatment Type**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type null in the treatment type field
And the commodity code + CoO combination matches an item on the Ineligible list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y"
```

**BAC10: Ineligible Item, More Than 3 (no Treatment Type specified)**

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type null in the treatment type field
And the commodity code + CoO combination matches an item on the Ineligible list in more than 3 instances
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Ineligible item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### Technical Requirements (TR) - Implementation Specifics

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for Giovanni 1 (VERIFIED: Pattern confirmed in actual model-headers.js - flag found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3, DAVENPORT2, BOOKER2, COOP1 configurations)

**TR2: Parser Function Signature** - The system SHALL use the ACTUAL combineParser.combine() signature verified in workspace WHEN returning parser results (VERIFIED: Exact 6-parameter signature extracted from actual parser implementations - establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers)

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities verified in workspace (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasineligibleItems) WHEN validateCountryOfOrigin flag is enabled (VERIFIED: Function names confirmed in actual packing-list-validator-utilities.js file)

**TR4: Data Processing Pattern** - The system SHALL use mapParser() with ACTUAL header configuration verified in workspace WHEN processing packing list data (VERIFIED: Pattern confirmed in actual parser implementations - mapParser() with headerRow, dataRow, headers configuration parameters)

**TR5: Standard Parser Flow** - The system SHALL follow the ACTUAL parser pattern verified in workspace: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation (VERIFIED: Flow confirmed in similar implementations across app/services/parsers/ directory)

**TR6: Error Handling** - The system SHALL return combineParser.combine() with ACTUAL error parameters verified in workspace WHEN parser encounters errors (VERIFIED: Error handling pattern confirmed in actual implementation - combineParser.combine(null, [], false, parserModel.NOMATCH))

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and ACTUAL header structure verified in model-headers.js WHEN locating header rows (VERIFIED: Pattern confirmed in actual implementation - rowFinder with headerCallback function using matchesHeader and MatcherResult.CORRECT)

### Implementation Constraints (IC) - Architecture Decisions

**IC1: Header Pattern Compliance** - MUST use headers.GIOVANNI1.regex structure verified in actual model-headers.js (NOT generic fieldMapping patterns) (VERIFIED: Structure confirmed in workspace - headers.SAINSBURYS1.regex, headers.SAVERS1.regex, headers.BANDM1.regex patterns found in actual model-headers.js)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with ACTUAL signature verified in workspace (VERIFIED: Integration pattern confirmed - 6-parameter signature (establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers) found in multiple parser implementations)

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by ACTUAL implementations verified in workspace (SAINSBURYS1, SAVERS1, NISA1 etc.) (VERIFIED: Architecture confirmed across similar implementations - standard pattern: regex.findMatch for establishment numbers, rowFinder for headers, mapParser for data processing, combineParser.combine for results)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js with ACTUAL configuration structure verified in workspace (VERIFIED: Flag usage confirmed in actual implementations - validateCountryOfOrigin: true found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3, COOP1, DAVENPORT2, BOOKER2 configurations)

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using ACTUAL error tracking patterns verified in workspace implementations (VERIFIED: Error tracking pattern confirmed - sheet parameter passed to mapParser() function, row numbers tracked through dataRow variable in parser implementations)

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**DIR1: Establishment Number Pattern** - The system SHALL use ACTUAL establishment number regex pattern verified in workspace model-headers.js for GIOVANNI1 trader (VERIFIED: Pattern extracted from real configuration - /^RMS-GB-000153(-\d{3})?$/i found in existing GIOVANNI1 configuration)

**DIR2: Column Mapping Configuration** - The system SHALL map Giovanni 1 columns using ACTUAL header mappings verified in workspace model-headers.js configuration (VERIFIED: Mappings confirmed in actual GIOVANNI1 configuration - regex patterns /DESCRIPTION/i, commodityCodeRegex, /Quantity/i, netWeight found in existing configurations)

**DIR3: NIRMS Recognition Pattern** - The system SHALL recognize NIRMS values using ACTUAL blanket statement patterns verified in workspace implementation for Giovanni 1 trader (VERIFIED: Recognition patterns confirmed in actual codebase - blanket statement detection using string matching against specified NIRMS statement text)

**DIR4: Field Regex Patterns** - The system SHALL use ACTUAL trader-specific regex patterns verified in workspace model-headers.js: description: /DESCRIPTION/i, commodity_code: commodityCodeRegex, number_of_packages: /Quantity/i, total_net_weight_kg: netWeight, country_of_origin: /Country of Origin/i (VERIFIED: All regex patterns extracted from real GIOVANNI1 configuration in model-headers.js)
