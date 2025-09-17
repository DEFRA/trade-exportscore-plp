```prompt
---
title: "Compare CoO Specification with ADO Ticket"
description: "Exact text matching between ADO ticket and specification file"
version: "4.0"
---

# Compare CoO Specification with ADO Ticket

**Purpose**: Find exact text differences between ADO ticket acceptance criteria and specification file.

## 🚨 MANDATORY EXECUTION ENFORCEMENT 🚨

**CRITICAL**: This prompt FAILED on AB#591514 due to execution shortcuts. The following steps are NOW MANDATORY and CANNOT be skipped:

### ⚠️ ENFORCEMENT CHECKPOINTS ⚠️

**Before proceeding to Step 5, you MUST demonstrate completion of Steps 1-4 by showing:**
1. ✅ **ADO Data Retrieved** - Display work item ID and title confirmation
2. ✅ **Spec File Located** - Display exact file path found
3. ✅ **Text Extraction Complete** - Show count of ACs/BACs extracted (must be 14 each)
4. ✅ **Comparison Performed** - Show comparison methodology used

**🛑 DO NOT SKIP TO ANALYSIS - Follow sequential steps or comparison is INVALID**

## Process

### Step 1: Get ADO Data (MANDATORY)
Use: `mcp_ado_wit_get_work_item(id={ticket_id}, project="DEFRA-EXPORTSCORE-PLP")`

**CHECKPOINT 1**: Confirm ADO retrieval success before proceeding

### Step 2: Find Specification File (MANDATORY)
Pattern: AB{ticket_id}-*-coo-validation-spec.md in .spec/coo/

**CHECKPOINT 2**: Display exact file path found

### Step 3: Extract and Clean Text (MANDATORY - NO SHORTCUTS)
**ADO**: Extract acceptance criteria HTML content, strip HTML tags
**Spec**: Extract BAC sections from gherkin blocks, strip gherkin formatting

**CHECKPOINT 3**: Confirm extraction of exactly 14 ACs and 14 BACs

### Step 4: Character-by-Character Comparison (MANDATORY)
For each AC/BAC pair:
- Extract exact text from "Given" to "And the failure reason is:"
- Compare character-by-character after normalizing whitespace
- Mark as MATCH ✅ or DIFFERENT ❌
- Do NOT display the cleaned text versions during processing

**CHECKPOINT 4**: Show comparison method used for text matching

### Step 5: Output Simple Table and Analysis (ONLY AFTER CHECKPOINTS 1-4)

Generate this simple table first:

```markdown
# Comparison Results: AB#{ticket_id}

| AC# | ADO Text (key part) | Spec Text (key part) | Match |
|-----|-------------------|---------------------|-------|
| AC1 | [critical text snippet] | [critical text snippet] | ✅/❌ |
| AC2 | [critical text snippet] | [critical text snippet] | ✅/❌ |
...
| AC10| [critical text snippet] | [critical text snippet] | ✅/❌ |

## Summary
- Matches: X/14
- Differences: Y/14  
- Status: MATCH/DIFFERENT

## Analysis of Differences: Wording vs Fundamental

### WORDING DIFFERENCES ONLY (Same Business Logic)
List ACs that are primarily wording/structural differences with same underlying requirements:
- AC#: Brief description of difference type and impact level

### FUNDAMENTALLY DIFFERENT (Different Business Logic)  
List ACs that represent significant architectural/functional differences:
- AC#: Description of ADO logic vs Spec logic and HIGH impact level

### Critical Assessment
Provide percentage breakdown:
- X% wording/formatting differences - safe to implement either version
- Y% fundamental business logic differences - requires alignment decision

