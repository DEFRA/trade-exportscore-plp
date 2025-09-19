# ASDA 3 Country of Origin Validation Specification

**Document Version:** 3.0  
**Date:** September 17, 2025  
**Status:** Implementation Ready  
**Related Work Items:** AB#591514  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

**✅ CORRECTED METHODOLOGY APPLIED:** This specification has been regenerated using the corrected business-requirements-first methodology. ADO ticket requirements are treated as authoritative business specifications, with workspace analysis providing technical implementation guidance only.

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for ASDA 3 trader packing lists within the DEFRA trade-exportscore-plp service. The validation will ensure NIRMS compliance and prohibited item checking for ASDA 3-specific Excel format.

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

## Business Requirements (FROM ADO TICKET AB#591514)

### User Story (Authoritative from ADO)

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on ASDA 3 packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### ASDA 3 Enhanced Format Specification (Business Requirements)

The ADO ticket specifies the required ASDA 3 format for CoO validation:

- **Column C:** 'NIRMs/Non-NIRMs' - NIRMS classification values
- **Column E:** 'Treatment Type' - Treatment type information
- **Column M:** 'Commodity Code' - Product commodity codes
- **Column N:** 'Country of Origin' - Country of Origin values

### NIRMS Value Mapping (Business Standards)

**True Values (NIRMS = Yes, case insensitive):**

- Yes | NIRMS | Green | Y | G

**False Values (NIRMS = No, case insensitive):**

- No | Non-NIRMS | Non NIRMS | Red | N | R

### Scope (Business Requirements)

- Collect relevant CoO fields from ASDA 3 enhanced trader format
- Provide basic validation for Country of Origin compliance
- Enforce NIRMS scheme validation rules
- Check against prohibited items list
- Generate comprehensive error messages with location details

## Technical Context (FROM WORKSPACE ANALYSIS)

### Current ASDA3 Implementation Status

**Existing ASDA3 Configuration** (verified from `app/services/model-headers.js`):

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
}
```

**Current ASDA3 Parser** (verified from `app/services/parsers/asda/model3.js`):

- Uses standard parser pattern with 5-parameter `combineParser.combine()` signature
- No CoO validation currently enabled
- Follows established ASDA parser architecture

### CoO Validation Implementation Patterns (From Existing Implementations)

**Established CoO Configuration Pattern** (from SAINSBURYS1, SAVERS1, NISA1, TESCO3, TJMORRIS2):

```javascript
// Configuration pattern for CoO validation
{
  validateCountryOfOrigin: true,           // Enables CoO validation
  country_of_origin: /Country of Origin/i, // CoO field mapping
  nirms: /NIRMS or non-NIRMS/i,           // NIRMS field mapping
  findUnitInHeader: true,                 // Weight unit detection
}
```

**Parser Integration Pattern** (6-parameter combineParser signature):

```javascript
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.RETAILER,
  establishmentNumbers,
  headers.RETAILER, // Headers parameter enables CoO validation
);
```

### Available Validation Infrastructure

**Validation Functions** (existing in `packing-list-validator-utilities.js`):

- `hasMissingNirms(item)`, `hasInvalidNirms(item)`
- `hasMissingCoO(item)`, `hasInvalidCoO(item)`
- `hasProhibitedItems(item)`
- `isNirms(value)`, `isNotNirms(value)`

**Integration Method**: CoO validation is automatically triggered when `validateCountryOfOrigin: true` is set in header configuration.

## Requirements Specification

## Requirements Specification

### Business Acceptance Criteria (BAC) - Individual Column Validation Pattern

**Implementation Approach**: ASDA 3 requires individual column validation (14 BACs) following the enhanced methodology.

#### BAC1: NOT within NIRMS Scheme

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
And it contains a False value below (case insensitive):
  • No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will pass
```

#### BAC2: Null NIRMS value

```gherkin
Given an ASDA 3 packing list item has no NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

#### BAC3: Invalid NIRMS value

```gherkin
Given an ASDA 3 packing list item doesn't contain a NIRMS value in the 'NIRMs/Non-NIRMs' column [column C] specified in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y"
```

#### BAC4: Null NIRMS value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that have no NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

#### BAC5: Invalid NIRMS value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that don't have a NIRMS value specified in the 'NIRMs/Non-NIRMs' column [column C] in the following (case insensitive):
  • Yes | NIRMS | Green | Y | G | No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

#### BAC6: Null CoO Value

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

#### BAC7: Invalid CoO Value

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

#### BAC8: Null CoO Value, more than 3

```gherkin
Given an ASDA 3 packing list has more than 3 items that have a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

