# ASDA 3 Country of Origin Validation Implementation Guide

**ADO Ticket:** AB#591514  
**Specification Source:** ./.spec/coo/AB591514-asda3-coo-validation-spec.md  
**Implementation Type:** Type 1 - Configuration-Driven Parser Enhancement  
**CoO Validation Pattern:** Column-Based, Conventional NIRMS

## Implementation Overview

### Business Requirements Summary

**User Story:** As a caseworker, I want the Packing List Parser to help me validate Country of Origin (CoO) entries on ASDA 3 packing lists so that I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements.

**Column Mapping (from specification):**

- **Column C:** 'NIRMs/Non-NIRMs' - NIRMS classification values
- **Column E:** 'Treatment Type' - Treatment type information (already exists)
- **Column M:** 'Commodity Code' - Product commodity codes
- **Column N:** 'Country of Origin' - Country of Origin values

**NIRMS Value Mapping:** ASDA 3 follows standard NIRMS values:

- **True Values (NIRMS = Yes):** Yes | NIRMS | Green | Y | G
- **False Values (NIRMS = No):** No | Non-NIRMS | Non NIRMS | Red | N | R

### Architecture Decision

This implementation follows the **Type 1** CoO validation pattern:

- **Configuration-based validation** through model-headers.js
- **Existing validation pipeline integration** via combineParser.combine()
- **Column-based NIRMS validation** with conventional value patterns
- **Zero custom parsing logic** - all validation through existing utilities

## Type 1 Implementation Steps

### Step 1: Update Parser Configuration (model-headers.js) - TYPE 1

**File:** `app/services/model-headers.js`

#### Type 1: Column-Based, Conventional NIRMS Configuration

**Current ASDA3 Configuration (verified from workspace):**

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

**Updated Configuration with CoO Validation:**

```javascript
ASDA3: {
  establishmentNumber: {
    regex: /^RMS-GB-000015-\d{3}$/i,
  },
  regex: {
    // ⚠️ EXISTING FIELDS ONLY: Current ASDA3 configuration - DO NOT add new fields here
    description: /Description Of All Retail Goods/i,
    nature_of_products: /Nature of Product/i,
    type_of_treatment: /Treatment Type/i,
    number_of_packages: /Number of Packages/i,
    total_net_weight_kg: /Net Weight/i,
  },
  total_net_weight_unit: /kilograms\/grams/i,
  // ⚠️ REQUIRED ADDITIONS for CoO validation (OUTSIDE regex property):
  commodity_code: /Commodity Code/i,
  country_of_origin: /Country of Origin/i,
  nirms: /NIRMs\/Non-NIRMs/i,
  validateCountryOfOrigin: true,
}
```

**⚠️ CRITICAL NOTES:**

- **commodity_code is added OUTSIDE regex section** - It's not currently in the regex property, so adding it there would break existing tests
- **All CoO validation fields are separate properties** - They are not parsing fields but validation configuration
- **4 essential properties represented:** description (regex), commodity_code (outside regex), country_of_origin (outside regex), nirms (outside regex)

### Step 2: Fix Parser Implementation (Critical Bug Fix)

**File:** `app/services/parsers/asda/model3.js`

**Current Issue:** Parser is using 5-parameter combineParser.combine() call instead of required 6-parameter signature.

**Required Change:**

```javascript
// BEFORE (current - missing headers parameter):
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.ASDA3,
  establishmentNumbers,
);

// AFTER (required - includes headers parameter):
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.ASDA3,
  establishmentNumbers,
  headers.ASDA3, // ⚠️ CRITICAL: 6th parameter required for CoO validation
);
```

### Step 3: Type 1 Testing Implementation

**⚠️ CRITICAL TESTING REQUIREMENTS:**

#### Test Files Structure

**Required Test Files:**

- `test/unit/services/parser-service/asda/model3.test.js` - Test cases (UPDATE existing)
- `test/unit/test-data-and-results/models/asda/model3.js` - Test data models (UPDATE existing)
- `test/unit/test-data-and-results/results/asda/model3.js` - Expected results (UPDATE existing)
- Test data in `app/packing-lists/asda/` directory

