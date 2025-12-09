# Giovanni 1 Country of Origin Validation Implementation Guide

**ADO Ticket:** AB#591527  
**Specification Source:** AB591527-giovanni1-coo-validation-spec.md  
**Implementation Type:** Type 4 - Configuration-Driven Parser Enhancement  
**CoO Validation Pattern:** Blanket Statement, Dynamic

## Implementation Overview

### Business Requirements Summary

**User Story:** As a caseworker, I want the Packing List Parser to help me validate Country of Origin (CoO) entries on Giovanni 1 packing lists so that I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements.

**Scope:**

- Collect relevant CoO fields from Giovanni 1 trader format using dynamic blanket statement detection
- Provide comprehensive validation for Country of Origin compliance with NIRMS requirements
- Enforce variable blanket NIRMS statement validation rules with treatment type header validation
- Check against Ineligible items list with treatment type considerations
- Generate comprehensive error messages with location details and aggregated reporting

**Column Mapping:**

- Column C: 'DESCRIPTION' - Product description for items
- Column E: 'Commodity Code' - European Union commodity classification code
- Column F: 'Country of Origin' - Country of origin designation for each product
- Column G: 'Quantity' - Package quantity information
- Column H: 'Net Weight (KG)' - Net weight in kilograms

**NIRMS Value Mapping:**

- NIRMS Statement Location: Cell A:I50
- NIRMS Statement Value: 'The exporter of the products covered by this document (NIRMS RMS-GB-000153) declares that these products are intend for the Green lane and will remain in Northern Ireland.'
- Treatment Blanket Location: Cell H:I17

### Architecture Decision

This implementation follows the Type 4 CoO validation pattern:

- **Configuration-based validation** through model-headers.js
- **Existing validation pipeline integration** via combineParser.combine()
- **Dynamic blanket statement configuration** with variable establishment number patterns
- **Zero custom parsing logic** - all validation through existing utilities

## Type-Specific Implementation Steps

### Step 1: Update Parser Configuration (model-headers.js) - TYPE 4

**File:** `app/services/model-headers.js`

#### Type 4: Blanket Statement, Dynamic Configuration

Update the existing GIOVANNI1 configuration to add CoO validation:

```javascript
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
  country_of_origin: /Country of Origin/i,
  validateCountryOfOrigin: true,
  findUnitInHeader: true,
  blanketNirms: {
    regex: /The exporter of the products covered by this document \(NIRMS RMS-GB-000153\) declares that these products are intend for the Green lane and will remain in Northern Ireland/i,
    value: "NIRMS",
  },
  blanketTreatmentType: {
    regex: /Treatment/i,
  },
}
```

### Step 2: Verify Parser Implementation (Minimal Changes)

**File:** `app/services/parsers/giovanni/model1.js`

**Required Changes:** (Parser already follows standard pattern - no changes needed)
The existing parser already uses the standard pattern and passes headers.GIOVANNI1 to combineParser.combine(), which will automatically enable CoO validation when the configuration is updated.

**Current Implementation Status:** ✅ COMPLIANT

```javascript
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.GIOVANNI1,
  establishmentNumbers,
  headers.GIOVANNI1,
);
```

### Step 3: Type-Specific Testing Implementation

**⚠️ CRITICAL TESTING REQUIREMENTS:**

**Required Test Files:**

- `test/unit/services/parser-service/giovanni/model1.test.js` - Test cases
- `test/unit/test-data-and-results/models/giovanni/model1.js` - Test data models (MUST CREATE ALL)
- `test/unit/test-data-and-results/results/giovanni/model1.js` - Expected results (UPDATE EXISTING)
- Test data in `app/packing-lists/giovanni/` directory

**MANDATORY Test Data Model Creation:**
For every test case `model.[testDataName]`, you MUST create corresponding export in the test data models file:

```javascript
module.exports = {
  validCooModel: {
    Sheet1: [],
  },
  missingBlanketStatement: {},
  missingCooValues: {},
  invalidCooFormat: {},
  cooPlaceholderX: {},
  multipleCooErrors: {},
  ineligibleItems: {},
  ineligibleItemsWithTreatment: {},
  ineligibleItemsMultiple: {},
};
```

**MANDATORY Legacy Test Result Updates:**
When implementing CoO validation, existing tests may fail. Update expectations in results file:

```javascript
// BEFORE (old expectation):
invalidTestResult_MissingCells: {
  business_checks: {
    failure_reasons: 'NIRMS/Non-NIRMS goods not specified.\nOther errors...',
  },
},

// AFTER (updated for CoO validation):
invalidTestResult_MissingCells: {
  business_checks: {
    failure_reasons: 'Other errors...',
  },
},
```

#### Type 4: Blanket Statement, Dynamic Testing