#### BAC9: Invalid CoO Value, more than 3

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

#### BAC10: CoO Value is X or x

```gherkin
Given an ASDA 3 packing list item has a NIRMS value specified
And it contains a True value below:
  • Yes | NIRMS | Green | Y | G
And the CoO value is X or x in the 'Country of Origin' column [column N]
When the packing list is submitted
Then the packing list will pass
```

#### BAC11: Item Present on Prohibited Item List (Treatment Type specified)

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

#### BAC12: Item Present on Prohibited Item List, more than 3 (Treatment Type specified)

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

#### BAC13: Item Present on Prohibited Item List (no Treatment Type specified)

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

#### BAC14: Item Present on Prohibited Item List, more than 3 (no Treatment Type specified)

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

### Technical Requirements (TR) - How to Implement ADO Business Requirements

**TR1: Parser Configuration Enhancement** - The system SHALL add `validateCountryOfOrigin: true` flag to ASDA3 configuration in model-headers.js to enable CoO validation for ADO business requirements (Implementation Pattern: Verified in SAINSBURYS1, SAVERS1, NISA1, TJMORRIS2, TESCO3)

**TR2: Parser Function Signature Update** - The system SHALL update ASDA3 parser to use 6-parameter combineParser.combine() signature to support ADO validation requirements (Implementation Pattern: Confirmed in all CoO-enabled parsers)

**TR3: Field Mapping Addition** - The system SHALL add CoO field mappings (`country_of_origin`, `nirms`, `commodity_code`) to ASDA3 header configuration to support ADO column specifications (Implementation Pattern: Standard approach across CoO-enabled retailers)

**TR4: Validation Integration** - The system SHALL leverage existing validation utilities (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasProhibitedItems) that automatically handle ADO acceptance criteria when CoO validation is enabled

**TR5: Standard Parser Enhancement** - The system SHALL follow established parser enhancement pattern: maintain existing flow (establishment number extraction → header finding → mapParser processing) while adding CoO validation capabilities

**TR6: Error Handling Consistency** - The system SHALL maintain current error handling patterns while enabling automatic validation error reporting for ADO business scenarios

**TR7: Architecture Compliance** - The system SHALL follow established CoO integration patterns used by other retailers to implement ADO business requirements without disrupting existing ASDA3 functionality

### Implementation Constraints (IC) - Current Architecture Integration

**IC1: Configuration Pattern Compliance** - MUST extend existing ASDA3 headers configuration structure in model-headers.js rather than creating new configuration format (Current Pattern: Verified structure at lines 32-44)

**IC2: Parser Architecture Preservation** - MUST maintain current ASDA3 parser flow while adding CoO validation capability through established 6-parameter combineParser integration pattern (Current Architecture: model3.js structure confirmed)

**IC3: Validation Pipeline Integration** - MUST leverage existing validation infrastructure rather than implementing custom validation logic (Existing Infrastructure: Validation utilities confirmed operational)

**IC4: Establishment Number Consistency** - MUST maintain existing establishment number pattern `/^RMS-GB-000015-\d{3}$/i` for ASDA3 trader identification (Current Configuration: Verified in model-headers.js)

**IC5: Error Handling Continuity** - MUST preserve existing error handling and logging patterns while adding CoO validation error reporting (Current Pattern: combineParser error handling confirmed)

### Data Integration Requirements (DIR) - Supporting ADO Business Requirements

**DIR1: Establishment Number Continuity** - The system SHALL maintain existing establishment number pattern `/^RMS-GB-000015-\d{3}$/i` for ASDA3 trader identification while adding CoO validation capability (Current Pattern: Confirmed in model-headers.js lines 32-44)

**DIR2: Enhanced Column Mapping Strategy** - The system SHALL extend current ASDA3 configuration to support ADO column specifications by adding CoO field mappings to existing header structure:

**Current ASDA3 Fields** (maintain existing mappings):

- `description: /Description Of All Retail Goods/i`
- `nature_of_products: /Nature of Product/i`
- `type_of_treatment: /Treatment Type/i`
- `number_of_packages: /Number of Packages/i`
- `total_net_weight_kg: /Net Weight/i`

**New CoO Fields** (add to support ADO requirements):

- `country_of_origin: /Country of Origin/i` (for ADO Column N)
- `nirms: /NIRMs\/Non-NIRMs/i` (for ADO Column C)
- `commodity_code: /Commodity Code/i` (for ADO Column M)

**DIR3: Validation Configuration** - The system SHALL add `validateCountryOfOrigin: true` flag to enable automatic processing of ADO acceptance criteria through existing validation pipeline

