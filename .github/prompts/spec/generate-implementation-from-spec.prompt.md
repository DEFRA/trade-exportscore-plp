# Generate Implementation Guide from Specification Prompt

## Objective

Generate technically accurate implementation files with suffix `*-implementation.md` based on specification documents in the trade-exportscore-plp repository. Extract valid business requirements while correcting fictional technical implementation details to match actual codebase architecture patterns.

## Critical Implementation Requirements

**ALWAYS validate implementation by:**
1. **Following exact specification patterns** - Do not copy configurations from other retailers
2. **Testing until ALL unit tests pass** - Stop work only when implementation is complete and verified
3. **Verifying blanket statement detection** - Ensure regex patterns match test data exactly
4. **Completing missing test data models** - Add all required test data for each acceptance criteria
5. **Using retailer-specific patterns** - Each trader has unique blanket statement requirements

### Common Implementation Errors to Avoid

**❌ ERROR 1: Cross-Retailer Configuration Copying**
- **Problem**: Copying `blanketTreatmentType` from BANDM1 to GIOVANNI1 when specification doesn't require it
- **Solution**: Only implement configuration elements explicitly specified in the implementation guide
- **Example**: GIOVANNI1 requires only `blanketNirms`, not `blanketTreatmentType`
- **⚠️ CRITICAL**: Each retailer has unique requirements - never copy configurations between retailers

**❌ ERROR 2: Stopping with Failing Tests**  
- **Problem**: Considering implementation "complete" when unit tests are still failing
- **Solution**: Implementation is only complete when ALL acceptance criteria tests pass
- **Verification**: Run `npm test -- --testPathPattern="[retailer]/model1.test.js"` until 100% pass rate
- **⚠️ CRITICAL**: Must achieve exactly 0 failing tests before implementation is considered complete

**❌ ERROR 3: Missing Test Data Models**
- **Problem**: Adding test cases without corresponding test data models, causing "Cannot read properties of undefined" errors
- **Solution**: For each BAC test case, create corresponding test data model in `test/unit/test-data-and-results/models/[retailer]/model1.js`
- **Pattern**: Test references `model.validCooModel` → Must exist in test data exports
- **⚠️ CRITICAL**: Every test case must have matching test data model - no exceptions

**❌ ERROR 4: Blanket Statement Configuration Structure**
- **Problem**: Using incomplete `blanketNirms: { regex: /pattern/i }` configuration missing required `value` property
- **Solution**: parser-map.js requires BOTH properties: `blanketNirms: { regex: /pattern/i, value: "NIRMS" }`
- **Debug**: If validation fails with "NIRMS/Non-NIRMS goods not specified", check blanket statement detection
- **⚠️ CRITICAL**: Blanket statement detection fails silently without proper configuration structure

**❌ ERROR 4.1: Type 3 vs Type 4 Treatment Type Value Confusion**
- **Problem**: Adding `value: "Processed"` to `blanketTreatmentType` for Type 4 Dynamic implementations
- **Solution**: 
  - **Type 3 (Fixed)**: `blanketTreatmentType: { regex: /pattern/i, value: "Processed" }` - fixed value assigned
  - **Type 4 (Dynamic)**: `blanketTreatmentType: { regex: /pattern/i }` - NO value property, treatment extracted dynamically
- **Example**: GIOVANNI1 (Type 4) should NOT have `value: "Processed"` - treatment type comes from document content
- **⚠️ CRITICAL**: Type 4 Dynamic means values are extracted from document, not assigned from configuration

**❌ ERROR 5: Prohibited Items Test Data Using Non-Prohibited Items**
- **Problem**: Test data uses commodity codes that aren't actually in the prohibited items list
- **Solution**: Use actual prohibited items from `app/services/data/data-prohibited-items.json`
- **Example**: Use "08045000" from "GB" (actually prohibited) instead of "0201100010" (not prohibited)
- **Verification**: `grep -i "[commodity_code]" app/services/data/data-prohibited-items.json` to verify