```javascript
describe('GIOVANNI1 CoO Validation Tests - Type 4', () => {
  test('BAC6: Valid packing list with dynamic blanket statement', () => {
    const result = await parserService.findParser(model.validCooModel, filename);
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test('BAC1: Missing dynamic blanket statement - validation fails', () => {
    const result = await parserService.findParser(model.missingBlanketStatement, filename);
    expect(result.business_checks.failure_reasons).toContain('NIRMS/Non-NIRMS goods not specified');
  });

  test('Dynamic blanket statement sets all items to NIRMS', () => {
    const result = await parserService.findParser(model.validCooModel, filename);
    expect(result.items.every(item => item.nirms === 'NIRMS')).toBe(true);
  });

  test('BAC2: Missing CoO values with blanket statement - validation errors', () => {
    const result = await parserService.findParser(model.missingCooValues, filename);
    expect(result.business_checks.failure_reasons).toContain('Missing Country of Origin');
  });

  test('BAC3: Invalid CoO format - validation errors', () => {
    const result = await parserService.findParser(model.invalidCooFormat, filename);
    expect(result.business_checks.failure_reasons).toContain('Invalid Country of Origin ISO Code');
  });

  test('BAC6: CoO placeholder X/x values pass validation', () => {
    const result = await parserService.findParser(model.cooPlaceholderX, filename);
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test('BAC4-5: Multiple CoO errors aggregation', () => {
    const result = await parserService.findParser(model.multipleCooErrors, filename);
    expect(result.business_checks.failure_reasons).toContain('in addition to');
  });

  test('BAC7: Ineligible items validation with treatment type', () => {
    const result = await parserService.findParser(model.ineligibleItemsWithTreatment, filename);
    expect(result.business_checks.failure_reasons).toContain('Prohibited item identified on the packing list');
  });

  test('BAC9: Ineligible items validation without treatment type', () => {
    const result = await parserService.findParser(model.ineligibleItems, filename);
    expect(result.business_checks.failure_reasons).toContain('Prohibited item identified on the packing list');
  });

  test('BAC8,10: Multiple Ineligible items aggregation', () => {
    const result = await parserService.findParser(model.ineligibleItemsMultiple, filename);
    expect(result.business_checks.failure_reasons).toContain('in addition to');
  });
});
```

**⚠️ CRITICAL DEBUGGING STEPS:**
If tests fail with "NIRMS/Non-NIRMS goods not specified":

1. Verify blanket statement text in test data matches configuration regex exactly:
   ```bash
   node -e 'console.log(/The exporter of the products covered by this document \(NIRMS RMS-GB-000153\) declares that these products are intend for the Green lane and will remain in Northern Ireland/i.test("YOUR_EXACT_BLANKET_STATEMENT_FROM_TEST_DATA"))'
   ```
2. Ensure blanket statement configuration has both `regex` AND `value` properties
3. Check that blanket statement appears in test data at the expected location (Cell A:I50)

### Step 4: Integration Verification

**Verify Integration Points:**

1. **Parser Registration**: ✅ Parser already registered in parser routing
2. **Matcher Configuration**: ✅ Matcher already configured and working
3. **Validation Pipeline**: ✅ Parser uses standard combineParser.combine() pattern
4. **Error Handling**: ✅ Parser follows established error handling patterns

## Critical Implementation Warnings

### ❌ DO NOT IMPLEMENT

1. **Custom Parser Logic**: Never write manual parsing code - use mapParser()
2. **Custom Validation Functions**: Never create new validation utilities - use existing ones
3. **Manual Sheet Processing**: Never write custom sheet iteration - use standard patterns
4. **Exception Throwing**: Never throw exceptions - return combineParser.combine() with empty arrays
5. **Cross-Retailer Configuration Copying**: Never copy blanketTreatmentType from BANDM1 to GIOVANNI1 without specification requirement

### ✅ MUST FOLLOW

1. **Configuration-Driven Approach**: All validation through model-headers.js configuration
2. **Existing Validation Pipeline**: Use combineParser.combine() for all validation orchestration
3. **Standard Parser Patterns**: Follow patterns from existing parser implementations
4. **Comprehensive Testing**: Include all acceptance criteria scenarios in tests
5. **Proper Error Handling**: Use established error handling patterns

## Validation Checklist

**⚠️ CRITICAL: Implementation is NOT complete until ALL items checked:**

- [ ] **Configuration Update**: model-headers.js updated with correct patterns and validation flags
  - [ ] `validateCountryOfOrigin: true` added
  - [ ] `blanketNirms` with both `regex` AND `value` properties present
  - [ ] `blanketTreatmentType` with only `regex` property (Type 4 Dynamic - NO value property)
  - [ ] Only specified configuration elements added (no cross-retailer copying)
- [ ] **Parser Integration**: ✅ Parser already uses standard combineParser.combine() pattern
- [ ] **Test Data Models Created**: ALL test data models exist for every test case reference
  - [ ] Every `model.[testDataName]` has corresponding export in test data file
  - [ ] Blanket statement text in test data matches configuration regex exactly
  - [ ] Ineligible items use actual Ineligible commodity codes from data-Ineligible-items.json
- [ ] **Legacy Test Results Updated**: Existing test expectations updated for CoO validation changes
  - [ ] Removed outdated "NIRMS/Non-NIRMS goods not specified" errors where blanket statement now detected
