# Nisa 2 Country of Origin Validation Implementation Guide

**ADO Ticket:** AB#591536  
**Specification Source:** .spec/coo/AB591536-nisa2-coo-validation-spec.md  
**Implementation Type:** Type 1 - Configuration-Driven Parser Enhancement  
**CoO Validation Pattern:** Type 1: Column-Based, Conventional NIRMS

## Implementation Overview

### Business Requirements Summary

**User Story:** As a caseworker, I want the Packing List Parser to help me validate Country of Origin (CoO) entries on Nisa 2 packing lists so that I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements.

**Column Mapping (from specification):**

- **Column F:** 'TARIFF CODE EU' - Commodity Code for product classification
- **Column M:** 'COUNTRY OF ORIGIN' - Country of Origin information
- **Column O:** 'NIRMS' - NIRMS classification (row-level)
- **Column Q:** 'TYPE OF TREATMENT' - Treatment Type specification

**NIRMS Value Mapping:** Nisa 2 follows standard NIRMS values:

- **True Values (NIRMS = Yes):** Yes | NIRMS | Green | Y | G (case insensitive)
- **False Values (NIRMS = No):** No | Non-NIRMS | Non NIRMS | Red | N | R (case insensitive)

**Validation Approach:** Individual column model (14 BAC pattern) – row-level NIRMS column, no blanket statement present.

### Architecture Decision

This implementation follows the Type 1 CoO validation pattern:

- **Configuration-based validation** through model-headers.js
- **Existing validation pipeline integration** via combineParser.combine()
- **Type 1 configuration** with conventional NIRMS column mapping
- **Zero custom parsing logic** - all validation through existing utilities

## Type 1 Implementation Steps

### Step 1: Update Parser Configuration (model-headers.js) - TYPE 1

**File:** `app/services/model-headers.js`

**Current NISA2 Configuration:**

```javascript
NISA2: {
  establishmentNumber: {
    regex: /RMS-GB-000025-(\d{3})?/i,
  },
  regex: {
    description: /PART NUMBER DESCRIPTION/i,
    commodity_code: /TARIFF CODE EU/i,
    number_of_packages: /PACKAGES/i,
    total_net_weight_kg: /NET WEIGHT TOTAL/i,
    nature_of_products: /PRODUCT TYPE CATEGORY/i,
    header_net_weight_unit: /NET WEIGHT PACKAGE/i,
  },
  findUnitInHeader: true,
},
```

**⚠️ CRITICAL: Update Required - Add CoO Validation Fields**

**Updated NISA2 Configuration:**

```javascript
NISA2: {
  establishmentNumber: {
    regex: /RMS-GB-000025-(\d{3})?/i,
  },
  regex: {
    // ⚠️ EXISTING FIELDS ONLY: Current NISA2 configuration - DO NOT add new fields here
    description: /PART NUMBER DESCRIPTION/i,
    commodity_code: /TARIFF CODE EU/i,
    number_of_packages: /PACKAGES/i,
    total_net_weight_kg: /NET WEIGHT TOTAL/i,
    nature_of_products: /PRODUCT TYPE CATEGORY/i,
    header_net_weight_unit: /NET WEIGHT PACKAGE/i,
  },
  findUnitInHeader: true,
  // ⚠️ REQUIRED ADDITIONS for CoO validation (OUTSIDE regex property):
  country_of_origin: /COUNTRY OF ORIGIN/i,
  type_of_treatment: /TYPE OF TREATMENT/i,
  nirms: /NIRMS/i,
  validateCountryOfOrigin: true,
},
```

**✅ Key Changes:**

1. **commodity_code already present** in regex section - no changes needed there
2. **country_of_origin**: Added `/COUNTRY OF ORIGIN/i` mapping for Column M
3. **type_of_treatment**: Added `/TYPE OF TREATMENT/i` mapping for Column Q
4. **nirms**: Added `/NIRMS/i` mapping for Column O (conventional NIRMS values)
5. **validateCountryOfOrigin**: Added `true` flag to enable CoO validation pipeline

**⚠️ CRITICAL 4-Property Checklist Verification:**

