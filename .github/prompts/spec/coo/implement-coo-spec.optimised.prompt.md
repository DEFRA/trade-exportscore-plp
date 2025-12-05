---
description: "Implements a complete Country of Origin (CoO) validation solution from an ADO ticket ID by finding the specification, implementing according to the implementation guide, and ensuring all BAC-driven unit tests pass."
mode: "agent"
model: Claude Sonnet 4 (copilot)
---

# Implement Complete CoO Solution from ADO Ticket - Optimized

## Purpose
Implements a complete Country of Origin (CoO) validation solution from an ADO ticket ID by finding the specification, implementing according to the implementation guide, and ensuring all BAC-driven unit tests pass.

## Usage
```
Follow instructions in [implement-from-ado-ticket.prompt.md]. <ADO_TICKET_ID>
```

## Core Principles & Critical Requirements

### Universal Implementation Principles
1. **No Breaking Changes**: Existing unit tests must continue passing - implementation must not break functionality for unrelated models
2. **Isolated Implementation**: Only the target model should be updated (e.g., ASDA3 implementation requires zero changes to ASDA1, ASDA2, or other models)  
3. **Non-NIRMS Default**: Existing test data should have "Non-NIRMS" values in relevant columns to prevent validation failures on models without CoO validation
4. **Optional CoO Fields**: CoO fields (nirms, country_of_origin, etc.) are additions outside the regex property in model-headers.js, not mandatory parsing fields

### Critical Testing Requirements

**⚠️ MOST IMPORTANT: Expected test results must match ACTUAL system behavior, not specification text**

The specifications provide conceptual error descriptions, but the validation system returns different formats. **All expected test results must be based on actual system output discovered through testing.**

**Common System vs Specification Discrepancies:**
- Summary format: "in addition to X other locations" vs "and in addition to X other error"
- Prohibited items: Multiple specific errors vs generic "Prohibited item identified"
- Message formatting: Specific punctuation, newlines, casing differ from examples

**Implementation Pattern:**
1. Create test scenarios with placeholder expected results
2. Run tests to discover actual system error messages  
3. Update expected results with exact system messages
4. Never assume error formats from specifications alone

## Implementation Process

### Phase 1: Preparation

**Step 1: Locate Implementation Guide**
- Find file: `.spec/coo/AB<TICKET_ID>-*-implementation.md`
- Verify guide contains: Business Requirements, Architecture Decision, Implementation Steps, Testing Requirements, BAC scenarios

### Phase 2: Implementation

**Step 2: Identify CoO Validation Type**
- **Type 1**: Column-based, Conventional - `validateCountryOfOrigin: true` only
- **Type 2**: Column-based, Unconventional - `validateCountryOfOrigin: true` + custom regex  
- **Type 3**: Blanket Statement, Fixed - `blanketNirms: { regex: /pattern/, value: 'NIRMS' }`
- **Type 4**: Blanket Statement, Dynamic - `blanketNirms: { regex: /pattern/ }`

**Step 3: Update Configuration**
- Modify `app/services/model-headers.js` per implementation guide
- Add type-specific CoO validation configuration outside regex property
- Verify syntax and existing pattern consistency

**Step 4: Verify Parser Compliance**  
- Check existing parser uses correct `combineParser.combine()` signature (6 parameters for CoO validation)
- Apply minimal changes only if specified in implementation guide

### Phase 3: Test Implementation

**Step 5: Test Architecture Setup**

**Critical: Use Parser-Service Layer for Validation Testing**
- **Location**: `test/unit/services/parser-service/<retailer>/<model>.test.js` (NOT `parsers/`)
- **Method**: `parserService.findParser()` triggers validation pipeline
- **Why**: Direct `parser.parse()` calls bypass `validatePackingList()` entirely

**Jest Mock Requirements (Top-Level Placement ONLY):**
```javascript
// ✅ CORRECT: Top-level mocks (hoisted properly)
jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO", "PROHIBITED_ITEM_ISO", "GB", "X"
]);

jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  { country_of_origin: "PROHIBITED_ITEM_ISO", commodity_code: "1234", type_of_treatment: "Processed" }
]);

// ❌ WRONG: Never inside describe blocks (not hoisted)
```

**Step 6: Test Data Strategy**

**Two Types of Test Data Models:**
- **Existing Models** (updated separately): Original structure + NIRMs column with "Non-NIRMS" values
- **New CoO Models** (created here): Complete CoO structure for BAC testing

**⚠️ CRITICAL: CoO Test Data Column Structure Requirements**

