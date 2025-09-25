# Implement Complete Solution for CoO Spec from ADO Ticket ID Prompt

## Purpose
This prompt implements a complete solution from an ADO ticket ID by finding the corresponding specification, implementing the solution according to the implementation guide, and ensuring all unit tests pass for each acceptance criteria.

## Usage
```
Follow instructions in [implement-from-ado-ticket.prompt.md]. <ADO_TICKET_ID>
```

## Universal Implementation Principles (ALL Types)

**Universal Implementation Principles (All Types)**

These principles apply to all CoO validation implementations regardless of type:

1. Existing unit tests should continue passing - Implementation must not break existing functionality for unrelated models (e.g., implementing ASDA3 CoO validation should not affect ASDA1 or ASDA2 tests)

2. Test data for existing unit tests should have non-NIRMS values - Populate relevant NIRMS columns with "Non-NIRMS" values in existing test data to prevent validation failures on models that don't have CoO validation enabled

3. Additional columns should not be added to regex property in model-headers.js - CoO fields (nirms, country_of_origin, etc.) are optional additions outside the regex property, not mandatory parsing fields that would break existing parsers

4. Only the relevant model should be updated - Implementation should be completely isolated to the target model only (e.g., ASDA3 implementation should require zero changes to ASDA1, ASDA2, or any other independent models)

Violation of these principles indicates architectural issues that must be resolved before proceeding.

## Two-Step Implementation Approach

**⚠️ CRITICAL: This prompt follows a two-step approach to prevent breaking existing tests:**

**STEP 1 - Fix Existing Test Data (add-non-nirms-to-existing-test-data.prompt):**
- ONLY adds NIRMs/Non-NIRMs column to existing test data models
- ONLY adds "Non-NIRMS" values to existing data rows
- Does NOT add other CoO columns (Commodity Code, Country of Origin, Treatment Type)
- Purpose: Prevent existing tests from failing when CoO validation is enabled

**STEP 2 - Implement CoO Validation (this prompt):**
- Updates parser configuration (model-headers.js) 
- Fixes parser implementation (6-parameter combineParser.combine)
- Creates NEW test data models with full CoO column structure for BAC scenarios
- Creates comprehensive CoO validation tests
- Does NOT modify existing test data models (already handled in Step 1)

**Why Two Steps:**
- Existing tests use models like `validModel`, `invalidModel_MissingColumnCells`
- New CoO tests use models like `validCooModel`, `bac1Model`, `bac2Model`
- This separation ensures no regressions while adding comprehensive CoO validation

## Instructions

### Step 1: Fix Existing Test Data (MANDATORY FIRST STEP)

**⚠️ CRITICAL: This step MUST be completed before making any other changes.**

**Before any implementation changes, automatically run the test data fixer:**

```
Follow instructions in [add-non-nirms-to-existing-test-data.prompt.md]. <ADO_TICKET_ID>
```

**What this step does:**
- ONLY adds NIRMs/Non-NIRMs column to existing test data models
- ONLY adds "Non-NIRMS" values to existing data rows 
- Does NOT add Commodity Code, Country of Origin, or other CoO columns
- Does NOT modify parser configuration or create new test scenarios
- Ensures existing unit tests won't fail when CoO validation is later implemented

This step is mandatory and must be completed first to ensure existing unit tests won't fail due to missing Non-NIRMS values when CoO validation is implemented.

### Step 2: Specification Discovery
1. **Find Implementation Guide**: Look for file matching pattern `.spec/coo/AB<TICKET_ID>-*-implementation.md`
2. **Validate Guide**: Ensure the implementation guide exists and contains:
   - Business Requirements Summary
   - Architecture Decision with Type classification
   - Implementation Steps
   - Testing Requirements
   - Acceptance Criteria (BAC scenarios)

### Step 3: Implementation Type Detection
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

### Step 4: Implementation Execution

#### 4.1 Configuration Updates (model-headers.js)
Follow the implementation guide's configuration requirements:

1. **Read current configuration**: `app/services/model-headers.js`
2. **Apply type-specific changes** as specified in the implementation guide
3. **Verify configuration syntax** and existing patterns

#### 4.2 Parser Verification/Updates
1. **Read existing parser** (path specified in implementation guide)
2. **Verify compliance** with implementation requirements
3. **Apply minimal changes** only if specified in implementation guide
4. **Ensure proper `combineParser.combine()` usage**

#### 4.3 Test Implementation Strategy
Based on acceptance criteria count and type:

**⚠️ CRITICAL: Use parser-service layer for validation testing**

CoO validation occurs in the `generateParsedPackingList()` function via `packingListValidator.validatePackingList()`. Direct parser calls (`parser.parse()`) bypass validation entirely.

**Standard Test Structure:**
```javascript
describe('<Parser> CoO Validation Tests - Type <X>', () => {
  // Happy path test
  test('Valid packing list with <type-specific> validation', async () => {
    const result = await parserService.findParser(model.validTestData, filename);
    expect(result).toMatchObject(test_results.validCooResult);
  });
  
  // Individual BAC tests (one per acceptance criteria)
  test('BAC<N>: <Acceptance Criteria Description>', async () => {
    const result = await parserService.findParser(model.bacTestData<N>, filename);
    expect(result).toMatchObject(test_results.bacResult<N>);
  });
});
```

**Alternative Pattern (Not Recommended):**
```javascript
// Direct parser calls bypass validation pipeline
describe('Direct Parser Testing', () => {
  test('Field parsing only', () => {
    const result = parser.parse(testData); // No validation triggered
    // business_checks.failure_reasons will always be null
  });
});
```

MANDATORY: For every CoO spec implemented with this prompt, BAC-driven unit tests and accompanying test data fixtures must be implemented for the targeted ticket. Requirements include:
- At least one unit test covering the happy path and one unit test for each BAC in the specification
- Test data fixtures for each BAC under `test/unit/test-data-and-results/` following established project patterns
- All new tests must pass locally (`npm test -- <test-file>`)

### Step 5: Test Data Requirements

#### 5.1 Identify Required Test Files
From implementation guide, determine:
- **Test directory**: Usually `app/packing-lists/<retailer>/`
- **Test file naming**: Pattern from existing files or implementation guide
- **Number of test files needed**: One per BAC scenario + happy path

#### 5.2 Test Data Creation Strategy

**⚠️ CRITICAL DISTINCTION: New vs. Existing Test Data Models**

**EXISTING Test Data Models (updated in Step 1):**
- Already have NIRMs/Non-NIRMs column with "Non-NIRMS" values (from Step 1)
- Should NOT be modified further in this step
- Used for existing regression tests that should continue passing

**NEW Test Data Models (created in this step):**
- Created specifically for CoO validation BAC scenarios
- MUST include ALL required CoO columns as specified in implementation guide:
  - NIRMs/Non-NIRMs column (with various test values: NIRMS, Non-NIRMS, null, invalid)
  - Commodity Code column (if specified in implementation guide)
  - Country of Origin column (if specified in implementation guide)
  - Treatment Type column (if not already present)
- Used exclusively for new CoO validation test scenarios

**If test files don't exist:**
1. **Create base template** from existing similar retailer files
2. **Modify for specific requirements** based on BAC scenarios
3. **Ensure establishment number matches** parser configuration
4. **Include required columns/sheets** as specified in implementation guide

**Test Data Patterns by Type:**
- **Type 1/2**: Individual CoO column variations (valid, invalid, missing, placeholder)
- **Type 3**: Fixed blanket statement presence/absence + column variations
- **Type 4**: Dynamic blanket statement variations + column validation

**⚠️ CRITICAL: Mock Data for Prohibited Items Testing**

When implementing BAC scenarios that test prohibited items validation:

1. **Use Mock Values**: Replace real commodity codes and ISO codes with consistent mock values:
   - Use `'PROHIBITED_COMMODITY'` for commodity codes that should trigger prohibited item validation
   - Use `'PROHIBITED_ITEM_ISO'` for country codes that should trigger prohibited item validation

2. **Jest Mock Implementation**: Follow established patterns from B&M model1 for mocking data modules:
   ```javascript
   // Mock data as arrays matching actual data structure
   jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
     "VALID_ISO",
     "PROHIBITED_ITEM_ISO",
     "GB",
     "X",
   ]);

   jest.mock("../../../../../app/services/data/data-prohibited-items.json", () => [
     {
       country_of_origin: "PROHIBITED_ITEM_ISO",
       commodity_code: "PROHIBITED_COMMODITY",
       type_of_treatment: "Processed", 
     },
   ]);
   ```

3. **Benefits of Mock Approach**:
   - Tests are reliable and deterministic
   - Independent of changes to real prohibited items data
   - Consistent results across environments
   - Follows established testing patterns in the codebase

### Step 6: Comprehensive Test Implementation