- [x] **description** - In regex section (parsing field) ✅
- [x] **commodity_code** - Already in regex section ✅
- [x] **country_of_origin** - Outside regex section (validation field) ✅
- [x] **nirms** - Outside regex section (validation field) ✅

### Step 2: Verify Parser Implementation (Minimal Changes)

**File:** `app/services/parsers/nisa/model2.js`

**Expected Pattern:** Parser should already follow standard pattern:

```javascript
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  parserModel.NISA2,
  establishmentNumbers,
  headers.NISA2,
);
```

**⚠️ Verification Required:** Ensure parser passes `headers.NISA2` configuration to combineParser for validation pipeline integration.

### Step 3: Type 1 Testing Implementation

**⚠️ CRITICAL TESTING REQUIREMENTS:**

**Required Test Files:**

- `test/unit/services/parser-service/nisa/model2.test.js` - Test cases
- `test/unit/test-data-and-results/models/nisa/model2.js` - Test data models (MUST CREATE ALL)
- `test/unit/test-data-and-results/results/nisa/model2.js` - Expected results (UPDATE EXISTING)
- Test data in `app/packing-lists/nisa/` directory

#### Type 1: Column-Based, Conventional NIRMS Testing

**File:** `test/unit/services/parser-service/nisa/model2.test.js`

```javascript
describe("Nisa 2 CoO Validation Tests - Type 1", () => {
  // Order tests by BAC sequence for maintainability

  test("BAC1: NOT within NIRMS Scheme - passes validation", async () => {
    const result = await parserService.findParser(
      model.nonNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("BAC2: Null NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.nullNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "NIRMS/Non-NIRMS goods not specified",
    );
  });

  test("BAC3: Invalid NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid entry for NIRMS/Non-NIRMS goods",
    );
  });

  test("BAC4: Null NIRMS value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.nullNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC5: Invalid NIRMS value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC6: Null CoO Value - validation errors", async () => {
    const result = await parserService.findParser(model.nullCooModel, filename);
    expect(result.business_checks.failure_reasons).toContain(
      "Missing Country of Origin",
    );
  });

  test("BAC7: Invalid CoO Value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
  });

  test("BAC8: Null CoO Value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.nullCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC9: Invalid CoO Value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC10: CoO Placeholder X - passes validation", async () => {
    const result = await parserService.findParser(model.xCooModel, filename);
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("BAC11: Prohibited Item with Treatment Type - validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("BAC12: Prohibited Items, more than 3 (Treatment Type specified) - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsMultipleWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC13: Prohibited Item without Treatment Type - validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsWithoutTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("BAC14: Prohibited Items, more than 3 (no Treatment Type specified) - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsMultipleWithoutTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Valid packing list with conventional NIRMS values - passes all validation", async () => {
    const result = await parserService.findParser(
      model.validCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
    expect(result.items.every((item) => item.country_of_origin)).toBe(true);
    expect(result.items.every((item) => item.commodity_code)).toBe(true);
    expect(result.items.every((item) => item.nirms)).toBe(true);
  });
});
```

**⚠️ MANDATORY Test Data Model Creation:**

**File:** `test/unit/test-data-and-results/models/nisa/model2.js`