#### Test Organization (BAC Sequence Order)

**⚠️ CRITICAL TEST ORGANIZATION:** Order tests by BAC sequence (BAC1, BAC2, BAC3, etc.) for maintainability and requirement traceability.

#### Type 1: Column-Based, Conventional NIRMS Testing

**Update `test/unit/services/parser-service/asda/model3.test.js`:**

```javascript
describe("ASDA3 CoO Validation Tests - Type 1", () => {
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

  test("BAC4: Null NIRMS value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.nullNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC5: Invalid NIRMS value, more than 3 - validation errors with summary", async () => {
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

  test("BAC8: Null CoO Value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.nullCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC9: Invalid CoO Value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.invalidCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC10: CoO Value is X or x - passes validation", async () => {
    const result = await parserService.findParser(
      model.cooPlaceholderXModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("BAC11: Item Present on Prohibited Item List (Treatment Type specified) - validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsWithTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("BAC12: Item Present on Prohibited Item List, more than 3 (Treatment Type specified) - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsMultipleWithTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC13: Item Present on Prohibited Item List (no Treatment Type specified) - validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsNoTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("BAC14: Item Present on Prohibited Item List, more than 3 (no Treatment Type specified) - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsMultipleNoTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Valid CoO Validation: Complete packing list with all fields valid", async () => {
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

#### Test Data Models Creation (MANDATORY)

**Update `test/unit/test-data-and-results/models/asda/model3.js`:**

```javascript
module.exports = {
  // Existing models...
  validModel: {
    /* existing data */
  },
  emptyModel: {
    /* existing data */
  },

  // NEW CoO validation test data models - ALL MUST BE CREATED:
  validCooModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs", // NIRMS column
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code", // Commodity Code column
        N: "Country of Origin", // CoO column
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: "NIRMS", // Valid NIRMS value
        D: "Processed", // Treatment type
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000", // Valid commodity code
        N: "GB", // Valid CoO
      },
    ],
  },

  nonNirmsModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: "Non-NIRMS", // Non-NIRMS value - should pass
        D: "Processed",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000",
        N: "GB",
      },
    ],
  },

  nullNirmsModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: null, // Null NIRMS - should fail
        D: "Processed",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000",
        N: "GB",
      },
    ],
  },

  invalidNirmsModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: "INVALID", // Invalid NIRMS value - should fail
        D: "Processed",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000",
        N: "GB",
      },
    ],
  },

  nullCooModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: "NIRMS", // Valid NIRMS
        D: "Processed",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000",
        N: null, // Null CoO - should fail for NIRMS items
      },
    ],
  },

  invalidCooModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: "NIRMS", // Valid NIRMS
        D: "Processed",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000",
        N: "INVALID", // Invalid CoO - should fail
      },
    ],
  },

  cooPlaceholderXModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "ASDA DAILY CROISSANT CHOCO 1PK",
        C: "NIRMS", // Valid NIRMS
        D: "Processed",
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "1905900000",
        N: "X", // Placeholder X - should pass
      },
    ],
  },

  prohibitedItemsWithTreatmentModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "PROHIBITED ITEM WITH TREATMENT",
        C: "NIRMS", // Valid NIRMS
        D: "Processed", // Treatment specified
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "08045000", // ⚠️ Use actual prohibited commodity code from data-prohibited-items.json
        N: "GB", // ⚠️ Use country that makes this combination prohibited
      },
    ],
  },

  prohibitedItemsNoTreatmentModel: {
    Page1_1: [
      {
        B: "Description Of All Retail Goods",
        C: "NIRMs/Non-NIRMs",
        D: "Treatment Type",
        E: "Number Of Establishment",
        F: "Destination Store Establishment Number",
        G: "Number of Packages",
        H: "Net Weight",
        I: "kilograms/grams",
        M: "Commodity Code",
        N: "Country of Origin",
      },
      {
        B: "PROHIBITED ITEM NO TREATMENT",
        C: "NIRMS", // Valid NIRMS
        D: null, // No treatment specified
        E: "RMS-GB-000015-006",
        F: "RMS-NI-000008-017",
        G: 1,
        H: 0.059,
        I: "kgs",
        M: "08045000", // ⚠️ Use actual prohibited commodity code
        N: "GB", // ⚠️ Use country that makes this combination prohibited
      },
    ],
  },

  // Add models for "more than 3" scenarios...
  nullNirmsMultipleModel: {
    /* 4+ items with null NIRMS */
  },
  invalidNirmsMultipleModel: {
    /* 4+ items with invalid NIRMS */
  },
  nullCooMultipleModel: {
    /* 4+ NIRMS items with null CoO */
  },
  invalidCooMultipleModel: {
    /* 4+ NIRMS items with invalid CoO */
  },
  prohibitedItemsMultipleWithTreatmentModel: {
    /* 4+ prohibited items with treatment */
  },
  prohibitedItemsMultipleNoTreatmentModel: {
    /* 4+ prohibited items without treatment */
  },
};
```

#### Legacy Test Results Updates (MANDATORY)

**Update `test/unit/test-data-and-results/results/asda/model3.js`:**

**⚠️ CRITICAL**: Existing tests may fail because CoO validation changes behavior. Update expectations:

```javascript
// EXAMPLE: If existing tests now pass validation that previously failed
// BEFORE (old expectation):
invalidTestResult_MissingCells: {
  business_checks: {
    failure_reasons: 'NIRMS/Non-NIRMS goods not specified.\nOther errors...',
  },
},