**Column Structure Integrity:**
- **Maintain Existing Columns**: CoO test data MUST preserve the existing model's column layout (A, B, C, D, etc.)
- **Add CoO Columns at End**: New CoO fields (commodity_code, country_of_origin) should be added at the END of existing structure
- **Never Modify Existing Mappings**: Do not change existing column meanings (e.g., if Column C is "Nature of Product", keep it as "Nature of Product")
- **Extend, Don't Replace**: CoO validation adds columns, it doesn't replace the existing format

**Example: General Column Structure Preservation**
```javascript
// ✅ CORRECT: Existing structure preserved + CoO fields added at end
validCooModel: {
  Page1_1: [
    {
      A: "Column A Header",                      // Existing (if present)
      B: "Description Header",                   // Existing
      C: "Nature/Product Header",                // Existing  
      D: "Treatment Header",                     // Existing
      E: "Establishment Header",                 // Existing
      F: "Destination Header",                   // Existing (if present)
      G: "Packages Header",                      // Existing
      H: "Weight Header",                        // Existing
      I: "Unit Header",                          // Existing (if present)
      J: "NIRMs Header",                         // Existing (if already present)
      // ... other existing columns ...
      X: "Commodity Code",                       // NEW CoO field (use next available column)
      Y: "Country of Origin",                    // NEW CoO field (use next available column)
    },
    // Data rows follow same pattern...
  ]
}

// ❌ WRONG: Changing existing column structure
validCooModel: {
  Page1_1: [
    {
      B: "Description Header",
      C: "NIRMs/Non-NIRMs",                     // WRONG: Replacing existing column meaning
      D: "Treatment Header", 
      X: "Commodity Code",                       // CoO field
      Y: "Country of Origin",                    // CoO field
    },
    // This will fail at matcher stage - doesn't match existing format
  ]
}
```

**Column Selection Strategy:**
- **Letters A-Z**: Use alphabetically next available columns (if A-J exist, use K, L, etc.)
- **Sequential Numbers**: Some models use numbered columns (if 1-10 exist, use 11, 12, etc.)
- **Mixed Formats**: Follow the existing pattern (letters, numbers, or combination)

**Implementation Steps:**
1. **Examine Existing Model**: Check current `validModel` structure in test data files
2. **Identify Column Pattern**: Determine if model uses letters (A, B, C), numbers (1, 2, 3), or mixed format
3. **Find Next Available Positions**: Locate unused columns after existing structure
4. **Add CoO Fields**: Place new CoO columns in next available positions
5. **Test Matcher Compatibility**: Ensure new structure passes through existing matcher logic

**CoO Test Data Creation Pattern:**
1. **Start with Valid Model**: Create `validCooModel` with all CoO fields correct
2. **Single Variation Approach**: Each BAC model modifies only the specific field(s) being tested
3. **Preserve Valid Context**: Keep all other fields valid for focused testing
4. **Consistent Naming**: `validCooModel`, `bac6NullCooModel`, `bac7InvalidCooModel`, etc.

**Mock Data for Prohibited Items Testing:**
- Use `'1234'` for prohibited commodity codes
- Use `'PROHIBITED_ITEM_ISO'` for prohibited country codes
- Ensures reliable, consistent testing independent of real data changes

**Step 7: Create Test Implementation**

MANDATORY NOTE (minimal rule set):
- All 14 BAC scenarios (BAC1–BAC14) MUST live in the existing single parser-service test file for the model (e.g. `test/unit/services/parser-service/asda/model3.test.js`).
- Do NOT introduce or keep a separate `*-coo.test.js` file in the final implementation.
- Each BAC scenario must have a dedicated test named with its BAC identifier; expected messages must be taken from actual system output (never assumed).

**For Each BAC Scenario:**
1. **Test Case**: Descriptive name matching BAC in `parser-service/` test file
2. **Test Data Model**: Based on `validCooModel` with single field modification
3. **Expected Result**: Must directly correspond to test data variations with exact error locations and counts
4. **Integration Testing**: Use `parserService.findParser()` to trigger full validation pipeline

**Standard Test Structure:**
```javascript
describe('<Parser> CoO Validation Tests - Type <X>', () => {
  test('Valid CoO validation - happy path', async () => {
    const result = await parserService.findParser(model.validCooModel, filename);
    expect(result).toMatchObject(test_results.validCooResult);
  });
  
  test('BAC<N>: <Description>', async () => {
    const result = await parserService.findParser(model.bac<N>Model, filename);  
    expect(result).toMatchObject(test_results.bac<N>Result);
  });
});
```
- [ ] All referenced models exported
- [ ] All tests GREEN (`npm run test:unit`)

Fail Criteria (any triggers rejection):
- Additional CoO-specific test file exists (e.g. `*-coo.test.js`)
- Missing any BAC scenario
- Placeholder text like `// TODO`, `"<populate later>"`, or generic `.toContain()` where full object is feasible
- Summarisation scenarios created with fewer than 4 faulty rows
- Manually altered error message formatting (extra trimming / normalisation)