#### 6.1 Unit Test File Location
- **Path**: `test/unit/services/parser-service/<retailer>/<model>.test.js` (not `parsers/`)
- **Integration Layer**: Uses `parserService.findParser()` to trigger validation pipeline
- **Import pattern**: Follow existing parser-service test file structure
- **Mock requirements**: Logger, test data, expected results from results directory

**Validation Pipeline Integration:**
CoO validation tests must be placed in `parser-service/` directory because:
1. `parserService.findParser()` calls `generateParsedPackingList()` 
2. `generateParsedPackingList()` calls `packingListValidator.validatePackingList()`
3. `validatePackingList()` populates `business_checks.failure_reasons`

Tests in `parsers/` directory call `parser.parse()` directly, bypassing the validation pipeline entirely.

#### 6.2 Test Implementation Requirements

**Required Test Structure Pattern:**
```javascript
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/<retailer>/<model>");
const test_results = require("../../../test-data-and-results/results/<retailer>/<model>");

const filename = "packinglist-<retailer>-<model>.<ext>";

describe("matches<Retailer><Model> CoO Validation", () => {
  // MANDATORY: Mock prohibited items data for consistent testing
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock prohibited items and ISO codes data following established patterns
  jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
    "VALID_ISO",
    "PROHIBITED_ITEM_ISO", 
    "GB",
    "X",
  ]);

  jest.mock("../../../../../app/services/data/data-prohibited-items.json", () => [
    {
      country_of_origin: "PROHIBITED_ITEM_ISO",
      commodity_code: "PROHIBITED_COMMODITY",
      type_of_treatment: "Processed",
    },
  ]);

  // Existing happy path test
  test("matches valid file with CoO validation - happy path", async () => {
    const result = await parserService.findParser(model.validCooModel, filename);
    expect(result).toMatchObject(test_results.validCooTestResult);
  });

  // Individual BAC tests 
  test("BAC<N>: <Acceptance Criteria Description>", async () => {
    const result = await parserService.findParser(model.bac<N>Model, filename);
    expect(result).toMatchObject(test_results.bac<N>TestResult);
  });
});
```

**For each BAC scenario, implement:**
1. **Individual test case** with descriptive name matching BAC
2. **NEW test data model** in `models/<retailer>/<model>.js` (separate from existing models updated in Step 1)
   - Use naming pattern: `bac<N>Model`, `validCooModel`, `nullNirmsModel`, etc.
   - Include ALL required CoO columns as specified in implementation guide
   - Use mock values for prohibited items testing
3. **Expected result** in `results/<retailer>/<model>.js` with specific `failure_reasons`
4. **Exact error message verification** as specified in BAC
5. **Integration testing** via `parserService.findParser()` not direct parser calls

**⚠️ CRITICAL: NEW Test Data Models vs. EXISTING Models**
- **EXISTING models** (validModel, invalidModel_MissingColumnCells, etc.): Already updated in Step 1 with Non-NIRMS values, should NOT be modified further
- **NEW models** (validCooModel, bac1Model, bac2Model, etc.): Created fresh in this step with full CoO column structure for BAC testing

**⚠️ CRITICAL: Mock Data Requirements for Prohibited Items Testing**

For BAC scenarios involving prohibited items validation:

1. **Use Mock Values in Test Data**: Replace real prohibited items with consistent mock values:
   - `commodity_code`: Use `'PROHIBITED_COMMODITY'` for prohibited items
   - `country_of_origin`: Use `'PROHIBITED_ITEM_ISO'` for prohibited country codes
   - This ensures consistent, reliable testing independent of real data changes

2. **Implement Jest Mocks**: Follow the pattern established in B&M model1 tests:
   ```javascript
   // Mock ISO codes data as array
   jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
     "VALID_ISO",
     "PROHIBITED_ITEM_ISO",
     "GB", 
     "X",
   ]);

   // Mock prohibited items data as array of objects
   jest.mock("../../../../../app/services/data/data-prohibited-items.json", () => [
     {
       country_of_origin: "PROHIBITED_ITEM_ISO",
       commodity_code: "PROHIBITED_COMMODITY", 
       type_of_treatment: "Processed",
     },
   ]);
   ```

3. **Test Data Model Pattern**:
   ```javascript
   // In test data models, use mock values consistently
   bac11Model: {
     Page1_1: [
       ['Header Row'],
       ['Item Description', 'PROHIBITED_COMMODITY', 'PROHIBITED_ITEM_ISO', 'NIRMS']
     ]
   }
   ```

This approach ensures prohibited items tests are reliable, consistent, and independent of external data changes.

