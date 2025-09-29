# Implement Complete Solution from ADO Ticket Prompt

## Purpose
This prompt implements a complete solution from an ADO ticket ID by finding the corresponding specification, implementing the solution according to the implementation guide, and ensuring all unit tests pass for each acceptance criteria.

## Usage
```
Follow instructions in [implement-from-ado-ticket.prompt.md]. <ADO_TICKET_ID>
```

## Instructions

### Step 1: Specification Discovery
1. **Find Implementation Guide**: Look for file matching pattern `.spec/coo/AB<TICKET_ID>-*-implementation.md`
2. **Validate Guide**: Ensure the implementation guide exists and contains:
   - Business Requirements Summary
   - Architecture Decision with Type classification
   - Implementation Steps
   - Testing Requirements
   - Acceptance Criteria (BAC scenarios)

### Step 2: Implementation Type Detection
Based on the implementation guide, identify the CoO validation type:

**Type 1: Column-based, Conventional**
- Individual column validation with standard patterns
- Uses `validateCountryOfOrigin: true` flag only

**Type 2: Column-based, Unconventional**  
- Individual column validation with custom patterns
- Uses `validateCountryOfOrigin: true` + custom regex patterns

**Type 3: Blanket Statement, Fixed**
- Document-wide validation with predetermined values
- Uses `blanketNirms: { regex: /pattern/, value: 'NIRMS' }`

**Type 4: Blanket Statement, Dynamic**
- Document-wide validation with variable content
- Uses `blanketNirms: { regex: /pattern/ }` (no fixed value)

### Step 3: Implementation Execution

#### 3.1 Configuration Updates (model-headers.js)
Follow the implementation guide's configuration requirements:

1. **Read current configuration**: `app/services/model-headers.js`
2. **Apply type-specific changes** as specified in the implementation guide
3. **Verify configuration syntax** and existing patterns

#### 3.2 Parser Verification/Updates
1. **Read existing parser** (path specified in implementation guide)
2. **Verify compliance** with implementation requirements
3. **Apply minimal changes** only if specified in implementation guide
4. **Ensure proper `combineParser.combine()` usage**

#### 3.3 Test Implementation Strategy
Based on acceptance criteria count and type:

**Standard Test Structure:**
```javascript
describe('<Parser> CoO Validation Tests - Type <X>', () => {
  // Happy path test
  test('Valid packing list with <type-specific> validation', () => {
    const result = parse(validTestData);
    expect(result.business_checks.failure_reasons).toBeNull();
  });
  
  // Individual BAC tests (one per acceptance criteria)
  test('BAC<N>: <Acceptance Criteria Description>', () => {
    const result = parse(bacTestData<N>);
    expect(result.business_checks.failure_reasons).toContain('<Expected Error Message>');
  });
});
```

### Step 4: Test Data Requirements

#### 4.1 Identify Required Test Files
From implementation guide, determine:
- **Test directory**: Usually `app/packing-lists/<retailer>/`
- **Test file naming**: Pattern from existing files or implementation guide
- **Number of test files needed**: One per BAC scenario + happy path

#### 4.2 Test Data Creation Strategy
**If test files don't exist:**
1. **Create base template** from existing similar retailer files
2. **Modify for specific requirements** based on BAC scenarios
3. **Ensure establishment number matches** parser configuration
4. **Include required columns/sheets** as specified

**Test Data Patterns by Type:**
- **Type 1/2**: Individual CoO column variations (valid, invalid, missing, placeholder)
- **Type 3**: Fixed blanket statement presence/absence + column variations
- **Type 4**: Dynamic blanket statement variations + column validation

### Step 5: Comprehensive Test Implementation

#### 5.1 Unit Test File Location
- **Path**: `test/unit/services/parser-service/<retailer>/<model>.test.js`
- **Import pattern**: Follow existing test file structure
- **Mock requirements**: Logger, test data, expected results

#### 5.2 Test Implementation Requirements
**For each BAC scenario, implement:**
1. **Individual test case** with descriptive name
2. **Appropriate test data** triggering the specific scenario
3. **Exact error message verification** as specified in BAC
4. **Location tracking verification** (sheet/row references)
5. **Aggregation pattern testing** (for "more than 3 errors" scenarios)

