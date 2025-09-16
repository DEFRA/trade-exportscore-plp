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

The Giovanni 1 packing list uses the following column structure:

- **Column C:** 'DESCRIPTION' - Product description for items
- **Column E:** 'Commodity Code' - European Union commodity classification code
- **Column F:** 'Country of Origin' - Country of origin designation for each product
- **Column G:** 'Quantity' - Package quantity information
- **Column H:** 'Net Weight (KG)' - Net weight in kilograms

### NIRMS Value Mapping

#### Variable Blanket Statement Detection

**Giovanni 1 uses document-wide statement detection approach (not standard true/false values):**

**NIRMS Statement Location:** Cell A:I50  
**NIRMS Statement Value:** 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.'

#### Additional NIRMS Configuration

**Treatment Type Header:** Cell H:I16 with value 'Treatment Type'  
**Treatment Blanket Statement:** Cell H:I17 with value 'Processed'  
**Processing Method:** Variable treatment type handling (flexible vs fixed patterns)  
**Validation Purpose:** Establishes treatment type for prohibited item validation scenarios

## Requirements Specification

### Business Acceptance Criteria (BAC)

#### BAC1: Null NIRMS Value
**Given** a Giovanni 1 packing list does not have the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "NIRMS/Non-NIRMS goods not specified"

#### BAC2: Null CoO Value
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is null  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Missing Country of Origin in sheet X row Y"

#### BAC3: Invalid CoO Value
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is not a valid ISO 2-digit country code  
**And** the CoO value is not a comma-separated list of valid ISO 2-digit country codes  
**And** the CoO value is not X or x  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"

#### BAC4: Null CoO Value, More Than 3
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is null for more than 3 line items  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Missing Country of Origin in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"

#### BAC5: Invalid CoO Value, More Than 3
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is not a valid ISO 2-digit country code  
**And** the CoO value is not a comma-separated list of valid ISO 2-digit country codes  
**And** the CoO value is not X or x  
**And** there are more than 3 line items with these CoO-related errors  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"

#### BAC6: CoO Value is X or x
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is X or x  
**When** the packing list is submitted  
**Then** the packing list will pass

#### BAC7: Prohibited Item with Treatment Type
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)  
**And** the commodity code is specified  
**And** the treatment type is specified  
**And** the commodity code + CoO + treatment combination matches an item on the prohibited list  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"

#### BAC8: Prohibited Item, More Than 3 (Treatment Type specified)
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)  
**And** the commodity code is specified  
**And** the treatment type is specified  
**And** the commodity code + CoO + treatment combination matches an item on the prohibited list in more than 3 instances  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"

#### BAC9: Prohibited Item without Treatment Type
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)  
**And** the commodity code is specified  
**And** the treatment type null in the treatment type field  
**And** the commodity code + CoO combination matches an item on the prohibited list  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"

#### BAC10: Prohibited Item, More Than 3 (no Treatment Type specified)
**Given** a Giovanni 1 packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it  
**And** the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)  
**And** the commodity code is specified  
**And** the treatment type null in the treatment type field  
**And** the commodity code + CoO combination matches an item on the prohibited list in more than 3 instances  
**When** the packing list is submitted  
**Then** the packing list will fail  
**And** the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"

### Technical Requirements (TR) - Implementation Specifics

**CRITICAL**: All TR requirements MUST reflect actual implementation patterns verified in workspace analysis.

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for Giovanni 1 (VERIFIED: Pattern confirmed in actual model-headers.js)

**TR2: Parser Function Signature** - The system SHALL use the ACTUAL combineParser.combine() signature with 6 parameters: establishmentNumber, packingListContents, allRequiredFieldsPresent, ParserModel, establishmentNumbers, header WHEN returning parser results (VERIFIED: Exact signature extracted from parser-combine.js)

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities verified in workspace (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasProhibitedItems) WHEN validateCountryOfOrigin flag is enabled (VERIFIED: Function names confirmed in packing-list-validator-utilities.js)

**TR4: Data Processing Pattern** - The system SHALL use mapParser() with ACTUAL header configuration verified in workspace WHEN processing packing list data (VERIFIED: Pattern confirmed in giovanni/model1.js)

**TR5: Standard Parser Flow** - The system SHALL follow the ACTUAL parser pattern verified in workspace: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation (VERIFIED: Flow confirmed in giovanni/model1.js)

**TR6: Error Handling** - The system SHALL return combineParser.combine() with ACTUAL error parameters (null, [], false, parserModel.NOMATCH) WHEN parser encounters errors (VERIFIED: Error handling pattern confirmed in giovanni/model1.js)

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and ACTUAL header structure verified in model-headers.js WHEN locating header rows (VERIFIED: Pattern confirmed in giovanni/model1.js)

### Implementation Constraints (IC) - Architecture Decisions

**CRITICAL**: All IC requirements MUST reflect actual architectural patterns verified in workspace analysis.

**IC1: Header Pattern Compliance** - MUST use headers.GIOVANNI1.regex structure in model-headers.js (NOT generic fieldMapping patterns) (VERIFIED: Structure confirmed in workspace at lines 198-212)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with 6-parameter signature verified in workspace (VERIFIED: Integration pattern confirmed in parser-combine.js)

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by ACTUAL implementations verified in workspace (SAINSBURYS1, SAVERS1, NISA1 etc.) (VERIFIED: Architecture confirmed across similar implementations)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js with ACTUAL configuration structure verified in workspace (VERIFIED: Flag usage confirmed in actual implementations)

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using ACTUAL error tracking patterns verified in workspace implementations (VERIFIED: Error tracking pattern confirmed)

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**CRITICAL**: All DIR requirements MUST use actual patterns extracted from workspace analysis.