```javascript
module.exports = {
  // BAC1: NOT within NIRMS Scheme
  nonNirmsModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "GB", "No", "Processed", 1, 10],
    ],
  },

  // BAC2: Null NIRMS value
  nullNirmsModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "GB", "", "Processed", 1, 10],
    ],
  },

  // BAC3: Invalid NIRMS value
  invalidNirmsModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "GB", "Invalid", "Processed", 1, 10],
    ],
  },

  // BAC4: Null NIRMS value, more than 3
  nullNirmsMultipleModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "08045000", "GB", "", "Processed", 1, 10],
      ["Test Product 2", "08045000", "GB", "", "Processed", 1, 10],
      ["Test Product 3", "08045000", "GB", "", "Processed", 1, 10],
      ["Test Product 4", "08045000", "GB", "", "Processed", 1, 10],
    ],
  },

  // BAC5: Invalid NIRMS value, more than 3
  invalidNirmsMultipleModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "08045000", "GB", "Invalid", "Processed", 1, 10],
      ["Test Product 2", "08045000", "GB", "Invalid", "Processed", 1, 10],
      ["Test Product 3", "08045000", "GB", "Invalid", "Processed", 1, 10],
      ["Test Product 4", "08045000", "GB", "Invalid", "Processed", 1, 10],
    ],
  },

  // BAC6: Null CoO Value
  nullCooModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC7: Invalid CoO Value
  invalidCooModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "INVALID", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC8: Null CoO Value, more than 3
  nullCooMultipleModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "08045000", "", "Yes", "Processed", 1, 10],
      ["Test Product 2", "08045000", "", "Yes", "Processed", 1, 10],
      ["Test Product 3", "08045000", "", "Yes", "Processed", 1, 10],
      ["Test Product 4", "08045000", "", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC9: Invalid CoO Value, more than 3
  invalidCooMultipleModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "08045000", "INVALID", "Yes", "Processed", 1, 10],
      ["Test Product 2", "08045000", "INVALID", "Yes", "Processed", 1, 10],
      ["Test Product 3", "08045000", "INVALID", "Yes", "Processed", 1, 10],
      ["Test Product 4", "08045000", "INVALID", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC10: CoO Placeholder X
  xCooModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "X", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC11: Prohibited Item with Treatment Type
  prohibitedItemsWithTreatment: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "GB", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC12: Prohibited Items, more than 3 (Treatment Type specified)
  prohibitedItemsMultipleWithTreatment: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "08045000", "GB", "Yes", "Processed", 1, 10],
      ["Test Product 2", "08045000", "GB", "Yes", "Processed", 1, 10],
      ["Test Product 3", "08045000", "GB", "Yes", "Processed", 1, 10],
      ["Test Product 4", "08045000", "GB", "Yes", "Processed", 1, 10],
    ],
  },

  // BAC13: Prohibited Item without Treatment Type
  prohibitedItemsWithoutTreatment: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product", "08045000", "GB", "Yes", "", 1, 10],
    ],
  },

  // BAC14: Prohibited Items, more than 3 (no Treatment Type specified)
  prohibitedItemsMultipleWithoutTreatment: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "08045000", "GB", "Yes", "", 1, 10],
      ["Test Product 2", "08045000", "GB", "Yes", "", 1, 10],
      ["Test Product 3", "08045000", "GB", "Yes", "", 1, 10],
      ["Test Product 4", "08045000", "GB", "Yes", "", 1, 10],
    ],
  },

  // Valid CoO model
  validCooModel: {
    "Customer Order": [
      [
        "PART NUMBER DESCRIPTION",
        "TARIFF CODE EU",
        "COUNTRY OF ORIGIN",
        "NIRMS",
        "TYPE OF TREATMENT",
        "PACKAGES",
        "NET WEIGHT TOTAL",
      ],
      ["Test Product 1", "12345678", "GB", "Yes", "Processed", 1, 10],
      ["Test Product 2", "12345678", "IE", "No", "Fresh", 1, 10],
    ],
  },
};
```

**⚠️ CRITICAL VERIFICATION STEPS:**

1. **Column mappings complete and correctly placed:**
   - **Commodity code**: `commodity_code: /TARIFF CODE EU/i,` (already in regex section) ✅
   - **NIRMS column**: `nirms: /NIRMS/i,` (outside regex section for CoO validation) ✅
   - **CoO column**: `country_of_origin: /COUNTRY OF ORIGIN/i,` (outside regex section for CoO validation) ✅
2. **Test patterns against actual headers**: Verify regex works with real test data column headers
3. **Conventional NIRMS values**: Test data uses standard patterns (Yes/No/NIRMS/Non-NIRMS/etc.)
4. **Prohibited items**: Use actual prohibited commodity codes from `app/services/data/data-prohibited-items.json` (e.g., "08045000" from "GB")

### Step 4: Integration Verification

**Verify Integration Points:**

1. **Parser Registration**: Ensure NISA2 parser is registered in parser routing
2. **Matcher Configuration**: Verify matcher can identify Nisa 2 format
3. **Validation Pipeline**: Confirm validation utilities are called correctly via validateCountryOfOrigin flag
4. **Error Handling**: Test error scenarios return proper error format

## Critical Implementation Warnings

### ❌ DO NOT IMPLEMENT

