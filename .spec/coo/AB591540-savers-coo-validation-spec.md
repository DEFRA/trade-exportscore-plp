# Savers Country of Origin Validation Specification

**Document Version:** 1.0  
**Date:** September 15, 2025  
**Status:** Draft  
**Related Work Items:** AB#591540  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the requirements for Country of Origin (CoO) validation for Savers trader packing lists within the DEFRA trade-exportscore-plp service. The validation will ensure NIRMS compliance and prohibited item checking for Savers-specific Excel format.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on Savers packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect relevant CoO fields from Savers trader format
- Provide basic validation for Country of Origin compliance
- Enforce NIRMS scheme validation rules
- Check against prohibited items list
- Generate comprehensive error messages with location details

## Savers Trader Format Specification

### Column Mapping

The Savers packing list will use the following column structure based on ADO ticket AB#591540:

- **Column J:** 'NIRMS / SPS Item' - NIRMS eligibility indicator for each product
- **Column G:** 'Country of Origin' - Country of origin designation for each product
- **Column L:** 'Type of Treatment' - Treatment type applied to products
- **Column E:** 'EU Commodity Code' - European Union commodity classification code

### NIRMS Value Mapping

**Savers will follow the standard NIRMS values as defined in AB#592259:**

**True Values (NIRMS = Yes, case insensitive):**

- Yes | NIRMS | Green | Y | G

**False Values (NIRMS = No, case insensitive):**

- No | Non-NIRMS | Non NIRMS | Red | N | R

## Requirements Specification

### Business Acceptance Criteria (BAC)

#### BAC1: NOT within NIRMS Scheme

```gherkin
Given a Savers packing list item has a NIRMS value specified in the 'NIRMS / SPS Item' column [column J]
And it contains a False value below (case insensitive):
  • No | Non-NIRMS | Non NIRMS | Red | N | R
When the packing list is submitted
Then the packing list will pass
```

#### BAC2: Null NIRMS value

```gherkin
Given a Savers packing list item has no NIRMS value specified in the 'NIRMS / SPS Item' column [column J]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

#### BAC3: Invalid NIRMS value - Single Item

```gherkin
Given a Savers packing list item has a NIRMS value specified in the 'NIRMS / SPS Item' column [column J]
And it contains an invalid value (not matching standard NIRMS values)
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

#### BAC4: Invalid NIRMS value - Multiple Items

```gherkin
Given a Savers packing list has multiple items with invalid NIRMS values in the 'NIRMS / SPS Item' column [column J]
And there are 3 or fewer invalid items
When the packing list is submitted
Then the packing list will fail
And individual failure reasons are provided for each invalid item: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

#### BAC5: Invalid NIRMS value - More Than 3 Items

```gherkin
Given a Savers packing list has more than 3 items with invalid NIRMS values in the 'NIRMS / SPS Item' column [column J]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified - more than 3 errors"
```

#### BAC6: Null CoO Value

```gherkin
Given a Savers packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • Yes | NIRMS | Green | Y | G
And the CoO value is null in the 'Country of Origin' column [column G]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

#### BAC7: Invalid CoO Format - Single Item

```gherkin
Given a Savers packing list item has a NIRMS value specified as True
And the CoO value in the 'Country of Origin' column [column G] does not match valid country format
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin in sheet X row Y"
```

#### BAC8: Invalid CoO Format - Multiple Items

```gherkin
Given a Savers packing list has multiple items with invalid CoO values in the 'Country of Origin' column [column G]
And there are 3 or fewer invalid items
When the packing list is submitted
Then the packing list will fail
And individual failure reasons are provided for each invalid item: "Invalid Country of Origin in sheet X row Y"
```

#### BAC9: Invalid CoO Format - More Than 3 Items

```gherkin
Given a Savers packing list has more than 3 items with invalid CoO values in the 'Country of Origin' column [column G]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin - more than 3 errors"
```

#### BAC10: CoO Placeholder Acceptance

```gherkin
Given a Savers packing list item has a NIRMS value specified as True
And the CoO value is "X" in the 'Country of Origin' column [column G]
When the packing list is submitted
Then the packing list will pass
And the item is accepted as valid
```

#### BAC11: Prohibited Item - Single Item with Treatment Type

