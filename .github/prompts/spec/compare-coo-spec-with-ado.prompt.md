```prompt
---
title: "Compare CoO Specification with ADO Ticket"
description: "Exact text matching between ADO ticket and specification file"
version: "3.0"
---

# Compare CoO Specification with ADO Ticket

**Purpose**: Find exact text differences between ADO ticket acceptance criteria and specification file.

## Process

### Step 1: Get ADO Data
Use: `mcp_ado_wit_get_work_item(id={ticket_id}, project="DEFRA-EXPORTSCORE-PLP")`

### Step 2: Find Specification File  
Pattern: AB{ticket_id}-*-coo-validation-spec.md in .spec/coo/

### Step 3: Extract and Clean Text
**ADO**: Extract acceptance criteria HTML content, strip HTML tags
**Spec**: Extract BAC sections from gherkin blocks, strip gherkin formatting

### Step 4: Character-by-Character Comparison
For each AC/BAC pair:
- Extract exact text from "Given" to "And the failure reason is:"
- Compare character-by-character after normalizing whitespace
- Mark as MATCH ✅ or DIFFERENT ❌

### Step 5: Output Simple Table

Generate this simple table only:

```markdown
# Comparison Results: AB#{ticket_id}

| AC# | ADO Text (key part) | Spec Text (key part) | Match |
|-----|-------------------|---------------------|-------|
| AC1 | [critical text snippet] | [critical text snippet] | ✅/❌ |
| AC2 | [critical text snippet] | [critical text snippet] | ✅/❌ |
...
| AC10| [critical text snippet] | [critical text snippet] | ✅/❌ |

## Summary
- Matches: X/10
- Differences: Y/10  
- Status: MATCH/DIFFERENT
```

## Text Extraction Rules

**From ADO**:
1. Find `Microsoft.VSTS.Common.AcceptanceCriteria` field
2. Strip all HTML tags: `<div>`, `<strong>`, `<br>`, etc.
3. Extract each AC from pattern: `AC1:` through `AC10:`
4. Keep only text from "Given" to final "And the failure reason is: ..."

**From Spec**:  
1. Find `### Business Acceptance Criteria (BAC)` section
2. Extract each BAC from gherkin blocks: `**BAC1:` through `**BAC10:`
3. Strip gherkin formatting: `**bold**`, triple backticks
4. Keep only text from "Given" to final "And the failure reason is: ..."

## Processing Steps

1. **Load ADO data**: Use MCP ADO tool with ticket ID
2. **Find spec file**: Search pattern `AB{ticket_id}-*-coo-validation-spec.md` in `.spec/coo/`
3. **Extract AC1-AC10** from both sources using rules above
4. **Compare each pair** character-by-character after whitespace normalization
5. **Output simple table** showing exact differences

## Example Usage

```
Input: 591527
Expected: Find difference in AC10 "more than 3 items" vs "an item"
Output: Simple table with ❌ for AC10, showing exact differing text
```

**Focus**: Exact text matching only. No analysis, no recommendations.
```