Implementation Process For Step 7:
1. Add ALL BAC model variations with minimal delta from `validCooModel`.
2. Create initial tests with `.toContain()` or minimal assertions (exploration phase permitted locally).
3. Run tests, capture actual `failure_reasons` strings.
4. Replace exploratory assertions with full `toMatchObject` using committed fixture results.
5. Remove any temporary / exploratory test file.
6. Re-run full suite to confirm zero regressions.

Standard Test Skeleton (initial phase – may use partial expectations but MUST be upgraded before merge):
```javascript
describe('ASDA3 CoO Validation Tests - Type 1', () => {
  test('BAC1: NOT within NIRMS Scheme - passes validation', async () => {
    const r = await parserService.findParser(model.nonNirmsModel, filename);
    expect(r.business_checks.failure_reasons).toBeNull();
  });
  // ... BAC2 → BAC14 ...
});
```

Final Form (before merge) uses:
```javascript
expect(result).toMatchObject(results.bac<N>Result);
```

No merge while any BAC still relies only on loose `.toContain()` assertions.

### Phase 4: Validation & Quality Assurance

**Step 8: Test Execution & Refinement**
```bash
# Test specific CoO implementation
npm test -- test/unit/services/parser-service/<retailer>/<model>.test.js

# Check for regressions  
npm test

# Run with coverage
npm run test:unit
```

**Critical: Iterative Error Message Discovery**
1. Run tests with placeholder expected results
2. Capture actual system error messages from console
3. Update expected results with exact system output
4. Repeat until all tests pass with accurate expectations

**Troubleshooting Column Structure Issues:**
If CoO tests fail with "Failed to parse packing list...no match" errors:
1. **Check Matcher Compatibility**: Examine `app/services/matchers/<retailer>/<model>.js` 
2. **Compare Column Structure**: Verify CoO test data matches existing `validModel` format exactly
3. **Add Missing Columns**: Ensure all existing columns are preserved in CoO test data
4. **Place CoO Fields Correctly**: Add new CoO columns sequentially after existing structure
5. **Verify Column Naming**: Use consistent column identifiers (letters/numbers) matching existing pattern

**Step 9: Quality Checklist**

**Configuration Compliance:**
- [ ] Type-specific CoO validation flags added to model-headers.js
- [ ] Fields added outside regex property (not as parsing fields)
- [ ] Establishment numbers and regex patterns match specification

**Test Implementation Compliance:**
- [ ] One test per BAC acceptance criteria  
- [ ] All BAC models based on `validCooModel` variations
- [ ] **CoO test data preserves existing column structure + adds CoO fields at end**
- [ ] **CoO test data passes through existing matcher (no "no match" errors)**
- [ ] Expected results match exact test data field modifications
- [ ] Error locations reference correct row numbers from test data
- [ ] Jest mocks at top-level (not inside describe blocks)
- [ ] Mock values consistently used (`1234`, `PROHIBITED_ITEM_ISO`)
- [ ] Tests use `parserService.findParser()` (not direct parser calls)

**Integration Compliance:**
- [ ] No regressions: All existing tests pass
- [ ] Validation pipeline integration: `business_checks.failure_reasons` populated
- [ ] Error message accuracy: Results based on actual system behavior

**Success Criteria:**
1. All BAC tests pass individually and collectively
2. Happy path validation works correctly  
3. No existing functionality broken
4. Error messages match actual system output (not specification examples)
5. Clear traceability between test data variations and expected results

## Error Handling

**Test Failures:** 
- Check configuration syntax in model-headers.js
- Verify test data accuracy and BAC model variations
- **Critical**: Update expected results with actual system messages (not specification examples)
- Ensure jest mocks placed at top-level

**Missing Specifications:**
- List available `.spec/coo/AB*-implementation.md` files
- Suggest correct ticket ID format

## Summary

This optimized prompt provides a streamlined, sequential approach to CoO validation implementation:
1. **Phase 1**: Preparation (locate specs)
2. **Phase 2**: Implementation (configuration, parser updates)  
3. **Phase 3**: Testing (architecture setup, test data creation, BAC implementation)
4. **Phase 4**: Validation (execution, refinement, quality assurance)

The process eliminates repetition while maintaining all critical technical requirements and ensuring reliable, maintainable CoO validation implementations.

---

**PROMPT VERSION**: 2.0 (Optimized)  
**COMPATIBLE WITH**: Type 1-4 CoO validation patterns  
**IMPROVEMENTS**: Streamlined structure, reduced repetition, clearer process flow