```gherkin
Given a Savers packing list item contains a prohibited item based on commodity code or description
And the 'Type of Treatment' column [column L] has a specified treatment type
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item detected in sheet X row Y"
```

#### BAC12: Prohibited Item - Multiple Items with Treatment Type

```gherkin
Given a Savers packing list has more than 3 prohibited items based on commodity code or description
And the 'Type of Treatment' column [column L] has specified treatment types
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item detected - more than 3 errors"
```

#### BAC13: Prohibited Item - Single Item without Treatment Type

```gherkin
Given a Savers packing list item contains a prohibited item based on commodity code or description
And the 'Type of Treatment' column [column L] has no specified treatment type
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item detected in sheet X row Y"
```

#### BAC14: Prohibited Item - Multiple Items without Treatment Type

```gherkin
Given a Savers packing list has more than 3 prohibited items based on commodity code or description
And the 'Type of Treatment' column [column L] has no specified treatment types
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item detected - more than 3 errors"
```

### Technical Requirements (TR) - Implementation Specifics

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for Savers

**TR2: Parser Function Signature** - The system SHALL use combineParser.combine(establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel.SAVERS1, establishmentNumbers, headers.SAVERS1) signature WHEN returning parser results

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasProhibitedItems) WHEN validateCountryOfOrigin flag is enabled

**TR4: Data Processing Pattern** - The system SHALL use mapParser(packingListJson[sheet], headerRow, dataRow, headers.SAVERS1, sheet) WHEN processing packing list data

**TR5: Standard Parser Flow** - The system SHALL follow the standard parser pattern: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation

**TR6: Error Handling** - The system SHALL return combineParser.combine(establishmentNumber, [], false, parserModel.SAVERS1, [], headers.SAVERS1) WHEN parser encounters errors

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and Object.values(headers.SAVERS1.regex) WHEN locating header rows

### Implementation Constraints (IC) - Architecture Decisions

**IC1: Header Pattern Compliance** - MUST use headers.SAVERS1.regex structure in model-headers.js (NOT generic fieldMapping patterns)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with 6-parameter signature

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by similar implementations (SAINSBURYS1, NISA1, etc.)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js configuration structure

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using existing error tracking patterns

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**DIR1: Establishment Number Pattern** - The system SHALL use /RMS-GB-000247-(\d{3})?/i regex pattern in model-headers.js SAVERS1 configuration

**DIR2: Column Mapping Configuration** - The system SHALL map Savers columns using header mappings in model-headers.js SAVERS1.regex configuration:

- description: /Item Description/i
- commodity_code: /EU Commodity Code/i
- number_of_packages: /CASE Quantity/i
- total_net_weight_kg: /Net Weight/i
- country_of_origin: /Country of Origin/i
- type_of_treatment: /Type of Treatment/i
- nirms: /NIRMS \/ SPS Item/i

**DIR3: Standard NIRMS Recognition** - The system SHALL recognize standard NIRMS values (Yes|NIRMS|Green|Y|G for true, No|Non-NIRMS|Non NIRMS|Red|N|R for false) case insensitively using existing validation utilities

**DIR4: Validation Configuration** - The system SHALL use configuration flags:

- validateCountryOfOrigin: true (enables CoO validation)
- findUnitInHeader: true (enables weight unit detection)
- invalidSheets: ["DC Sheet (with Calcs)", "SPS Codes"] (excludes these sheets from processing)

## Technical Implementation

### Parser Integration Pattern

CoO validation will follow the standard parser architecture:

#### 1. Parser Structure

