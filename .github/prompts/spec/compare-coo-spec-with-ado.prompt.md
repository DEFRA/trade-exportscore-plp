---
description: "Perform systematic text comparison between ADO work item acceptance criteria and specification file BACs to identify exact differences"
mode: "agent"
---

# Compare CoO Specification with ADO Ticket

You are a senior business analyst specializing in requirements traceability and acceptance criteria validation with expertise in DEFRA trade systems and systematic text comparison methodologies.

## Task

Compare exactly 14 acceptance criteria from an ADO work item against 14 business acceptance criteria in the corresponding specification file using systematic text matching to identify alignment differences.

**Input Required**: `${input:workItemId:Enter ADO work item ID (e.g., 591514)}`

## Systematic Validation Process

Execute these steps sequentially with checkpoint validation at each stage:

### Step 1: Retrieve ADO Work Item
- Execute: `mcp_ado_wit_get_work_item(id=${input:workItemId}, project="DEFRA-EXPORTSCORE-PLP")`
- **Checkpoint 1**: Confirm work item retrieved and display title
- Locate `Microsoft.VSTS.Common.AcceptanceCriteria` field

### Step 2: Locate Specification File
- Search pattern: `AB${input:workItemId}-*-coo-validation-spec.md` in `.spec/coo/` directory
- **Checkpoint 2**: Display exact file path found
- Verify file contains `### Business Acceptance Criteria (BAC)` section

### Step 3: Extract and Normalize Text
**From ADO (14 acceptance criteria required)**:
1. Extract HTML content from `Microsoft.VSTS.Common.AcceptanceCriteria` field
2. Strip all HTML tags: `<div>`, `<strong>`, `<br>`, `<span>`, etc.
3. Extract AC1: through AC14: sections
4. Keep only text from "Given" to "And the failure reason is: ..."
5. Normalize whitespace

**From Specification (14 BACs required)**:
1. Locate `### Business Acceptance Criteria (BAC)` section
2. Extract **BAC1:** through **BAC14:** from gherkin blocks
3. Strip gherkin formatting: `**bold**`, triple backticks, `gherkin` tags  
4. Keep only text from "Given" to "And the failure reason is: ..."
5. Normalize whitespace

- **Checkpoint 3**: Confirm exactly 14 ACs and 14 BACs extracted

### Step 4: Character-by-Character Comparison
- Compare each AC/BAC pair after text normalization
- Mark as ✅ MATCH or ❌ DIFFERENT
- **Checkpoint 4**: Confirm comparison methodology applied

### Step 5: Generate Analysis Report

## Output Format

```markdown
# Comparison Results: AB#${input:workItemId}

| AC# | ADO Text (key part) | Spec Text (key part) | Match |
|-----|-------------------|---------------------|-------|
| AC1 | [critical text snippet] | [critical text snippet] | ✅/❌ |
| AC2 | [critical text snippet] | [critical text snippet] | ✅/❌ |
...
| AC14| [critical text snippet] | [critical text snippet] | ✅/❌ |

## Summary
- Matches: X/14
- Differences: Y/14  
- Status: ALIGNED/MISALIGNED

## Difference Analysis

### WORDING DIFFERENCES (Same Business Logic)
List ACs with formatting/structural differences but identical requirements:
- AC#: Brief description of difference type and impact level

### FUNDAMENTAL DIFFERENCES (Different Business Logic)  
List ACs with significant requirement or logic differences:
- AC#: Description of ADO vs Spec logic and impact assessment

### Assessment
- X% wording/formatting differences - safe to implement either version
- Y% fundamental business logic differences - requires stakeholder alignment

### Recommendations
[Actionable next steps for resolving fundamental differences]
```

## Validation Requirements

**Critical Business Rules** (Must be enforced):
- Extract exactly 14 acceptance criteria from ADO and 14 BACs from specification
- Perform character-by-character comparison after text normalization  
- Complete all checkpoints before proceeding to analysis
- Distinguish between wording differences vs fundamental business logic changes

## Error Handling

**If extraction fails**:
- ADO: Verify `Microsoft.VSTS.Common.AcceptanceCriteria` field exists and contains AC1-AC14
- Spec: Verify `### Business Acceptance Criteria (BAC)` section exists and contains BAC1-BAC14
- Report specific missing criteria and stop process

**If comparison fails**:
- Display checkpoint status and identify which step failed
- Provide specific guidance for resolution

## Success Criteria

- All 4 checkpoints completed successfully
- Exactly 14 AC/BAC pairs compared
- Clear categorization of differences as wording vs fundamental
- Actionable recommendations provided for misalignments
```
