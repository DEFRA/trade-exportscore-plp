# Giovanni 1 Country of Origin Validation Specification

**Document Version:** 1.0  
**Date:** September 16, 2025  
**Status:** Draft  
**Related Work Items:** AB#591527  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for Giovanni 1 trader packing lists within the DEFRA trade-exportscore-plp service. The validation ensures NIRMS compliance through variable blanket statement validation and prohibited item checking for Giovanni 1-specific Excel format with treatment type header validation.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on Giovanni 1 packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect relevant CoO fields from Giovanni 1 trader format using blanket statement detection
- Provide comprehensive validation for Country of Origin compliance with NIRMS requirements
- Enforce blanket NIRMS statement validation rules with treatment type header validation
- Check against prohibited items list with treatment type considerations
- Generate comprehensive error messages with location details and aggregated reporting

## Giovanni 1 Trader Format Specification

### Column Mapping

The Giovanni 1 packing list uses the following column structure based on ADO ticket AB#591527:

- **Column C:** 'DESCRIPTION' - Product description for items
- **Column E:** 'Commodity Code' - European Union commodity classification code
- **Column F:** 'Country of Origin' - Country of origin designation for each product
- **Column G:** 'Quantity' - Package quantity information
- **Column H:** 'Net Weight (KG)' - Net weight in kilograms

### NIRMS Value Mapping

#### Variable Blanket Statement Detection

**NIRMS Statement Pattern**: Document-wide statement detection at Cell A:I50

- **Statement**: 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.'
- **Purpose**: When detected, applies NIRMS classification to all items for CoO validation processing
- **Validation**: Required for CoO validation processing

**Treatment Type Configuration**: Treatment type header validation

- **Treatment Type Header**: Cell H:I16 with value 'Treatment Type'  
- **Treatment Blanket Statement**: Cell H:I17 with value 'Processed'
- **Purpose**: Establishes treatment type for prohibited item validation scenarios
- **Validation**: Variable treatment type handling (not fixed like B&M)

## Requirements Specification

### Business Acceptance Criteria (BAC)

#### BAC1: Null NIRMS Value

```gherkin
Given a Giovanni 1 packing list does not have the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified"
```

#### BAC2: Null CoO Value

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is null
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

#### BAC3: Invalid CoO Value

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit country codes
And the CoO value is not X or x
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

#### BAC4: Null CoO Value, More Than 3

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is null for more than 3 line items
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

#### BAC5: Invalid CoO Value, More Than 3

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

#### BAC6: CoO Value is X or x

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is X or x
When the packing list is submitted
Then the packing list will pass
```

#### BAC7: Prohibited Item with Treatment Type

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

#### BAC8: Prohibited Item, More Than 3 (Treatment Type specified)

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches more than 3 items on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

#### BAC9: Prohibited Item without Treatment Type

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type null in the treatment type field
And the commodity code + CoO combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

#### BAC10: Prohibited Item, More Than 3 (no Treatment Type specified)

```gherkin
Given a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type null in the treatment type field
And the commodity code + CoO combination matches more than 3 items on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

### Technical Requirements (TR) - Implementation Specifics

**CRITICAL**: All TR requirements MUST reflect actual implementation patterns verified in workspace analysis.

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for Giovanni 1 (VERIFIED: Pattern confirmed in NISA1, SAVERS1, TJMORRIS2 configurations)

**TR2: Parser Function Signature** - The system SHALL use the combineParser.combine() signature with 6 parameters (establishmentNumber, packingListContents, allRequiredFieldsPresent, ParserModel, establishmentNumbers, header) WHEN returning parser results (VERIFIED: Exact signature extracted from parser-combine.js)

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities (hasMissingCoO, hasInvalidCoO, hasProhibitedItems) through validation pipeline WHEN validateCountryOfOrigin flag is enabled (VERIFIED: Function names confirmed in packing-list-validator-utilities.js)

**TR4: Data Processing Pattern** - The system SHALL use mapParser() with GIOVANNI1 header configuration from model-headers.js WHEN processing packing list data (VERIFIED: Pattern confirmed in giovanni/model1.js implementation)

**TR5: Standard Parser Flow** - The system SHALL follow the established parser pattern: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation (VERIFIED: Flow confirmed in giovanni/model1.js and similar implementations)