**DIR4: NIRMS Value Recognition** - The system SHALL leverage existing isNirms() and isNotNirms() functions that automatically recognize ADO-specified NIRMS values (Yes|NIRMS|Green|Y|G for true, No|Non-NIRMS|Non NIRMS|Red|N|R for false)

### Technical Implementation (TI) - Code Changes to Support ADO Requirements

#### TI1: model-headers.js Configuration Enhancement

**File**: `app/services/model-headers.js`

**Current ASDA3 Configuration** (lines 32-44):

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
}
```

**Enhanced Configuration** (to support ADO business requirements):

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
  // Add CoO validation to support ADO Column specifications
  validateCountryOfOrigin: true,                    // Enable CoO validation
  country_of_origin: /Country of Origin/i,          // ADO Column N
  nirms: /NIRMs\/Non-NIRMs/i,                      // ADO Column C
  commodity_code: /Commodity Code/i,                // ADO Column M
}
```

#### TI2: Parser Function Signature Update

**File**: `app/services/parsers/asda/model3.js`

**Current Implementation** (5-parameter signature):

```javascript
// Current combineParser.combine() call
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.ASDA3,
  establishmentNumbers,
);
```

**Enhanced Implementation** (6-parameter signature to support ADO validation):

```javascript
// Enhanced combineParser.combine() call for ADO CoO requirements
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.ASDA3,
  establishmentNumbers,
  headers.ASDA3, // NEW: Headers parameter enables ADO CoO validation
);
```

**Implementation Pattern**: Follows established CoO integration used by SAINSBURYS1, SAVERS1, NISA1, TESCO3, TJMORRIS2.

#### TI3: Headers Import Addition

**File**: `app/services/parsers/asda/model3.js`

**Current Imports**:

```javascript
const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
// ... other existing imports
```

**Enhanced Imports** (add headers import for ADO CoO support):

```javascript
const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers"); // NEW: Enable ADO CoO configuration
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
// ... other existing imports
```

#### TI4: Automatic Validation Integration

**No Additional Code Required** - ADO acceptance criteria (AC1-AC14) are automatically handled by existing validation infrastructure when `validateCountryOfOrigin: true` is enabled:

**Available Validation Functions** (`packing-list-validator-utilities.js`):

- `hasMissingNirms(item)` - Implements BAC2, BAC4 (null NIRMS detection)
- `hasInvalidNirms(item)` - Implements BAC3, BAC5 (invalid NIRMS validation)
- `hasMissingCoO(item)` - Implements BAC6, BAC8 (missing CoO for NIRMS items)
- `hasInvalidCoO(item)` - Implements BAC7, BAC9 (CoO format validation)
- `hasProhibitedItems(item)` - Implements BAC11-BAC14 (prohibited items checking)

**Automatic Error Messages** - Standard error messages match ADO acceptance criteria:

- "NIRMS/Non-NIRMS goods not specified in sheet X row Y" (BAC2, BAC4)
- "Invalid entry for NIRMS/Non-NIRMS goods in sheet X row Y" (BAC3, BAC5)
- "Missing Country of Origin in sheet X row Y" (BAC6, BAC8)
- "Invalid Country of Origin ISO Code in sheet X row Y" (BAC7, BAC9)
- "Prohibited item identified on the packing list in sheet X row Y" (BAC11-BAC14)

**Automatic NIRMS Recognition** - Existing functions handle ADO value mapping:

- `isNirms()`: Recognizes ADO True values (Yes|NIRMS|Green|Y|G) case insensitive
- `isNotNirms()`: Recognizes ADO False values (No|Non-NIRMS|Non NIRMS|Red|N|R) case insensitive

**Automatic CoO Validation** - Existing functions handle ADO format requirements:

- ISO 2-digit country codes (BAC7, BAC9)
- Comma-separated ISO codes (BAC7, BAC9)
- Special "X"/"x" values pass validation (BAC10)

### Implementation Summary

**ADO Business Requirements Status**:

- ✅ **All 14 Acceptance Criteria (AC1-AC14) documented from ADO ticket**
- ✅ **Column specifications (C, E, M, N) treated as business requirements**
- ✅ **NIRMS value mapping aligned with ADO specifications**
- ✅ **Prohibited items logic correctly results in validation failure**

**Technical Implementation Status**:

- ✅ **Validation functions exist and operational** (packing-list-validator-utilities.js confirmed)
- ✅ **Error message templates implemented** (match ADO acceptance criteria exactly)
- ✅ **NIRMS recognition patterns functional** (support ADO value specifications)
- ✅ **CoO format validation operational** (handles ADO format requirements)
- ✅ **ASDA3 base configuration exists** (model-headers.js lines 32-44 confirmed)
- 🔧 **Configuration Enhancement Required**: Add 4 properties to enable ADO validation
- 🔧 **Parser Enhancement Required**: Add 1 parameter to enable CoO validation pipeline

**Implementation Effort**: **Minimal** - Add 4 configuration properties and 1 parameter to leverage existing validation infrastructure for ADO business requirements.

**Business Value**: Enables compliance with ADO ticket AB#591514 requirements using proven validation patterns from existing CoO implementations.

---

## Validation Summary

**✅ CORRECTED METHODOLOGY VALIDATION**:

**Business Requirements Authority** (from ADO ticket AB#591514):

- All 14 acceptance criteria (AC1-AC14) implemented as business requirements
- Column specifications (C, E, M, N) treated as format enhancement requirements
- NIRMS value mapping follows ADO business standards
- Prohibited items logic correctly results in validation failure per business rules

**Technical Implementation Feasibility** (from workspace analysis):

- Existing validation infrastructure supports all ADO requirements automatically
- Established CoO patterns from 5 retailers provide proven implementation approach
- Minimal code changes required (4 configuration properties + 1 parameter)
- Current ASDA3 architecture fully compatible with CoO enhancement

**Requirements Integration Validation**:

- Business requirements (ADO) drive what to implement ✅
- Technical analysis (workspace) defines how to implement ✅
- No conflict between business needs and technical capabilities ✅
- Implementation approach leverages existing proven patterns ✅

---

**Specification Status**: **Implementation Ready** - This document provides complete requirements for implementing ADO ticket AB#591514 using corrected business-requirements-first methodology with technical implementation guidance from existing CoO validation patterns.

## Implementation Roadmap

### Development Approach

**Phase 1: Configuration Enhancement**

1. Add CoO field mappings to ASDA3 configuration (model-headers.js)
2. Enable validation flag (`validateCountryOfOrigin: true`)
3. Update parser to use 6-parameter combineParser signature

**Phase 2: Integration Testing**

1. Verify ADO acceptance criteria through automated validation
2. Test with sample data matching ADO column specifications
3. Confirm error messages align with ADO requirements

**Phase 3: Business Validation**

1. Validate against ADO business scenarios
2. Confirm prohibited items checking functionality
3. Verify NIRMS value recognition per ADO standards

### Technical Implementation Pattern

CoO validation for ASDA 3 follows the established architecture pattern:

1. **Enhanced Parser Structure** (supporting ADO requirements):

   ```javascript
   // Standard parser structure enhanced for CoO validation
   const combineParser = require("../../parser-combine");
   const parserModel = require("../../parser-model");
   const headers = require("../../model-headers"); // NEW: For CoO configuration
   const { mapParser } = require("../../parser-map");
   const regex = require("../../../utilities/regex");
   const { rowFinder } = require("../../../utilities/row-finder");
   const { matchesHeader } = require("../../matches-header");
   const MatcherResult = require("../../matcher-result");

   exports.parse = (packingListJson) => {
     try {
       const sheets = Object.keys(packingListJson);
       let packingListContents = [];
       let establishmentNumbers = [];

       // Extract establishment number
       const establishmentNumber = regex.findMatch(
         headers.ASDA3.establishmentNumber.regex,
         packingListJson[sheets[0]],
       );

       // Process each sheet
       for (const sheet of sheets) {
         establishmentNumbers = regex.findAllMatches(
           regex.remosRegex,
           packingListJson[sheet],
           establishmentNumbers,
         );

         // Find header using callback pattern
         const headerTitles = Object.values(headers.ASDA3.regex);
         const headerCallback = function (x) {
           return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
         };

         const headerRow = rowFinder(packingListJson[sheet], headerCallback);
         const dataRow = headerRow + 1;

         // Process with mapParser
         packingListContentsTemp = mapParser(
           packingListJson[sheet],
           headerRow,
           dataRow,
           headers.ASDA3,
           sheet,
         );
         packingListContents = packingListContents.concat(
           packingListContentsTemp,
         );
       }

       // Return combined result with actual function signature
       return combineParser.combine(
         establishmentNumber,
         packingListContents,
         true,
         parserModel.ASDA3,
         establishmentNumbers,
         headers.ASDA3,
       );
     } catch (error) {
       logger.logError(filenameForLogging, "parse()", error);
       return combineParser.combine(null, [], false, parserModel.NOMATCH);
     }
   };
   ```

2. **Header Configuration** in `model-headers.js` (actual pattern from workspace):

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