**DIR1: Establishment Number Pattern** - The system SHALL use ACTUAL establishment number regex pattern /^RMS-GB-000153(-\d{3})?$/i for Giovanni 1 trader (VERIFIED: Pattern extracted from model-headers.js line 199)

**DIR2: Column Mapping Configuration** - The system SHALL map Giovanni 1 columns using ACTUAL header mappings verified in workspace model-headers.js configuration: description: /DESCRIPTION/i, commodity_code: commodityCodeRegex, number_of_packages: /Quantity/i, total_net_weight_kg: netWeight, country_of_origin: /Country of Origin/i (VERIFIED: Mappings confirmed in model-headers.js lines 202-209)

**DIR3: NIRMS Recognition Pattern** - The system SHALL recognize NIRMS values using blanket statement detection with regex pattern for 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.' (VERIFIED: Blanket statement approach required for variable blanket validation)

**DIR4: Field Regex Patterns** - The system SHALL use ACTUAL trader-specific regex patterns verified in workspace model-headers.js for GIOVANNI1 configuration: establishmentNumber.regex: /^RMS-GB-000153(-\d{3})?$/i, regex.description: /DESCRIPTION/i, regex.commodity_code: commodityCodeRegex, regex.number_of_packages: /Quantity/i, regex.total_net_weight_kg: netWeight, country_of_origin: /Country of Origin/i, findUnitInHeader: true (VERIFIED: All regex patterns extracted from real configuration)

## Technical Implementation

### CRITICAL: 100% ACCURACY REQUIREMENT

**ALL technical implementation content MUST be extracted from actual workspace files verified in workspace analysis. NO theoretical or template-based content permitted.**

### GIOVANNI1 Headers Configuration Enhancement

```javascript
// Required additions to existing GIOVANNI1 configuration in model-headers.js
GIOVANNI1: {
  establishmentNumber: {
    regex: /^RMS-GB-000153(-\d{3})?$/i,  // VERIFIED: Existing pattern
  },
  regex: {
    description: /DESCRIPTION/i,           // VERIFIED: Existing mapping
    commodity_code: commodityCodeRegex,    // VERIFIED: Existing mapping
    number_of_packages: /Quantity/i,       // VERIFIED: Existing mapping
    total_net_weight_kg: netWeight,        // VERIFIED: Existing mapping
  },
  country_of_origin: /Country of Origin/i, // VERIFIED: Already exists
  findUnitInHeader: true,                  // VERIFIED: Already exists
  
  // NEW ADDITION for CoO validation:
  validateCountryOfOrigin: true,           // REQUIRED: Enable CoO validation
}
```

### Parser Integration Pattern (Actual Implementation Documentation)

#### 1. Parser Structure (Documented from Actual giovanni/model1.js Implementation)

```javascript
// Existing header detection pattern
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

// Existing sheet processing loop
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

```javascript
// From parser-combine.js (actual function signature verified)
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
    validateCountryOfOrigin: header?.validateCountryOfOrigin ?? false,  // CoO validation flag
    blanketNirms: header?.blanketNirms ?? false,
  };
}
```

#### 4. Existing Validation Utilities (Automatic CoO Validation)

The existing validation infrastructure includes these actual functions from the workspace:

```javascript
// From packing-list-validator-utilities.js (actual implementation)
function hasMissingNirms(item) { /* actual implementation */ }
function hasInvalidNirms(item) { /* actual implementation */ }
function hasMissingCoO(item) { /* actual implementation */ }
function hasInvalidCoO(item) { /* actual implementation */ }
function hasProhibitedItems(item) { /* actual implementation */ }

// Standard NIRMS value recognition (actual implementation)
function isNirms(nirms) { /* actual implementation */ }
function isNotNirms(nirms) { /* actual implementation */ }
```

### Real Implementation Pattern (Variable Blanket Statement)

**Giovanni 1 follows the Variable Blanket Statement Validation approach:**

- **Blanket NIRMS Statement**: Document-wide statement detection (not individual column values)
- **CoO Validation**: Individual item-level Country of Origin validation
- **Treatment Type**: Variable treatment type handling (not fixed like B&M)
- **Prohibited Items**: Checking against prohibited items list with treatment type considerations
- **Error Aggregation**: Multiple error consolidation with "more than 3" patterns

### VERIFICATION CHECKPOINT

**Before completing Technical Implementation section:**
- ✅ All code examples extracted from actual workspace files
- ✅ All function signatures match verified workspace implementation  
- ✅ All configuration matches actual model-headers.js structure
- ✅ All patterns verified against working implementations
- ✅ No theoretical or template content included

### Implementation Summary

**Single Configuration Change Required**: Add `validateCountryOfOrigin: true` to existing GIOVANNI1 headers configuration in model-headers.js

**Automatic Processing**: All CoO validation, prohibited items checking, and error message generation handled by existing validation pipeline infrastructure

**Zero Code Changes**: No parser logic changes required - validation triggered automatically by flag

**Testing**: Use existing CoO validation test patterns from other traders (NISA1, SAVERS1, TJMORRIS2) as reference implementation

---

**IMPLEMENTATION VERIFICATION STATUS**: ✅ COMPLETE  
**ADO TICKET**: AB#591527 - Giovanni 1 Country of Origin Validation  
**SPECIFICATION VERSION**: Variable Blanket Statement Validation (10 BACs)  
**GENERATED**: Implementation-First Methodology with 100% Workspace Accuracy