#### 5.3 Test Coverage Verification
Ensure tests cover:
- [ ] **Happy path**: Valid document passes validation
- [ ] **Each BAC scenario**: Individual acceptance criteria failures
- [ ] **Error aggregation**: Multiple errors reported correctly
- [ ] **Placeholder handling**: Valid placeholders accepted (e.g., 'X')
- [ ] **Type-specific patterns**: Blanket statements, column validation, etc.
- [ ] **Edge cases**: Empty sheets, malformed data, multiple sheets

### Step 6: Implementation Execution Order

#### 6.1 Configuration First
1. **Update model-headers.js** with type-specific configuration
2. **Verify syntax** and existing pattern consistency
3. **Test configuration loading** (no runtime errors)

#### 6.2 Test Development
1. **Create/update test file** with comprehensive BAC coverage
2. **Create test data files** for each scenario (if needed)
3. **Run tests** to identify any parser issues
4. **Fix parser issues** (minimal changes only as per implementation guide)

#### 6.3 Validation and Refinement
1. **Run full test suite** to ensure no regressions
2. **Verify all BAC tests pass** individually
3. **Check integration** with existing validation pipeline
4. **Validate error message formats** match specifications

### Step 7: Quality Assurance Checklist

Before considering implementation complete:

#### 7.1 Configuration Compliance
- [ ] **Type-specific flags**: `validateCountryOfOrigin` and type-specific configuration added
- [ ] **Regex patterns**: Match specification requirements exactly
- [ ] **Establishment numbers**: Correct for retailer/trader
- [ ] **Column mappings**: Match specification field mappings

#### 7.2 Test Implementation Compliance
- [ ] **BAC coverage**: One test per acceptance criteria
- [ ] **Test naming**: Clear, descriptive test names matching BAC descriptions
- [ ] **Error messages**: Exact error message strings from specifications
- [ ] **Location tracking**: Sheet and row references tested
- [ ] **Aggregation**: "More than 3 errors" patterns tested

#### 7.3 Integration Compliance
- [ ] **Parser integration**: Uses correct `combineParser.combine()` signature
- [ ] **Validation pipeline**: Integrates with existing validation utilities
- [ ] **Error handling**: Maintains existing error handling patterns
- [ ] **No regressions**: Existing tests still pass

#### 7.4 Code Quality
- [ ] **Minimal changes**: Only changes specified in implementation guide
- [ ] **Pattern consistency**: Follows existing code patterns
- [ ] **Documentation**: Code comments where appropriate
- [ ] **Type safety**: Proper JavaScript/Node.js patterns

### Step 8: Final Validation

#### 8.1 Test Execution
```bash
# Run specific test file
npm test -- test/unit/services/parser-service/<retailer>/<model>.test.js

# Run all tests to check for regressions
npm test

# Run with coverage to verify test completeness
npm run test:unit
```

#### 8.2 Expected Outcomes
- [ ] **All BAC tests pass**: Each acceptance criteria test passes individually
- [ ] **Happy path passes**: Valid document processes successfully
- [ ] **No regressions**: Existing test suite passes completely
- [ ] **Error format compliance**: Error messages match specification exactly
- [ ] **Location tracking**: Sheet/row references accurate

### Step 9: Implementation Summary

**Provide implementation summary including:**
1. **Configuration changes made**: Specific model-headers.js updates
2. **Parser changes** (if any): Minimal modifications applied
3. **Test coverage achieved**: Number of BAC scenarios covered
4. **Test files created/modified**: List of test files and test data
5. **Integration verification**: Confirmation of pipeline integration
6. **Quality metrics**: Test pass rate, coverage, regression status

## Error Handling

**If specification not found:**
- List available `.spec/coo/AB*-implementation.md` files
- Suggest correct ticket ID format
- Provide guidance on specification creation

**If tests fail:**
- Analyze failure reasons systematically
- Check configuration syntax
- Verify test data accuracy
- Review error message expectations
- Validate integration points

**If implementation guide incomplete:**
- Identify missing sections
- Request specification updates
- Provide guidance on required information

## Success Criteria

Implementation is successful when:
1. **All BAC tests pass** individually and collectively
2. **Configuration correctly applied** according to type classification
3. **No regressions introduced** in existing functionality
4. **Error messages match** specification requirements exactly
5. **Integration verified** with existing validation pipeline
6. **Code quality maintained** with minimal, targeted changes

---

**PROMPT VERSION**: 1.0  
**COMPATIBLE WITH**: Type 1-4 CoO validation patterns  
**REQUIRED TOOLS**: file operations, test execution, configuration management  
**VALIDATION APPROACH**: Comprehensive BAC-driven test coverage with integration verification