```javascript
// Standard parser imports
const combineParser = require("../../parser-combine");
const parserModel = require("../../parser-model");
const headers = require("../../model-headers");
const { rowFinder } = require("../../../utilities/row-finder");
const { mapParser } = require("../../parser-map");
const { matchesHeader } = require("../../matches-header");
const MatcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const logger = require("../../../utilities/logger");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  const establishmentNumber = regex.findMatch(
    headers.SAVERS1.establishmentNumber.regex,
    packingListJson[sheets[0]],
  );

  try {
    let packingListContents = [];
    let packingListContentsTemp = [];
    let establishmentNumbers = [];

    // Header finding using standard pattern
    const headerTitles = Object.values(headers.SAVERS1.regex);
    const callback = function (x) {
      return matchesHeader(headerTitles, [x]) === MatcherResult.CORRECT;
    };

    const headerRow = rowFinder(packingListJson[sheets[0]], callback);
    const dataRow = headerRow + 1;

    // Sheet processing with validation
    for (const sheet of sheets) {
      if (!headers.SAVERS1.invalidSheets.includes(sheet)) {
        packingListContentsTemp = mapParser(
          packingListJson[sheet],
          headerRow,
          dataRow,
          headers.SAVERS1,
          sheet,
        );

        establishmentNumbers = regex.findAllMatches(
          regex.remosRegex,
          packingListJson[sheet],
          establishmentNumbers,
        );

        // Filter out empty rows
        packingListContents = packingListContents.concat(
          packingListContentsTemp.filter(
            (row) =>
              !(
                row.description === 0 &&
                row.number_of_packages === 0 &&
                row.total_net_weight_kg === 0
              ),
          ),
        );
      }
    }

    return combineParser.combine(
      establishmentNumber,
      packingListContents,
      true,
      parserModel.SAVERS1,
      establishmentNumbers,
      headers.SAVERS1,
    );
  } catch (err) {
    logger.logError(filenameForLogging, "parse()", err);
    return combineParser.combine(
      establishmentNumber,
      [],
      false,
      parserModel.SAVERS1,
      [],
      headers.SAVERS1,
    );
  }
}
```

#### 2. Header Configuration

```javascript
// model-headers.js SAVERS1 configuration
SAVERS1: {
  invalidSheets: ["DC Sheet (with Calcs)", "SPS Codes"],
  establishmentNumber: {
    regex: /RMS-GB-000247-(\d{3})?/i,
  },
  regex: {
    description: /Item Description/i,
    commodity_code: /EU Commodity Code/i,
    number_of_packages: /CASE Quantity/i,
    total_net_weight_kg: /Net Weight/i,
  },
  country_of_origin: /Country of Origin/i,
  type_of_treatment: /Type of Treatment/i,
  nirms: /NIRMS \/ SPS Item/i,
  validateCountryOfOrigin: true,  // CoO validation enabled
  findUnitInHeader: true,         // Weight unit detection enabled
}
```

#### 3. Validation Pipeline Integration

The validation system will automatically process items when `validateCountryOfOrigin: true` is set in headers configuration. The validation utilities will handle all business rule checking automatically when combineParser.combine() passes the header configuration with the validation flag enabled.

#### 4. Sheet Processing Logic

- **Invalid Sheets Exclusion**: Will automatically skip ["DC Sheet (with Calcs)", "SPS Codes"] sheets during processing
- **Empty Row Filtering**: Will filter out rows where description, number_of_packages, and total_net_weight_kg are all 0
- **REMOS Extraction**: Will use regex.findAllMatches with regex.remosRegex to extract establishment numbers
- **Header Detection**: Will use matchesHeader with MatcherResult.CORRECT for precise header row identification

### CoO Validation Utilities

The validation infrastructure will include these functions:

```javascript
// From packing-list-validator-utilities.js
function hasMissingNirms(item) {
  /* ... */
}
function hasInvalidNirms(item) {
  /* ... */
}
function hasMissingCoO(item) {
  /* ... */
}
function hasInvalidCoO(item) {
  /* ... */
}
function hasProhibitedItems(item) {
  /* ... */
}

// Standard NIRMS value recognition
function isNirms(nirms) {
  /* ... */
}
function isNotNirms(nirms) {
  /* ... */
}
```

### Validation Pipeline Integration

```javascript
// From packing-list-column-validator.js
function getCountryOfOriginValidationResults(packingList) {
  // Will handle CoO validation when validateCountryOfOrigin: true
}
```

### Implementation Pattern

**Individual Column Validation** (SAVERS1 configuration):

- **Column Mapping**: Column J (NIRMS / SPS Item), Column G (Country of Origin), Column L (Type of Treatment), Column E (EU Commodity Code)
- **NIRMS Values**: Standard true/false mapping using validation utilities
- **Header Flags**: `validateCountryOfOrigin: true` and `findUnitInHeader: true` in model-headers.js
- **Validation**: Will use individual item-level NIRMS and CoO validation through validation pipeline
- **Sheet Exclusion**: Will automatically exclude "DC Sheet (with Calcs)" and "SPS Codes" sheets
- **Establishment Number**: Will use /RMS-GB-000247-(\d{3})?/i pattern for RMS number extraction

```

```