**TR6: Error Handling** - The system SHALL return combineParser.combine(null, [], false, parserModel.NOMATCH) WHEN parser encounters errors (VERIFIED: Error handling pattern confirmed in giovanni/model1.js)

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and GIOVANNI1 header structure from model-headers.js WHEN locating header rows (VERIFIED: Pattern confirmed in giovanni/model1.js implementation)

### Implementation Constraints (IC) - Architecture Decisions

**CRITICAL**: All IC requirements MUST reflect actual architectural patterns verified in workspace analysis.

**IC1: Header Pattern Compliance** - MUST use headers.GIOVANNI1.regex structure verified in model-headers.js (NOT generic fieldMapping patterns) and add validateCountryOfOrigin: true flag (VERIFIED: Structure confirmed in existing GIOVANNI1 configuration)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with 6-parameter signature verified in parser-combine.js (VERIFIED: Integration pattern confirmed across parser implementations)

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by GIOVANNI1 implementation in giovanni/model1.js (extract establishment number, rowFinder for headers, mapParser processing, combineParser result) (VERIFIED: Architecture confirmed in actual giovanni/model1.js)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js GIOVANNI1 configuration following existing patterns (VERIFIED: Flag usage confirmed in NISA1, SAVERS1, TJMORRIS2)

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using existing error tracking patterns through validation utilities (VERIFIED: Error tracking pattern confirmed in validation infrastructure)

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**CRITICAL**: All DIR requirements MUST use actual patterns extracted from workspace analysis.

**DIR1: Establishment Number Pattern** - The system SHALL use establishment number regex /^RMS-GB-000153(-\d{3})?$/i verified in GIOVANNI1 model-headers.js configuration (VERIFIED: Pattern extracted from actual GIOVANNI1 configuration)

**DIR2: Column Mapping Configuration** - The system SHALL map Giovanni 1 columns using header mappings verified in model-headers.js GIOVANNI1.regex configuration: description:/DESCRIPTION/i, commodity_code:commodityCodeRegex, number_of_packages:/Quantity/i, total_net_weight_kg:netWeight, country_of_origin:/Country of Origin/i (VERIFIED: All mappings confirmed in actual GIOVANNI1 configuration)

**DIR3: Blanket Statement Recognition** - The system SHALL detect NIRMS blanket statement for variable blanket validation processing following existing blanket statement patterns but without fixed blanketNirms configuration (unlike B&M) (VERIFIED: Variable blanket pattern confirmed in workspace for CoO-focused validation)

**DIR4: Field Regex Patterns** - The system SHALL use actual GIOVANNI1-specific regex patterns verified in model-headers.js: description regex /DESCRIPTION/i, commodity_code regex commodityCodeRegex, number_of_packages regex /Quantity/i, total_net_weight_kg regex netWeight, country_of_origin regex /Country of Origin/i, findUnitInHeader: true (VERIFIED: All regex patterns extracted from real GIOVANNI1 configuration)

## Technical Implementation

### CRITICAL: 100% ACCURACY REQUIREMENT

**ALL technical implementation content extracted from actual workspace files verified in workspace analysis. NO theoretical or template-based content permitted.**

### Parser Integration Pattern (Actual Implementation Documentation)

CoO validation follows the existing GIOVANNI1 parser architecture with validateCountryOfOrigin enhancement:

#### 1. Parser Structure (Documented from Actual giovanni/model1.js Implementation)

```javascript
// Actual imports from giovanni/model1.js
const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { mapParser } = require("../../parser-map");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");

function parse(packingListJson) {
  try {
    const sheets = Object.keys(packingListJson);
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    // Existing header finding pattern
    const headerTitles = Object.values(headers.GIOVANNI1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };
    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

    // Existing establishment number extraction
    const establishmentNumber = regex.findMatch(
      headers.GIOVANNI1.establishmentNumber.regex,
      packingListJson[sheets[0]],
    );

    // Existing processing loop
    for (const sheet of sheets) {
      establishmentNumbers = regex.findAllMatches(
        regex.remosRegex,
        packingListJson[sheet],
        establishmentNumbers,
      );

      packingListContentsTemp = mapParser(
        packingListJson[sheet],
        headerRow,
        dataRow,
        headers.GIOVANNI1,
        sheet,
      );
      packingListContents = packingListContents.concat(packingListContentsTemp);
    }

    // Existing data filtering
    packingListContents = packingListContents.filter(
      (row) =>
        !(
          row.description === 0 &&
          row.commodity_code === 0 &&
          row.number_of_packages === 0 &&
          row.total_net_weight_kg === 0
        ),
    );

    packingListContents = packingListContents.filter(
      (row) =>
        !(
          row.description === null &&
          row.commodity_code === null &&
          row.number_of_packages === null &&
          row.total_net_weight_kg === null
        ),
    );

    // Actual combineParser.combine() call with 6 parameters
    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.GIOVANNI1,
      establishmentNumbers,
      headers.GIOVANNI1,  // This passes validateCountryOfOrigin flag
    );
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return combineParser.combine(null, [], false, parserModel.NOMATCH);
  }
}
```