### Recommendation
Suggest next steps for any fundamental differences that need stakeholder clarification.
```

## 🚨 MANDATORY Text Extraction Rules (NO EXCEPTIONS) 🚨

**From ADO** (MUST be performed systematically):
1. Find `Microsoft.VSTS.Common.AcceptanceCriteria` field in ADO response
2. Strip all HTML tags: `<div>`, `<strong>`, `<br>`, `<span>`, etc.
3. Extract each AC from pattern: `AC1:` through `AC14:` (exactly 14 required)
4. Keep only text from "Given" to final "And the failure reason is: ..."
5. **VALIDATION**: Confirm 14 ACs extracted or STOP process

**From Spec** (MUST be performed systematically):
1. Find `### Business Acceptance Criteria (BAC)` section in specification file
2. Extract each BAC from gherkin blocks: `**BAC1:` through `**BAC14:`
3. Strip gherkin formatting: `**bold**`, triple backticks, `gherkin` tags
4. Keep only text from "Given" to final "And the failure reason is: ..."
5. **VALIDATION**: Confirm 14 BACs extracted or STOP process

## 🔒 ENFORCED Processing Steps (CANNOT BE BYPASSED)

### STEP 1 - ADO Data Retrieval
- **Execute**: `mcp_ado_wit_get_work_item(id={ticket_id}, project="DEFRA-EXPORTSCORE-PLP")`
- **Prove**: Show work item title and ID confirmation
- **Validate**: Confirm `Microsoft.VSTS.Common.AcceptanceCriteria` field exists

### STEP 2 - Specification File Location  
- **Execute**: Search for `AB{ticket_id}-*-coo-validation-spec.md` in `.spec/coo/`
- **Prove**: Display exact file path found
- **Validate**: Confirm file contains `### Business Acceptance Criteria (BAC)` section

### STEP 3 - Systematic Text Extraction
- **Execute**: Extract all 14 ACs from ADO HTML using rules above
- **Execute**: Extract all 14 BACs from spec gherkin using rules above  
- **Prove**: Show count "14 ACs extracted" and "14 BACs extracted"
- **Validate**: Must have exactly 14 of each or process FAILS

### STEP 4 - Character-by-Character Comparison
- **Execute**: Compare each AC/BAC pair using text normalization
- **Prove**: Show comparison method: "Character comparison after HTML/gherkin stripping"
- **Validate**: Mark each pair as ✅ MATCH or ❌ DIFFERENT

### STEP 5 - Results Output (ONLY after Steps 1-4 proven)
- **Generate**: Simple table showing exact differences
- **Analyze**: Distinguish wording vs fundamental differences
- **Report**: Provide actionable recommendations

## 🛑 FAILURE PREVENTION MECHANISMS

**If you find yourself:**
- Making assumptions about alignment → STOP, extract text first
- Performing conceptual analysis → STOP, do character comparison  
- Skipping to conclusions → STOP, show all checkpoints
- Assuming "it looks right" → STOP, prove with systematic comparison

**Process INVALID unless all checkpoints demonstrated**

## Example Usage - ENFORCED FORMAT

### Input: 591514
**CHECKPOINT 1**: ✅ ADO Data Retrieved - Work item "ASDA 3 - Country of Origin Validation" found
**CHECKPOINT 2**: ✅ Spec File Located - `/home/david/.spec/coo/AB591514-asda3-coo-validation-spec.md` 
**CHECKPOINT 3**: ✅ Text Extraction Complete - 14 ACs extracted, 14 BACs extracted
**CHECKPOINT 4**: ✅ Comparison Performed - Character-by-character comparison after HTML/gherkin stripping

### Output: 
Simple table with ❌ for AC11/AC12 showing "Then fail" vs "Then pass" differences

## 🎯 CRITICAL SUCCESS FACTORS

### What FAILED on AB#591514:
- ❌ Skipped systematic text extraction 
- ❌ Made conceptual assumptions
- ❌ No character-by-character comparison
- ❌ Missed critical "Then" statement differences

### What this ENFORCED prompt prevents:
- ✅ Mandatory checkpoint demonstrations
- ✅ No shortcuts allowed to analysis
- ✅ Systematic text extraction required
- ✅ Character comparison enforced

**Focus**: Bulletproof execution through mandatory checkpoints and validation steps.
```