1. **Custom Parser Logic**: Never write manual parsing code - use mapParser()
2. **Custom Validation Functions**: Never create new validation utilities - use existing ones
3. **Manual Sheet Processing**: Never write custom sheet iteration - use standard patterns
4. **Exception Throwing**: Never throw exceptions - return combineParser.combine() with empty arrays
5. **Adding Fields to Regex Section**: commodity_code already exists in regex - do not modify

### ✅ MUST FOLLOW

1. **Configuration-Driven Approach**: All validation through model-headers.js configuration
2. **Existing Validation Pipeline**: Use combineParser.combine() for all validation orchestration
3. **Standard Parser Patterns**: Follow Type 1 patterns from NISA1 and other column-based implementations
4. **Comprehensive Testing**: Include all 14 acceptance criteria scenarios in tests
5. **Proper Error Handling**: Use established error handling patterns

## Validation Checklist

**⚠️ CRITICAL: Implementation is NOT complete until ALL items checked:**

- [ ] **Configuration Update**: model-headers.js updated with correct Type 1 patterns and validation flags
  - [ ] `country_of_origin: /COUNTRY OF ORIGIN/i,` added outside regex section
  - [ ] `type_of_treatment: /TYPE OF TREATMENT/i,` added outside regex section
  - [ ] `nirms: /NIRMS/i,` added outside regex section for conventional NIRMS values
  - [ ] `validateCountryOfOrigin: true` flag added to enable CoO validation
  - [ ] `commodity_code` remains in regex section (already present - no changes needed)
- [ ] **Parser Integration**: Parser uses standard combineParser.combine() pattern with headers.NISA2
- [ ] **Test Data Models Created**: ALL test data models exist for every test case reference
  - [ ] Every `model.[testDataName]` has corresponding export in test data file
  - [ ] Test data uses conventional NIRMS values (Yes/No/NIRMS/Non-NIRMS/Green/Red/Y/N/G/R)
  - [ ] Prohibited items use actual prohibited commodity codes from data file (e.g., "08045000")
- [ ] **Complete Test Coverage**: All 14 acceptance criteria covered in unit tests
  - [ ] ALL CoO validation test cases passing
  - [ ] ALL existing regression tests passing
  - [ ] 100% test pass rate: `npm test -- --testPathPattern="nisa/model2.test.js"`
- [ ] **Type 1 Column Validation**: Conventional NIRMS values properly mapped
  - [ ] Standard NIRMS patterns tested (Yes/No/NIRMS/Non-NIRMS/Green/Red/Y/N/G/R)
  - [ ] Column-level validation working correctly
  - [ ] No blanket statement logic required
- [ ] **Integration Testing**: Parser works with matcher and validation pipeline
- [ ] **Error Handling**: All error scenarios return proper error format
- [ ] **Code Quality**: Follows established code quality standards
- [ ] **Documentation**: Implementation matches specification business requirements

**🛑 STOP CRITERIA**: Do not consider implementation complete until test command shows "Tests: X passed, X total" with 0 failures.

## Architecture Compliance

This implementation:

- ✅ Uses configuration-driven validation through existing infrastructure
- ✅ Integrates with established validation pipeline via validateCountryOfOrigin flag
- ✅ Follows Type 1 column-based parser architecture patterns (matches NISA1)
- ✅ Maintains error handling consistency with existing implementations
- ✅ Provides comprehensive test coverage for all 14 BACs
- ❌ Does NOT include custom parsing logic
- ❌ Does NOT implement manual validation functions
- ❌ Does NOT deviate from established Type 1 patterns
- ❌ Does NOT modify existing regex section (commodity_code already present)

## Expected Results

**After successful implementation:**

1. **NISA2 Configuration Enhanced**: model-headers.js includes CoO validation fields and flag
2. **Type 1 Validation Active**: Conventional NIRMS values validated through existing pipeline
3. **14 BACs Implemented**: All acceptance criteria scenarios covered in comprehensive tests
4. **100% Test Pass Rate**: All tests passing with no regression failures
5. **Integration Complete**: NISA2 parser fully integrated with CoO validation infrastructure

**Verification Command:**

```bash
npm test -- --testPathPattern="nisa/model2.test.js"
```

**Success Criteria:** All tests pass with validation messages matching specification requirements.