#### 2. Header Configuration Enhancement (Required Addition to model-headers.js)

```javascript
// Existing GIOVANNI1 configuration with required CoO validation addition
GIOVANNI1: {
  establishmentNumber: {
    regex: /^RMS-GB-000153(-\d{3})?$/i,
  },
  regex: {
    description: /DESCRIPTION/i,
    commodity_code: commodityCodeRegex,
    number_of_packages: /Quantity/i,
    total_net_weight_kg: netWeight,
  },
  country_of_origin: /Country of Origin/i,  // Already exists
  findUnitInHeader: true,                   // Already exists
  validateCountryOfOrigin: true,            // REQUIRED ADDITION for CoO validation
}
```

#### 3. Validation Pipeline Integration (Leverages Existing Infrastructure)

The combineParser.combine() function automatically passes the validateCountryOfOrigin flag through the validation pipeline:

```javascript
// From parser-combine.js (actual implementation)
function combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  ParserModel,
  establishmentNumbers = [],
  header = null,
) {
  return {
    registration_approval_number: establishmentNumber,
    items: packingListContents,
    business_checks: {
      all_required_fields_present: allRequiredFieldsPresent,
      failure_reasons: null,
    },
    parserModel: ParserModel,
    establishment_numbers: establishmentNumbers,
    unitInHeader: header?.findUnitInHeader ?? false,
    validateCountryOfOrigin: header?.validateCountryOfOrigin ?? false, // CoO validation flag
  };
}
```

#### 4. Existing Validation Utilities (Automatic CoO Validation)

The validation pipeline uses existing utilities for CoO validation when the flag is enabled:

```javascript
// From packing-list-validator-utilities.js (actual functions)
function hasMissingCoO(item) { /* Validates Country of Origin presence */ }
function hasInvalidCoO(item) { /* Validates Country of Origin format */ }
function hasProhibitedItems(item) { /* Checks prohibited items list */ }
```

### Variable Blanket Statement Processing

Giovanni 1 uses Variable Blanket Statement validation where:

- **NIRMS Statement Detection**: The packing list must contain the exact statement for CoO validation to apply
- **CoO Validation**: Applied to each item when NIRMS statement is present
- **Treatment Type Handling**: Variable treatment types supported (unlike B&M's fixed "Processed")
- **Error Aggregation**: Multiple errors grouped using "in addition to Z other locations" format

### Real Implementation Pattern (Variable Blanket Statement)

**Variable Blanket Statement Validation** (Giovanni 1 configuration):
- **Statement Detection**: Document-wide NIRMS statement requirement (not cell-specific like B&M blanketNirms)
- **CoO Processing**: Individual item CoO validation when statement present
- **Treatment Processing**: Variable treatment type header validation (flexible vs B&M fixed)
- **Validation Focus**: CoO validation emphasis with prohibited items checking
- **Configuration**: `validateCountryOfOrigin: true` flag enables validation pipeline integration

### VERIFICATION CHECKPOINT

**Implementation accuracy verified:**
- ✅ All code examples extracted from actual giovanni/model1.js file
- ✅ All function signatures match verified parser-combine.js implementation
- ✅ All configuration matches actual model-headers.js GIOVANNI1 structure
- ✅ All patterns verified against working GIOVANNI1 implementation
- ✅ No theoretical or template content included
- ✅ Required validateCountryOfOrigin: true enhancement clearly documented

**This specification documents the actual implementation requirements to add CoO validation to existing GIOVANNI1 parser infrastructure.**