**❌ ERROR 6: Not Updating Legacy Test Results**
- **Problem**: Existing tests fail because they expect old validation errors that CoO validation now prevents
- **Solution**: Update legacy test result expectations in `test/unit/test-data-and-results/results/[retailer]/model1.js`
- **Pattern**: Remove "NIRMS/Non-NIRMS goods not specified" from failure_reasons when blanket statement now detected
- **⚠️ CRITICAL**: CoO validation changes existing behavior - must update all affected test expectations

**❌ ERROR 7: Blanket Statement Regex Testing Skipped**
- **Problem**: Regex pattern in configuration doesn't match blanket statement text in test data
- **Solution**: Test regex patterns: `node -e 'console.log(/pattern/.test("text"))'` before implementation
- **Debugging Steps**: 
  1. Extract exact blanket statement text from test data
  2. Test regex against exact text: `node -e 'console.log(/your_regex/.test("exact_text_from_test_data"))'`
  3. If false, adjust regex until it returns true
  4. Verify in model-headers.js that both regex AND value properties are present

## Input Parameters

- **ADO_TICKET_NUMBER**: Azure DevOps ticket number (format: AB#xxxxxx)

## Execution Instructions

### Step 1: Locate Specification File

```bash
# Find specification file based on ADO ticket number
SPEC_FILE=$(find .spec/ -name "*${ADO_TICKET_NUMBER}*-spec.md" | head -1)

if [ -z "$SPEC_FILE" ]; then
    echo "❌ No specification file found for ${ADO_TICKET_NUMBER}"
    exit 1
fi

echo "✅ Found specification: $SPEC_FILE"
```

### Step 1.5: Determine CoO Validation Type (CRITICAL)

Analyze the specification to identify which of the 4 CoO validation implementation types:

#### CoO Validation Type Detection

**Type 1: Column-Based, Conventional NIRMS** (Examples: AB#591514-ASDA3, SAVERS1, NISA1)
- **Detection Criteria**: 
  - BACs mention column-based NIRMS validation
  - NIRMS values include standard patterns: Yes|NIRMS|Green|Y|G / No|Non-NIRMS|Red|N|R
  - Column mapping shows dedicated NIRMS column with conventional values
- **Implementation Pattern**: `nirms: /[pattern]/i` + `validateCountryOfOrigin: true`

**Type 2: Column-Based, Unconventional NIRMS** (Examples: AB#599300-MARS, BOOKER2)
- **Detection Criteria**:
  - BACs mention column-based NIRMS validation  
  - NIRMS values use non-standard patterns (e.g., Mars: Green=NIRMS, Red=Non-NIRMS)
  - Column mapping shows dedicated NIRMS column with trader-specific values
- **Implementation Pattern**: `nirms: /[custom_pattern]/i` + `validateCountryOfOrigin: true`

**Type 3: Blanket Statement, Fixed** (Examples: AB#591516-BANDM)
- **Detection Criteria**:
  - BACs mention document-wide blanket statements
  - Fixed statement text like "This consignment contains only NIRMS eligible goods"
  - May include both NIRMS and treatment type blanket statements
- **Implementation Pattern**: `blanketNirms: { regex: /pattern/i, value: "NIRMS" }` + optional `blanketTreatmentType: { regex: /pattern/i, value: "Processed" }`

**Type 4: Blanket Statement, Dynamic** (Examples: AB#591527-GIOVANNI1)
- **Detection Criteria**:
  - BACs mention document-wide blanket statements
  - Variable statement content with trader-specific elements (establishment numbers, etc.)
  - Dynamic statement text that changes based on context
  - May include both NIRMS and treatment type blanket statements
- **Implementation Pattern**: `blanketNirms: { regex: /variable_pattern/i, value: "NIRMS" }` + optional `blanketTreatmentType: { regex: /variable_pattern/i }` ⚠️ **NO VALUE for Type 4 - treatment extracted dynamically**

**🎯 REQUIREMENT**: Must determine type before proceeding to Step 2.

### Step 2: Analyze Current Architecture Patterns

Before generating implementation steps, analyze these existing patterns in the trade-exportscore-plp codebase:

#### Parser Architecture Analysis (MANDATORY)

**Examine existing parser implementations:**
- `app/services/parsers/sainsburys/model1.js` - Standard Excel parser pattern
- `app/services/parsers/asda/model1.js` - Configuration-driven validation example  
- `app/services/parsers/nisa/model1.js` - Header mapping patterns
- `app/services/model-headers.js` - Configuration structure and validation flags

**Key Architecture Principles:**
1. **Configuration-Driven Validation**: Use model-headers.js configuration, NOT manual parsing code
2. **Standard Parser Pattern**: Extract establishment number → find headers → process with mapParser → combine with combineParser
3. **Validation Pipeline Integration**: Use existing validation utilities through combineParser.combine()
4. **Error Handling**: Return combineParser.combine() with empty arrays on error, never throw exceptions

#### Validation Infrastructure Analysis (MANDATORY)

**Examine existing validation utilities:**
- `app/services/utilities/packing-list-validator-utilities.js` - Business rule validation functions
- `app/services/utilities/packing-list-column-validator.js` - Column-specific validation logic
- `app/services/parser-combine.js` - Central validation orchestration
- `app/services/parser-map.js` - Data mapping and transformation

### Step 3: Extract Business Requirements (CRITICAL)

From the specification file, extract ONLY the following valid sections:

#### Valid Business Content
- **Business Context**: User stories and scope definitions
- **Acceptance Criteria**: Gherkin scenarios (Given/When/Then patterns)
- **Column Mapping**: Trader-specific column definitions
- **NIRMS Value Mapping**: True/false value definitions
- **Data Integration Requirements**: Establishment number patterns and field mappings

### Step 4: Generate Type-Specific Implementation File

Create implementation file: `${SPEC_FILE%-spec.md}-implementation.md`

#### Required Implementation File Sections

```markdown
# [Feature Name] Implementation Guide

**ADO Ticket:** ${ADO_TICKET_NUMBER}  
**Specification Source:** ${SPEC_FILE}  
**Implementation Type:** [Type X] - [Configuration-Driven Parser Enhancement]  
**CoO Validation Pattern:** [Detected Type from Step 1.5]

## Implementation Overview

### Business Requirements Summary
[Extract valid business requirements from specification]

### Architecture Decision  
This implementation follows the [Type X] CoO validation pattern:
- **Configuration-based validation** through model-headers.js
- **Existing validation pipeline integration** via combineParser.combine()
- **Type-specific configuration** matching detected validation pattern
- **Zero custom parsing logic** - all validation through existing utilities

## Type-Specific Implementation Steps

### Step 1: Update Parser Configuration (model-headers.js) - [TYPE SPECIFIC]

**File:** `app/services/model-headers.js`

#### Type 1: Column-Based, Conventional NIRMS Configuration
```javascript
[RETAILER_NAME]: {
  invalidSheets: [/* trader-specific invalid sheets if any */],
  establishmentNumber: {
    regex: /[establishment_number_pattern]/i,
  },
  regex: {
    description: /[description_pattern]/i,
    commodity_code: /[commodity_pattern]/i,
    number_of_packages: /[packages_pattern]/i,
    total_net_weight_kg: /[weight_pattern]/i,
  },
  country_of_origin: /[coo_pattern]/i,
  type_of_treatment: /[treatment_pattern]/i,
  nirms: /[standard_nirms_pattern]/i,
  validateCountryOfOrigin: true,
}
```

#### Type 2: Column-Based, Unconventional NIRMS Configuration
```javascript
[RETAILER_NAME]: {
  establishmentNumber: {
    regex: /[establishment_number_pattern]/i,
  },
  regex: {
    description: /[description_pattern]/i,
    commodity_code: /[commodity_pattern]/i,
    number_of_packages: /[packages_pattern]/i,
    total_net_weight_kg: /[weight_pattern]/i,
  },
  country_of_origin: /[coo_pattern]/i,
  type_of_treatment: /[treatment_pattern]/i,
  nirms: /[custom_nirms_pattern]/i,
  validateCountryOfOrigin: true,
}
```

#### Type 3: Blanket Statement, Fixed Configuration
```javascript
[RETAILER_NAME]: {
  establishmentNumber: {
    regex: /[establishment_number_pattern]/i,
  },
  regex: {
    description: /[description_pattern]/i,
    commodity_code: /[commodity_pattern]/i,
    number_of_packages: /[packages_pattern]/i,
    total_net_weight_kg: /[weight_pattern]/i,
  },
  country_of_origin: /[coo_pattern]/i,
  validateCountryOfOrigin: true,
  findUnitInHeader: true,
  blanketNirms: {
    regex: /[fixed_nirms_statement]/i,
    value: "NIRMS",
  },
  blanketTreatmentType: {
    regex: /[fixed_treatment_statement]/i,
    value: "Processed",
  },
}
```

#### Type 4: Blanket Statement, Dynamic Configuration
```javascript
[RETAILER_NAME]: {
  establishmentNumber: {
    regex: /[establishment_number_pattern]/i,
  },
  regex: {
    description: /[description_pattern]/i,
    commodity_code: /[commodity_pattern]/i,
    number_of_packages: /[packages_pattern]/i,
    total_net_weight_kg: /[weight_pattern]/i,
  },
  country_of_origin: /[coo_pattern]/i,
  validateCountryOfOrigin: true,
  findUnitInHeader: true,
  blanketNirms: {
    regex: /[variable_nirms_statement]/i,
    value: "NIRMS",
  },
  blanketTreatmentType: {
    regex: /[variable_treatment_statement]/i,
  },
}
```

### Step 2: Verify Parser Implementation (Minimal Changes)

**File:** `app/services/parsers/[retailer]/model1.js`

**Required Changes:** (Usually minimal - configuration does the work)
```javascript
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  allRequiredFieldsPresent,
  parserModel.[RETAILER],
  establishmentNumbers,
  headers.[RETAILER]
);
```

### Step 3: Type-Specific Testing Implementation

**⚠️ CRITICAL TESTING REQUIREMENTS:**

**Required Test Files:**
- `test/unit/services/parser-service/[retailer]/model1.test.js` - Test cases
- `test/unit/test-data-and-results/models/[retailer]/model1.js` - Test data models (MUST CREATE ALL)
- `test/unit/test-data-and-results/results/[retailer]/model1.js` - Expected results (UPDATE EXISTING)
- Test data in `app/packing-lists/[retailer]/` directory  

**MANDATORY Test Data Model Creation:**
For every test case `model.[testDataName]`, you MUST create corresponding export in the test data models file:
```javascript
module.exports = {
  validCooModel: {
    [SHEET_NAME]: [
    ],
  },
  missingBlanketStatement: {
  },
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

#### Type 1: Column-Based, Conventional NIRMS Testing
```javascript
describe('[RETAILER] CoO Validation Tests - Type 1', () => {
  test('Valid packing list with conventional NIRMS values', () => {
    expect(result.business_checks.failure_reasons).toBeNull();
  });
  
  test('Invalid conventional NIRMS values - validation errors', () => {
    expect(result.business_checks.failure_reasons).toContain('NIRMS/Non-NIRMS goods not specified');
  });
  
  test('Missing CoO values with valid NIRMS', () => {
    expect(result.business_checks.failure_reasons).toContain('Missing Country of Origin');
  });
});
```

#### Type 2: Column-Based, Unconventional NIRMS Testing  
```javascript
describe('[RETAILER] CoO Validation Tests - Type 2', () => {
  test('Valid packing list with unconventional NIRMS values', () => {
    expect(result.business_checks.failure_reasons).toBeNull();
  });
  
  test('Invalid unconventional NIRMS values - validation errors', () => {
    expect(result.business_checks.failure_reasons).toContain('Invalid entry for NIRMS/Non-NIRMS goods');
  });
  
  test('Unconventional NIRMS value mapping', () => {
    expect(result.items[0].nirms).toBe('NIRMS');
  });
});
```

#### Type 3: Blanket Statement, Fixed Testing
```javascript  
describe('[RETAILER] CoO Validation Tests - Type 3', () => {
  test('Valid packing list with fixed blanket statement', () => {
    expect(result.business_checks.failure_reasons).toBeNull();
  });
  
  test('Missing fixed blanket statement - validation fails', () => {
    expect(result.business_checks.failure_reasons).toContain('NIRMS/Non-NIRMS goods not specified');
  });
  
  test('Fixed blanket statement sets all items to NIRMS', () => {
    expect(result.items.every(item => item.nirms === 'NIRMS')).toBe(true);
  });
});
```

#### Type 4: Blanket Statement, Dynamic Testing
```javascript
describe('[RETAILER] CoO Validation Tests - Type 4', () => {
  test('Valid packing list with dynamic blanket statement', () => {
    const result = await parserService.findParser(model.validCooModel, filename);
    expect(result.business_checks.failure_reasons).toBeNull();
  });
  
  test('BAC1: Missing dynamic blanket statement - validation fails', () => {
    const result = await parserService.findParser(model.missingBlanketStatement, filename);  
    expect(result.business_checks.failure_reasons).toContain('NIRMS/Non-NIRMS goods not specified');
  });
  
  test('Dynamic blanket statement with establishment number variation', () => {
    const result = await parserService.findParser(model.dynamicVariation, filename);
    expect(result.items.every(item => item.nirms === 'NIRMS')).toBe(true);
  });
  
  test('BAC2: Missing CoO values with blanket statement - validation errors', () => {
    const result = await parserService.findParser(model.missingCooValues, filename);
    expect(result.business_checks.failure_reasons).toContain('Missing Country of Origin');
  });
  
  test('BAC7-10: Prohibited items validation with treatment type', () => {
    const result = await parserService.findParser(model.prohibitedItems, filename);
    expect(result.business_checks.failure_reasons).toContain('Prohibited item identified on the packing list');
  });
});
```

**⚠️ CRITICAL DEBUGGING STEPS:**
If tests fail with "NIRMS/Non-NIRMS goods not specified":
1. Verify blanket statement text in test data matches configuration regex exactly
2. Test regex: `node -e 'console.log(/your_regex/.test("exact_blanket_statement_from_test_data"))'`
3. Ensure blanket statement configuration has both `regex` AND `value` properties
4. Check that blanket statement appears in test data where expected

### Step 4: Integration Verification

**Verify Integration Points:**
1. **Parser Registration**: Ensure parser is registered in parser routing
2. **Matcher Configuration**: Verify matcher can identify trader format
3. **Validation Pipeline**: Confirm validation utilities are called correctly
4. **Error Handling**: Test error scenarios return proper error format

## Critical Implementation Warnings

### ❌ DO NOT IMPLEMENT

1. **Custom Parser Logic**: Never write manual parsing code - use mapParser()
2. **Custom Validation Functions**: Never create new validation utilities - use existing ones
3. **Manual Sheet Processing**: Never write custom sheet iteration - use standard patterns
4. **Exception Throwing**: Never throw exceptions - return combineParser.combine() with empty arrays
5. **Non-Standard Architecture**: Never deviate from established parser patterns

### ✅ MUST FOLLOW

1. **Configuration-Driven Approach**: All validation through model-headers.js configuration
2. **Existing Validation Pipeline**: Use combineParser.combine() for all validation orchestration
3. **Standard Parser Patterns**: Follow patterns from existing parser implementations
4. **Comprehensive Testing**: Include all acceptance criteria scenarios in tests
5. **Proper Error Handling**: Use established error handling patterns

## Validation Checklist

**⚠️ CRITICAL: Implementation is NOT complete until ALL items checked:**

- [ ] **Configuration Update**: model-headers.js updated with correct patterns and validation flags
  - [ ] For Type 3 blanket statements: Both `regex` AND `value` properties present for blanketNirms and blanketTreatmentType
  - [ ] For Type 4 blanket statements: `regex` AND `value` properties for blanketNirms, only `regex` property for blanketTreatmentType
  - [ ] Only specified configuration elements added (no cross-retailer copying)
- [ ] **Parser Integration**: Parser uses standard combineParser.combine() pattern
- [ ] **Test Data Models Created**: ALL test data models exist for every test case reference
  - [ ] Every `model.[testDataName]` has corresponding export in test data file
  - [ ] Blanket statement text in test data matches configuration regex exactly
  - [ ] Prohibited items use actual prohibited commodity codes from data file
- [ ] **Legacy Test Results Updated**: Existing test expectations updated for CoO validation changes
  - [ ] Removed outdated "NIRMS/Non-NIRMS goods not specified" errors where blanket statement now detected
- [ ] **Complete Test Coverage**: All acceptance criteria covered in unit tests
  - [ ] ALL CoO validation test cases passing
  - [ ] ALL existing regression tests passing  
  - [ ] 100% test pass rate: `npm test -- --testPathPattern="[retailer]/model1.test.js"`
- [ ] **Blanket Statement Detection Verified**: If using blanket statements
  - [ ] Regex tested against actual test data text
  - [ ] For Type 3: Configuration includes both `regex` and `value` properties for all blanket statements
  - [ ] For Type 4: Configuration includes `regex` and `value` for blanketNirms, only `regex` for blanketTreatmentType
  - [ ] No "NIRMS/Non-NIRMS goods not specified" errors in passing tests
- [ ] **Integration Testing**: Parser works with matcher and validation pipeline
- [ ] **Error Handling**: All error scenarios return proper error format
- [ ] **Code Quality**: Follows established code quality standards
- [ ] **Documentation**: Implementation matches specification business requirements

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
```

## Quality Assurance Guidelines

### Technical Accuracy Verification

1. **Architecture Compliance**: Implementation must match existing parser patterns exactly
2. **Configuration Focus**: All validation through model-headers.js, minimal code changes
3. **Integration Testing**: Verify integration with existing validation pipeline
4. **Error Handling**: Consistent error patterns with existing implementations
5. **Test Coverage**: Comprehensive coverage of all acceptance criteria scenarios

### Business Requirement Validation

1. **Acceptance Criteria Coverage**: All Gherkin scenarios covered in implementation
2. **Column Mapping Accuracy**: Trader-specific column patterns correctly identified
3. **Validation Logic**: Business rules properly translated to configuration flags
4. **Error Message Consistency**: Error messages match specification requirements

### Implementation Review Checklist

Before finalizing implementation guide:

- [ ] **CoO validation type correctly identified** (Type 1, 2, 3, or 4)
- [ ] **Business requirements accurately extracted** from specification  
- [ ] **Type-specific configuration pattern applied** (column vs blanket, conventional vs unconventional)
- [ ] **Technical implementation follows existing patterns** (no fictional code)
- [ ] **Configuration changes match detected type** (nirms field vs blanketNirms object)
- [ ] **Testing approach covers type-specific scenarios** (column validation vs blanket statement detection)
- [ ] **Integration points are clearly identified and verified**
- [ ] **Error handling follows established patterns**
- [ ] **Implementation guide is actionable** (developer can follow step-by-step)
- [ ] **Type-specific examples provided** (matching similar implementations in codebase)

## Anti-Patterns to Avoid (Based on Specification Analysis)

### Common Specification Errors

1. **Fictional Parser Implementation**: Specifications often show complex parser code that doesn't match actual architecture
2. **Manual Validation Logic**: Specifications may show custom validation functions that aren't needed
3. **Non-Standard Patterns**: Specifications may suggest approaches that don't match existing codebase patterns
4. **Over-Engineering**: Specifications may suggest complex solutions when simple configuration changes suffice
5. **Type Confusion**: Specifications may mix different CoO validation approaches without understanding the distinct patterns

### Type-Specific Implementation Reality Check

**⚠️ CRITICAL: Ask these questions during implementation:**
1. **Type Detection**: Have I correctly identified the CoO validation type (1, 2, 3, or 4)?
2. **Configuration Match**: Does my configuration pattern match the detected type?
   - Type 1/2: Using `nirms: /pattern/i` field?
   - Type 3/4: Using `blanketNirms: { regex: /pattern/i, value: "NIRMS" }` object?
   - **⚠️ CRITICAL**: For blanket statements, BOTH regex AND value required
3. **Existing Pattern Compliance**: Does this match similar implementations in model-headers.js?
4. **Value Mapping**: Are NIRMS values handled correctly for the detected type?
   - Type 1: Standard Yes|NIRMS|Green / No|Non-NIRMS|Red patterns?
   - Type 2: Trader-specific unconventional patterns?
   - Type 3/4: Blanket statement detection with appropriate regex?
5. **Treatment Type Blanket Detection**: For Type 3/4, does specification require treatment type blankets?
   - Check for: "Treatment Type Header", "Treatment Blanket Location" references
   - Check for: BACs distinguishing "treatment type is specified" vs "treatment type null"
   - **Type 3 (Fixed)**: Add `blanketTreatmentType: { regex: /pattern/i, value: "Processed" }` if found
   - **Type 4 (Dynamic)**: Add `blanketTreatmentType: { regex: /pattern/i }` WITHOUT value - treatment extracted dynamically
6. **Testing Coverage**: Do tests cover type-specific scenarios (column vs blanket validation)?
7. **Test Data Completeness**: Do ALL test data models exist?
   - **⚠️ CRITICAL**: Every `model.[name]` reference must have corresponding export
   - Test blanket statement text against regex: `node -e 'console.log(/regex/.test("text"))'`
8. **Legacy Test Compatibility**: Have existing test results been updated?
   - **⚠️ CRITICAL**: Remove outdated NIRMS validation errors when blanket statement now works
9. **Prohibited Items Validation**: Are test data using actually prohibited items?
   - **⚠️ CRITICAL**: Verify commodity codes exist in `data-prohibited-items.json`
10. **Complete Test Pass**: Are ALL tests passing?
   - **⚠️ CRITICAL**: Run `npm test -- --testPathPattern="[retailer]/model1.test.js"` until 0 failures

**🛑 IMPLEMENTATION STOPPING POINT**: Only when ALL questions above answered "YES" and all tests pass.

## Critical Debugging Guide

### Blanket Statement Detection Failures

**Symptom**: Tests fail with "NIRMS/Non-NIRMS goods not specified" error
**Root Cause**: Blanket statement not detected by parser-map.js validation pipeline

**Debugging Steps:**
1. **Verify Configuration Structure**:
   ```javascript
   // ❌ WRONG - Missing value property
   blanketNirms: {
     regex: /pattern/i,
   }
   
   // ✅ CORRECT - Both properties required
   blanketNirms: {
     regex: /pattern/i,
     value: "NIRMS",
   }
   ```

2. **Test Regex Against Actual Data**:
   ```bash
   # Extract blanket statement text from test data
   # Test regex pattern
   node -e 'console.log(/your_regex_pattern/.test("exact_blanket_statement_text_from_test_data"))'
   # Must return true
   ```

3. **Verify parser-map.js Processing**:
   - Check lines 61-62 and 91 in `app/services/parser-map.js`
   - Blanket statement detection requires both `regex` and `value` properties

### Test Data Model Errors

**Symptom**: "Cannot read properties of undefined" errors in tests
**Root Cause**: Test references `model.[name]` but export doesn't exist

**Fix**: Create ALL test data models:
```javascript
// In test/unit/test-data-and-results/models/[retailer]/model1.js
module.exports = {
  validCooModel: { /* test data */ },
  missingBlanketStatement: { /* test data */ },
  dynamicVariation: { },
  missingCooValues: { },
  invalidCooFormat: { },
  cooPlaceholderX: { },
  multipleCooErrors: { },
  prohibitedItems: { },
};
```

### Prohibited Items Test Failures

**Symptom**: Prohibited items test passes when it should fail
**Root Cause**: Test data uses commodity codes not in prohibited items list

**Fix**: Use actual prohibited items:
```bash
# Find prohibited items
grep -i "GB" app/services/data/data-prohibited-items.json
# Use commodity codes that actually appear in the file
# Example: "08045000" from "GB" is actually prohibited
```

### Legacy Test Failures After CoO Implementation

**Symptom**: Existing tests fail with different error messages than expected
**Root Cause**: CoO validation changes behavior - blanket statement now detected

**Fix**: Update test result expectations:
```javascript
failure_reasons: 'Other errors...'
```

## Example Usage

```bash
# Generate implementation guide for different CoO validation types:

# Type 1 - Column-based, conventional NIRMS
ADO_TICKET_NUMBER="AB591514"  # ASDA3
# Generates: .spec/coo/AB591514-asda3-coo-validation-implementation.md

# Type 2 - Column-based, unconventional NIRMS  
ADO_TICKET_NUMBER="AB599300"  # MARS
# Generates: .spec/coo/AB599300-mars-coo-validation-implementation.md

# Type 3 - Blanket statement, fixed
ADO_TICKET_NUMBER="AB591516"  # BANDM
# Generates: .spec/coo/AB591516-bandm-coo-validation-implementation.md

# Type 4 - Blanket statement, dynamic
ADO_TICKET_NUMBER="AB591527"  # GIOVANNI1
# Generates: .spec/coo/AB591527-giovanni1-coo-validation-implementation.md
```

## Success Criteria

**A successful implementation guide will result in:**

### Configuration Success
1. ✅ **Correctly identify CoO validation type** (Type 1, 2, 3, or 4) from specification analysis
2. ✅ **Provide type-specific, accurate implementation steps** matching detected pattern
3. ✅ **Use appropriate configuration approach** (nirms field vs blanketNirms object with proper structure)
4. ✅ **Include complete configuration requirements** (both regex AND value for blanket statements)
5. ✅ **Prevent cross-retailer configuration copying** (retailer-specific requirements only)

### Testing Success  
6. ✅ **Include comprehensive test data model creation guidance** (every test reference must have export)
7. ✅ **Provide prohibited items test data using actual prohibited commodity codes**
8. ✅ **Include legacy test result update requirements** (remove outdated error expectations)
9. ✅ **Emphasize 100% test pass rate requirement** (0 failures before completion)
10. ✅ **Include blanket statement regex testing procedures** (manual verification steps)

### Architecture Success
11. ✅ **Follow established architecture patterns exactly** for the identified type
12. ✅ **Focus on minimal configuration changes** rather than custom code
13. ✅ **Avoid all fictional technical implementation details**
14. ✅ **Reference similar existing implementations** as validation examples
15. ✅ **Enable developer to implement feature correctly** without common pitfalls

### Debugging Success
16. ✅ **Include troubleshooting guide for blanket statement detection failures**
17. ✅ **Provide test data model error resolution steps**
18. ✅ **Include prohibited items validation debugging procedures**
19. ✅ **Explain legacy test compatibility requirements**
20. ✅ **Define clear implementation completion criteria** (all tests passing)