NOTE: The instructions above are normative: implementing the BAC-driven tests and test data is a required deliverable for the ticket. Tests should follow the repository's existing patterns using `parserService.findParser()` to trigger the full validation pipeline including `business_checks.failure_reasons` population. Tests must be added to `test/unit/services/parser-service/<retailer>/` with fixtures under `test/unit/test-data-and-results/models/<retailer>/` and expected results under `test/unit/test-data-and-results/results/<retailer>/`.

#### 6.3 Test Coverage Verification
Ensure tests cover:
- [ ] **Happy path**: Valid document passes validation
- [ ] **Each BAC scenario**: Individual acceptance criteria failures
- [ ] **Error aggregation**: Multiple errors reported correctly
- [ ] **Placeholder handling**: Valid placeholders accepted (e.g., 'X')
- [ ] **Type-specific patterns**: Blanket statements, column validation, etc.
- [ ] **Edge cases**: Empty sheets, malformed data, multiple sheets

### Step 7: Implementation Execution Order

#### 7.1 Configuration First
1. **Update model-headers.js** with type-specific configuration
2. **Verify syntax** and existing pattern consistency
3. **Test configuration loading** (no runtime errors)

#### 7.2 Test Development
1. Create/update test file in `parser-service/` directory (not `parsers/`) 
2. Use `parserService.findParser()` to trigger validation pipeline
3. Create test data files for each scenario (if needed)
4. Create expected results in `results/` directory with `failure_reasons`
5. Run tests to verify validation pipeline integration
6. Fix parser issues (minimal changes only as per implementation guide)

#### 7.3 Validation and Refinement
1. **Run full test suite** to ensure no regressions
2. **Verify all BAC tests pass** individually
3. **Check integration** with existing validation pipeline
4. **Validate error message formats** match specifications

### Step 8: Quality Assurance Checklist

Before considering implementation complete:

#### 8.1 Configuration Compliance
- [ ] **Type-specific flags**: `validateCountryOfOrigin` and type-specific configuration added
- [ ] **Regex patterns**: Match specification requirements exactly
- [ ] **Establishment numbers**: Correct for retailer/trader
- [ ] **Column mappings**: Match specification field mappings

#### 8.2 Test Implementation Compliance
- [ ] **BAC coverage**: One test per acceptance criteria
- [ ] **Test naming**: Clear, descriptive test names matching BAC descriptions
- [ ] **Error messages**: Exact error message strings from specifications
- [ ] **Location tracking**: Sheet and row references tested
- [ ] **Aggregation**: "More than 3 errors" patterns tested
- [ ] **Mock implementation**: Jest mocks for prohibited items data using established patterns
- [ ] **Mock values**: Consistent use of `PROHIBITED_COMMODITY` and `PROHIBITED_ITEM_ISO` in test data
- [ ] **Test reliability**: Tests pass consistently with mocked data, independent of real data changes

#### 8.3 Integration Compliance
- [ ] **Parser integration**: Uses correct `combineParser.combine()` signature
- [ ] **Validation pipeline**: Integrates with existing validation utilities
- [ ] **Error handling**: Maintains existing error handling patterns
- [ ] **No regressions**: Existing tests still pass

#### 8.4 Code Quality
- [ ] **Minimal changes**: Only changes specified in implementation guide
- [ ] **Pattern consistency**: Follows existing code patterns
- [ ] **Documentation**: Code comments where appropriate
- [ ] **Type safety**: Proper JavaScript/Node.js patterns

### Step 9: Final Validation

#### 9.1 Test Execution
```bash
# Run specific CoO validation test file (parser-service layer)
npm test -- test/unit/services/parser-service/<retailer>/<model>.test.js

# Run all tests to check for regressions
npm test

# Run with coverage to verify test completeness
npm run test:unit
```

**Validation Pipeline Verification:**
Ensure tests trigger validation by confirming:
- `business_checks.failure_reasons` contains expected error messages (not null)
- `parserService.findParser()` is used (not direct `parser.parse()`)
- Test location is `parser-service/` directory (not `parsers/`)

#### 9.2 Expected Outcomes
- [ ] **All BAC tests pass**: Each acceptance criteria test passes individually
- [ ] **Happy path passes**: Valid document processes successfully
- [ ] **No regressions**: Existing test suite passes completely
- [ ] **Error format compliance**: Error messages match specification exactly
- [ ] **Location tracking**: Sheet/row references accurate

### Step 10: Implementation Summary

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
