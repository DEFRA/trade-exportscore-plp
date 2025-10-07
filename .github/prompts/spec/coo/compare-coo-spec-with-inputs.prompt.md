---
description: "Perform systematic text comparison between direct input acceptance criteria and specification file BACs to identify exact differences"
mode: "agent"
tools: ['extensions', 'todos', 'runTests', 'codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'runCommands', 'runTasks', 'editFiles', 'runNotebooks', 'search', 'new']
---

# Compare CoO Specification with Direct Inputs

You are a senior business analyst specializing in requirements traceability and acceptance criteria validation with expertise in DEFRA trade systems and systematic text comparison methodologies.

## Task

Compare all acceptance criteria from direct input against all business acceptance criteria in the corresponding specification file using systematic text matching to identify alignment differences. Handle any number of criteria and provide detailed mismatch analysis when counts differ.

**Inputs Required**: 
- `${input:ticketNumber:Enter ticket number (e.g., AB591514)}`
- `${input:traderName:Enter trader name (e.g., ASDA, B&M, Giovanni)}`
- `${input:description:Enter the complete business description including specifications and column mappings}`
- `${input:acceptanceCriteria:Enter the complete acceptance criteria containing all ACs}`

## Systematic Validation Process

Execute these steps sequentially with checkpoint validation at each stage:

### Step 1: Parse Input Acceptance Criteria
- Extract all acceptance criteria from the provided acceptance criteria input
- **Checkpoint 1**: Confirm acceptance criteria parsed and display count
- Locate sections matching pattern `AC\d+:` or similar acceptance criteria patterns

### Step 2: Locate Specification File
- Search pattern: `{ticketNumber}-*-coo-validation-spec.md` in `.spec/coo/` directory
- **Checkpoint 2**: Display exact file path found
- Verify file contains `### Business Acceptance Criteria (BAC)` section

### Step 3: Extract and Normalize Text
**From Input (extract all acceptance criteria)**:
1. Extract text content from acceptance criteria input
2. Strip any HTML tags if present: `<div>`, `<strong>`, `<br>`, `<span>`, etc.
3. Extract all AC sections matching pattern `AC\d+:` or similar patterns
4. Keep only text from "Given" to "And the failure reason is: ..."
5. Normalize whitespace
6. Count total number of ACs found

**From Specification (extract all BACs)**:
1. Locate `### Business Acceptance Criteria (BAC)` section
2. Extract all BAC sections matching pattern `BAC\d+:` from gherkin blocks
3. Strip gherkin formatting: `**bold**`, triple backticks, `gherkin` tags  
4. Keep only text from "Given" to "And the failure reason is: ..."
5. Normalize whitespace
6. Count total number of BACs found

- **Checkpoint 3**: Display counts found (AcceptanceCriteria: X ACs, Spec: Y BACs) and proceed to alignment analysis

### Step 4: Alignment Analysis and Comparison
**If counts match (Acceptance Criteria ACs = Spec BACs)**:
- Compare each AC/BAC pair after text normalization
- Mark as ✅ MATCH or ❌ DIFFERENT
- Proceed to standard comparison analysis

**If counts differ (Acceptance Criteria ACs ≠ Spec BACs)**:
- Identify which criteria exist in Acceptance Criteria Input but not in Spec
- Identify which criteria exist in Spec but not in Acceptance Criteria Input  
- For criteria that exist in both, perform text comparison
- Generate comprehensive mismatch analysis

- **Checkpoint 4**: Confirm alignment analysis methodology applied

### Step 5: Generate Analysis Report

## Output Format

```markdown
# Comparison Results: {ticketNumber} - {traderName}

## Criteria Count Analysis
- **Acceptance Criteria Input**: X acceptance criteria (AC1-ACX)
- **Specification**: Y business acceptance criteria (BAC1-BACY)  
- **Count Match**: ✅ ALIGNED / ❌ MISALIGNED (X vs Y)

## Alignment Analysis

### Criteria Present in Both Acceptance Criteria Input and Spec
| AC# | AcceptanceCriteria Text (key part) | Spec Text (key part) | Match |
|-----|-------------------|---------------------|-------|
| AC1/BAC1 | [critical text snippet] | [critical text snippet] | ✅/❌ |
| AC2/BAC2 | [critical text snippet] | [critical text snippet] | ✅/❌ |
... [for all matching numbered pairs]

### Criteria Only in Acceptance Criteria Input (Missing from Spec)
- **AC#**: [Brief description of AcceptanceCriteria-only criterion]
... [list all Acceptance Criteria input criteria without corresponding BAC]

### Criteria Only in Spec (Missing from Acceptance Criteria Input)  
- **BAC#**: [Brief description of Spec-only criterion]
... [list all Spec criteria without corresponding AC]

## Summary
- **Criteria Counts**: AcceptanceCriteria=X, Spec=Y  
- **Perfect Matches**: Z criteria
- **Text Differences**: W criteria (same logic, different wording)
- **Logic Differences**: V criteria (different business requirements)
- **AcceptanceCriteria-Only Criteria**: U criteria
- **Spec-Only Criteria**: T criteria
- **Overall Status**: FULLY_ALIGNED / PARTIALLY_ALIGNED / MISALIGNED

## Difference Analysis

### WORDING DIFFERENCES (Same Business Logic)
List ACs with formatting/structural differences but identical requirements:
- AC#/BAC#: Brief description of difference type and impact level

### FUNDAMENTAL DIFFERENCES (Different Business Logic)  
List ACs with significant requirement or logic differences:
- AC#/BAC#: Description of Input vs Spec logic and impact assessment

### MISSING CRITERIA IMPACT
**AcceptanceCriteria-Only Criteria (not in Spec)**:
- Impact: Requirements defined in acceptance criteria input but not documented in specification
- Risk: Implementation may not match specification expectations

**Spec-Only Criteria (not in AcceptanceCriteria)**:
- Impact: Specification requirements not reflected in acceptance criteria input  
- Risk: Implementation may include unexpected validation not tracked in source

### Assessment
- X% perfect matches - no action required
- Y% wording/formatting differences - safe to implement either version  
- Z% fundamental business logic differences - requires stakeholder alignment
- W% missing criteria - requires criteria synchronization

### Recommendations
**Immediate Actions**:
[Actionable next steps for resolving fundamental differences and missing criteria]

**Stakeholder Alignment Required**:
[Areas requiring business stakeholder input and decisions]
```

## Validation Requirements

**Critical Business Rules** (Must be enforced):
- Extract all acceptance criteria from acceptance criteria input and all BACs from specification (flexible count)
- Use description input for context about specifications and column mappings
- Handle count mismatches gracefully with detailed analysis
- Perform character-by-character comparison after text normalization for matching criteria
- Complete all checkpoints before proceeding to analysis
- Distinguish between wording differences vs fundamental business logic changes
- Identify and analyze missing criteria in both directions (AcceptanceCriteria→Spec, Spec→AcceptanceCriteria)

## Error Handling

**If extraction fails**:
- Acceptance Criteria Input: Verify acceptance criteria input contains at least one recognizable AC pattern
- Description Input: Contains specifications and column mappings (used for context but not direct comparison)
- Spec: Verify `### Business Acceptance Criteria (BAC)` section exists and contains at least one BAC
- Report extraction status showing what was found vs what was expected
- Continue with available criteria if at least one is found in each source

**If no criteria found**:
- Report complete extraction failure and stop process
- Provide specific guidance for locating criteria in each source

**If comparison fails**:
- Display checkpoint status and identify which step failed
- Provide specific guidance for resolution

## Acceptance Criteria Pattern Recognition

**Common Input Patterns to Recognize**:
```
AC1: [Description]
Given [conditions]
When [action]
Then [expected result]
And the failure reason is: "[message]"

Acceptance Criteria 1: [Description]
[Gherkin format criteria]

AC 1 - [Title]
[Criteria content]
```

**Flexible Pattern Matching**:
- Support various numbering formats (AC1, AC 1, Acceptance Criteria 1, etc.)
- Handle different section separators and formatting
- Extract core business logic regardless of presentation format
- Normalize different failure reason formats

## File Location Strategy

**Specification File Search**:
1. **Primary Pattern**: `{ticketNumber}-{trader}-coo-validation-spec.md`
2. **Fallback Pattern**: `{ticketNumber}-*-coo-validation-spec.md` 
3. **Manual Search**: Search `.spec/coo/` directory for files containing `{ticketNumber}`
4. **Error Handling**: If multiple files found, list all and request clarification

**Directory Structure**:
```
.spec/coo/
├── AB591514-asda3-coo-validation-spec.md
├── AB591516-bandm-coo-validation-spec.md
├── AB591532-kepak-coo-validation-spec.md
└── [other specification files]
```

## Text Normalization Rules

**Input Text Cleaning**:
1. Remove HTML tags and formatting
2. Normalize line breaks and spacing
3. Standardize quotation marks
4. Remove extra whitespace
5. Convert to consistent case for comparison

**Specification Text Cleaning**:
1. Remove Markdown formatting (`**bold**`, backticks, etc.)
2. Strip gherkin code block markers
3. Extract only core business logic text
4. Normalize spacing and punctuation
5. Standardize failure reason format

**Comparison Logic**:
- Character-by-character comparison after normalization
- Ignore minor formatting differences
- Focus on business logic content
- Flag significant wording changes that might affect interpretation

## Success Criteria

- All 4 checkpoints completed successfully
- All available AC/BAC criteria extracted and analyzed (flexible count)
- Count mismatch analysis provided when Input and Spec counts differ
- Clear categorization of differences as wording vs fundamental vs missing
- Missing criteria identified in both directions (AcceptanceCriteria-only and Spec-only)
- Actionable recommendations provided for all types of misalignments
- Comprehensive impact assessment for missing criteria

## Quality Assurance

**Validation Checkpoints**:
1. ✅ Input acceptance criteria successfully parsed
2. ✅ Specification file located and BACs extracted
3. ✅ Text normalization applied consistently
4. ✅ Alignment analysis completed with proper categorization

**Output Quality Requirements**:
- Precise counts for all criteria categories
- Clear identification of exact text differences
- Specific recommendations for each type of mismatch
- Impact assessment for missing criteria
- Overall alignment status with confidence level

**Error Prevention**:
- Validate input format before processing
- Confirm specification file exists and is readable
- Verify text extraction produces meaningful results
- Check that comparison logic handles edge cases appropriately