- [ ] **Complete Test Coverage**: All acceptance criteria covered in unit tests
  - [ ] BAC1: Missing NIRMS blanket statement test
  - [ ] BAC2-5: CoO validation tests (null, invalid, aggregation)
  - [ ] BAC6: CoO placeholder X/x test
  - [ ] BAC7-10: Ineligible items tests (with/without treatment, aggregation)
  - [ ] ALL CoO validation test cases passing
  - [ ] ALL existing regression tests passing
  - [ ] 100% test pass rate: `npm test -- --testPathPattern="giovanni/model1.test.js"`
- [ ] **Blanket Statement Detection Verified**: Dynamic blanket statements working
  - [ ] Regex tested against actual test data text
  - [ ] Configuration includes both `regex` and `value` properties for blanketNirms
  - [ ] Configuration includes only `regex` property for blanketTreatmentType (Type 4 Dynamic)
  - [ ] No "NIRMS/Non-NIRMS goods not specified" errors in passing tests
- [ ] **Integration Testing**: Parser works with matcher and validation pipeline
- [ ] **Error Handling**: All error scenarios return proper error format
- [ ] **Code Quality**: Follows established code quality standards

**🛑 STOP CRITERIA**: Do not consider implementation complete until test command shows "Tests: X passed, X total" with 0 failures.

## Architecture Compliance

This implementation:

- ✅ Uses configuration-driven validation through existing infrastructure
- ✅ Integrates with established validation pipeline
- ✅ Follows standard parser architecture patterns
- ✅ Maintains error handling consistency
- ✅ Provides comprehensive test coverage
- ❌ Does NOT include custom parsing logic
- ❌ Does NOT implement manual validation functions
- ❌ Does NOT deviate from established patterns

## Critical Debugging Guide

### Blanket Statement Detection Failures

**Symptom**: Tests fail with "NIRMS/Non-NIRMS goods not specified" error
**Root Cause**: Dynamic blanket statement not detected by parser-map.js validation pipeline

**Debugging Steps:**

1. **Verify Configuration Structure**:

   ```javascript
   // ❌ WRONG - Missing value property
   blanketNirms: {
     regex: /pattern/i,
   }

   // ✅ CORRECT - Both properties required
   blanketNirms: {
     regex: /The exporter of the products covered by this document \(NIRMS RMS-GB-000153\) declares that these products are intend for the Green lane and will remain in Northern Ireland/i,
     value: "NIRMS",
   }
   ```

2. **Test Regex Against Actual Data**:

   ```bash
   node -e 'console.log(/The exporter of the products covered by this document \(NIRMS RMS-GB-000153\) declares that these products are intend for the Green lane and will remain in Northern Ireland/i.test("EXACT_BLANKET_STATEMENT_FROM_TEST_DATA"))'
   ```

3. **Verify parser-map.js Processing**:
   - Check lines 61-62 and 91 in `app/services/parser-map.js`
   - Blanket statement detection requires both `regex` and `value` properties

### Test Data Model Errors

**Symptom**: "Cannot read properties of undefined" errors in tests
**Root Cause**: Test references `model.[name]` but export doesn't exist

**Fix**: Create ALL test data models:

```javascript
module.exports = {
  validCooModel: {},
  missingBlanketStatement: {},
  dynamicVariation: {},
  missingCooValues: {},
  invalidCooFormat: {},
  cooPlaceholderX: {},
  multipleCooErrors: {},
  ineligibleItems: {},
};
```

### Ineligible Items Test Failures

**Symptom**: Ineligible items test passes when it should fail
**Root Cause**: Test data uses commodity codes not in Ineligible items list

**Fix**: Use actual Ineligible items:

```bash
grep -i "GB" app/services/data/data-Ineligible-items.json
```

### Legacy Test Failures After CoO Implementation

**Symptom**: Existing tests fail with different error messages than expected
**Root Cause**: CoO validation changes behavior - blanket statement now detected

**Fix**: Update test result expectations:

```javascript
failure_reasons: "Other errors...";
```

## Success Criteria

**A successful implementation will result in:**

### Configuration Success

1. ✅ **Type 4 (Blanket Statement, Dynamic) pattern correctly implemented**
2. ✅ **Dynamic blanket statement configuration with both regex and value properties**
3. ✅ **Treatment type blanket statement configuration included per specification**
4. ✅ **validateCountryOfOrigin flag enabled**
5. ✅ **No cross-retailer configuration copying**

### Testing Success

6. ✅ **All 10 BAC test scenarios implemented and passing**
7. ✅ **Test data models created for every test case reference**
8. ✅ **Ineligible items tests using actual Ineligible commodity codes**
9. ✅ **Legacy test results updated for CoO validation changes**
10. ✅ **100% test pass rate with 0 failures**

### Architecture Success

11. ✅ **Minimal configuration changes only (no custom parser code)**
12. ✅ **Standard parser architecture patterns maintained**
13. ✅ **Existing validation pipeline integration preserved**
14. ✅ **Dynamic blanket statement detection working correctly**
15. ✅ **All acceptance criteria validated through configuration-driven approach**