// AFTER (updated for CoO validation - if blanket statement now works):
invalidTestResult_MissingCells: {
  business_checks: {
    failure_reasons: 'Other errors...',  // Remove NIRMS error if now resolved
  },
},
```

**⚠️ CRITICAL VERIFICATION STEPS:**

1. **Column mappings complete and correctly placed:**
   - **Commodity code**: `commodity_code: /Commodity Code/i,` (outside regex section - NOT in regex as it's not currently there)
   - **NIRMS column**: `nirms: /NIRMs\/Non-NIRMs/i,` (outside regex section for CoO validation)
   - **CoO column**: `country_of_origin: /Country of Origin/i,` (outside regex section for CoO validation)

2. **Test patterns against actual headers**: Verify regex works with real test data column headers

   ```bash
   # Test regex patterns:
   node -e 'console.log(/NIRMs\/Non-NIRMs/i.test("NIRMs/Non-NIRMs"))'  # Should return true
   node -e 'console.log(/Commodity Code/i.test("Commodity Code"))'      # Should return true
   node -e 'console.log(/Country of Origin/i.test("Country of Origin"))' # Should return true
   ```

3. **Conventional NIRMS values**: Test data uses standard patterns (Yes/No/NIRMS/Non-NIRMS/etc.)

4. **⚠️ CRITICAL**: NEVER add commodity_code to regex if not already present - this breaks existing unit tests

5. **Prohibited items verification**: Ensure test data uses actually prohibited items

   ```bash
   # Verify prohibited items:
   grep -i "08045000" app/services/data/data-prohibited-items.json
   # Use commodity codes that actually appear in the file
   ```

6. **Complete test data model creation**: Every `model.[testDataName]` reference must have corresponding export

7. **Parser fix verification**: Ensure combineParser.combine() uses 6-parameter signature with headers.ASDA3

### Step 4: Integration Verification

**Verify Integration Points:**

1. **Parser Registration**: ASDA3 parser already registered in parser routing
2. **Matcher Configuration**: ASDA3 matcher already exists and functional
3. **Validation Pipeline**: Confirm validation utilities are called correctly through 6-parameter combineParser.combine()
4. **Error Handling**: Test error scenarios return proper error format

## Critical Implementation Warnings

### ❌ DO NOT IMPLEMENT

1. **Custom Parser Logic**: Never write manual parsing code - use mapParser()
2. **Custom Validation Functions**: Never create new validation utilities - use existing ones
3. **Manual Sheet Processing**: Never write custom sheet iteration - use standard patterns
4. **Exception Throwing**: Never throw exceptions - return combineParser.combine() with empty arrays
5. **Non-Standard Architecture**: Never deviate from established parser patterns
6. **Add commodity_code to regex section**: This breaks existing tests - add outside regex section only

### ✅ MUST FOLLOW

1. **Configuration-Driven Approach**: All validation through model-headers.js configuration
2. **Existing Validation Pipeline**: Use combineParser.combine() for all validation orchestration
3. **Standard Parser Patterns**: Follow patterns from existing parser implementations
4. **Comprehensive Testing**: Include all acceptance criteria scenarios in tests
5. **Proper Error Handling**: Use established error handling patterns
6. **6-Parameter combineParser.combine()**: Fix existing parser to use correct signature

## Validation Checklist

**⚠️ CRITICAL: Implementation is NOT complete until ALL items checked:**

- [ ] **Configuration Update**: model-headers.js updated with correct patterns and validation flags
  - [ ] **commodity_code added OUTSIDE regex section** (not currently in regex - adding there breaks tests)
  - [ ] **country_of_origin added outside regex section** for CoO validation
  - [ ] **nirms field added outside regex section** for NIRMS validation
  - [ ] **validateCountryOfOrigin: true** flag added
  - [ ] Only ASDA3-specific configuration elements added (no cross-retailer copying)

- [ ] **Parser Integration Fix**: Parser uses correct 6-parameter combineParser.combine() signature
  - [ ] **6th parameter added**: headers.ASDA3 parameter included in combineParser.combine() call
  - [ ] Standard parser architecture maintained

- [ ] **Test Data Models Created**: ALL test data models exist for every test case reference
  - [ ] Every `model.[testDataName]` has corresponding export in test data file
  - [ ] CoO validation columns (C, M, N) included in all test headers
  - [ ] Prohibited items use actual prohibited commodity codes from data-prohibited-items.json

- [ ] **Legacy Test Results Updated**: Existing test expectations updated for CoO validation changes
  - [ ] Updated expectations if existing behavior changes due to CoO validation

- [ ] **Complete Test Coverage**: All acceptance criteria covered in unit tests
  - [ ] ALL 14 BAC scenarios covered with appropriate test cases
  - [ ] Tests ordered by BAC sequence (BAC1, BAC2, BAC3, etc.)
  - [ ] ALL existing regression tests still passing
  - [ ] 100% test pass rate: `npm test -- --testPathPattern="asda/model3.test.js"`

- [ ] **Regex Pattern Verification**: All regex patterns tested against actual data
  - [ ] `/NIRMs\/Non-NIRMs/i` matches actual NIRMS column headers
  - [ ] `/Commodity Code/i` matches actual commodity code column headers
  - [ ] `/Country of Origin/i` matches actual CoO column headers

- [ ] **Integration Testing**: Parser works with matcher and validation pipeline
- [ ] **Error Handling**: All error scenarios return proper error format
- [ ] **Code Quality**: Follows established code quality standards
- [ ] **Documentation**: Implementation matches specification business requirements

**🛑 STOP CRITERIA**: Do not consider implementation complete until test command shows "Tests: X passed, X total" with 0 failures.

## Architecture Compliance

This implementation:

- ✅ Uses configuration-driven validation through existing infrastructure
- ✅ Integrates with established validation pipeline via 6-parameter combineParser.combine()
- ✅ Follows standard parser architecture patterns
- ✅ Maintains error handling consistency
- ✅ Provides comprehensive test coverage for all 14 BACs
- ✅ Fixes existing parser to use correct combineParser.combine() signature
- ❌ Does NOT include custom parsing logic
- ❌ Does NOT implement manual validation functions
- ❌ Does NOT deviate from established patterns
- ❌ Does NOT add commodity_code to regex section (prevents breaking existing tests)
