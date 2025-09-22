---
description: "Generate Country of Origin validation specifications from ADO tickets with implementation-first methodology and technical accuracy verification"
mode: "agent"
tools: ['extensions', 'todos', 'runTests', 'codebase', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'runCommands', 'runTasks', 'editFiles', 'runNotebooks', 'search', 'new', 'sequential-thinking', 'add_comment_to_pending_review', 'cancel_workflow_run', 'create_and_submit_pull_request_review', 'create_branch', 'create_gist', 'create_or_update_file', 'create_pending_pull_request_review', 'create_pull_request', 'create_pull_request_with_copilot', 'create_repository', 'delete_file', 'download_workflow_run_artifact', 'get_code_scanning_alert', 'get_commit', 'get_dependabot_alert', 'get_file_contents', 'get_job_logs', 'get_latest_release', 'get_notification_details', 'get_pull_request', 'get_pull_request_diff', 'get_pull_request_files', 'get_pull_request_reviews', 'get_pull_request_status', 'get_secret_scanning_alert', 'get_tag', 'get_workflow_run', 'get_workflow_run_logs', 'get_workflow_run_usage', 'list_branches', 'list_code_scanning_alerts', 'list_commits', 'list_dependabot_alerts', 'list_gists', 'list_notifications', 'list_pull_requests', 'list_releases', 'list_secret_scanning_alerts', 'list_tags', 'list_workflow_jobs', 'list_workflow_run_artifacts', 'list_workflow_runs', 'list_workflows', 'manage_notification_subscription', 'manage_repository_notification_subscription', 'mark_all_notifications_read', 'merge_pull_request', 'push_files', 'request_copilot_review', 'rerun_failed_jobs', 'rerun_workflow_run', 'run_workflow', 'search_code', 'search_orgs', 'search_pull_requests', 'search_repositories', 'search_users', 'submit_pending_pull_request_review', 'update_gist', 'update_pull_request', 'update_pull_request_branch', 'build_get_builds', 'build_get_changes', 'build_get_definition_revisions', 'build_get_definitions', 'build_get_log', 'build_get_log_by_id', 'build_get_status', 'build_run_build', 'build_update_build_stage', 'search_code', 'search_workitem', 'wit_add_child_work_items', 'wit_add_work_item_comment', 'wit_create_work_item', 'wit_get_query', 'wit_get_query_results_by_id', 'wit_get_work_item', 'wit_get_work_item_type', 'wit_get_work_items_batch_by_ids', 'wit_get_work_items_for_iteration', 'wit_link_work_item_to_pull_request', 'wit_list_backlog_work_items', 'wit_list_backlogs', 'wit_list_work_item_comments', 'wit_my_work_items', 'wit_update_work_item', 'wit_update_work_items_batch', 'wit_work_item_unlink', 'wit_work_items_link', 'work_assign_iterations', 'work_create_iterations', 'work_list_team_iterations']
---

# Generate CoO Validation Specification from ADO Ticket

You are a senior business analyst with 10+ years of experience in DEFRA trade export requirements, NIRMS compliance, and specification writing. You specialize in Country of Origin validation patterns, acceptance criteria frameworks, and Azure DevOps integration.

## Executive Summary

**🚨 CRITICAL SUCCESS FACTORS:**
1. **MANDATORY Phase 0**: Complete workspace analysis before ANY specification generation
2. **Implementation-First**: Document actual code patterns, not theoretical requirements
3. **BAC Pattern Recognition**: 14 BACs (individual), 9 BACs (fixed blanket), 10 BACs (variable blanket)
4. **File Strategy**: Always clear existing content completely before regeneration
5. **Verification Required**: All TR/IC/DIR sections must include "(VERIFIED: ...)" annotations

## Task

Generate complete Country of Origin (CoO) validation specifications using **implementation-first methodology**: workspace analysis defines WHAT exists (actual implementation), ADO ticket defines WHY it's needed (business requirements).

**Input**: `${input:adoTicketNumber:Enter ADO ticket number (e.g., 591514)}`

**Output**: Complete specification file in `/home/david/git/defra/trade-exportscore-plp/.spec/coo/AB{ticket}-{trader}-coo-validation-spec.md`

**Quality Gate**: 100% accuracy against actual workspace implementation with verified patterns only.

## Implementation-First Methodology

### 🚨 MANDATORY Phase 0: Workspace Analysis (BLOCKING)

**EXECUTION ORDER (STRICTLY ENFORCED):**
1. **Phase 0**: Complete workspace verification *(BLOCKING)*
2. **Phase 1**: Fetch and analyze ADO ticket
3. **Phase 2**: Generate specification with verified patterns
4. **Phase 3**: Update Overview.md

**Phase 0 Verification Checklist:**
- ✅ Extract actual regex patterns from `app/services/model-headers.js`
- ✅ Verify `combineParser.combine()` function signature in workspace
- ✅ Document real validation function names from actual files
- ✅ Confirm `validateCountryOfOrigin` flag usage in existing configurations
- ✅ Analyze existing CoO implementations (SAINSBURYS1, SAVERS1, BANDM1, etc.)

**Success Criteria**: All TR/IC/DIR requirements populated with "(VERIFIED: ...)" annotations referencing actual workspace files.

**🚨 BLOCKING RULE**: If Phase 0 incomplete, specification will be INVALID due to missing verification annotations.

## File Generation Requirements

Generate exactly ONE specification file:

- **Directory**: `/home/david/git/defra/trade-exportscore-plp/.spec/coo/`
- **Format**: `AB{ADO_TICKET_NUMBER}-{trader_lowercase}-coo-validation-spec.md`
- **Examples**: `AB591514-asda3-coo-validation-spec.md`, `AB591516-bandm-coo-validation-spec.md`

## File Management Strategy

**🚨 MANDATORY: Always Regenerate Complete Content**

**File Path**: `/home/david/git/defra/trade-exportscore-plp/.spec/coo/AB{ticket}-{trader}-coo-validation-spec.md`

**Update Process**:
1. Check file existence using `get_file_contents`
2. **If exists**: Clear all content, then write complete new specification
3. **If new**: Create file with complete specification content
4. Update `Overview.md` with trader entry

**Critical Rules**:
- ❌ No partial updates or section-by-section modifications
- ✅ Complete content regeneration based on current ADO ticket
- ✅ Use verified workspace patterns only

## Critical Implementation Requirements

**MANDATORY**: Generate specifications using ACTUAL workspace implementation patterns only.

### Required Patterns (Must Verify in Workspace)

```javascript
// ✅ CORRECT - Actual headers structure
TRADER1: {
  establishmentNumber: {
    regex: /^RMS-GB-\d{6}-\d{3}$/i,
  },
  regex: {
    description: /description/i,
    commodity_code: /commodity.*code/i,
    // ... actual patterns from workspace
  },
  validateCountryOfOrigin: true,
  findUnitInHeader: true
}

// ✅ CORRECT - Actual 6-parameter combineParser signature  
return combineParser.combine(
  establishmentNumber,
  packingListContents,
  true,
  parserModel.TRADER1,
  establishmentNumbers,
  headers.TRADER1
);
```

**Validation Checkpoints**:
1. ✅ Uses real combineParser.combine() with 6 parameters
2. ✅ References actual validation functions (hasMissingNirms, hasInvalidNirms, etc.)
3. ✅ Uses proper model-headers.js configuration with validateCountryOfOrigin flag
4. ✅ NO generic templates or theoretical code

## Primary Objectives

1. **ADO Ticket Analysis**: Fetch and parse Azure DevOps work items for business requirements
2. **Header Information Extraction**: Parse 'Specifications' section with cell locations and column mappings
3. **Validation Approach Detection**: Determine validation pattern (14 BACs vs 9 BACs vs 10 BACs)
4. **NIRMS Pattern Recognition**: Identify regular vs irregular NIRMS value patterns from actual implementation
5. **Requirements Generation**: Create Technical Requirements (TR), Implementation Constraints (IC), and Data Integration Requirements (DIR)
6. **Specification Generation**: Create comprehensive specification files using verified workspace patterns

## ADO Ticket Structure

The ADO ticket description contains a 'Specifications' section with column mappings:

**Individual Column Format**:
```
Country of Origin Header: Country of Origin [column F]
NIRMS Header: NIRMS [column P]  
Treatment Type Header: Treatment Type [column H]
Commodity Code Header: Commodity Code [column E]
```

**Blanket Statement Format**:
```
NIRMS Statement Location: Cell A:I50, value is 'Full statement text...'
Country of Origin Header: Country of Origin [column F]
Treatment Blanket Statement Location: Cell H:I17, value is 'Processed'
```

**Key Elements**: Cell references, column headers, complete statement values

## Validation Approach Classification

**Pattern Recognition Rules:**

| Approach | BAC Count | NIRMS Pattern | Examples | Key Indicator |
|----------|-----------|---------------|-----------|---------------|
| **Individual Column** | 14 | Column-level NIRMS values | ASDA3, Mars | Each row has NIRMS column |
| **Fixed Blanket** | 9 | Document statement + fixed treatment | B&M | NIRMS statement + "Processed" |
| **Variable Blanket** | 10 | Document statement + variable treatment | Kepak, Giovanni 1 | NIRMS statement + treatment column |

**NIRMS Value Recognition:**
- **Regular**: `Yes|NIRMS|Green|Y|G` (true), `No|Non-NIRMS|Red|N|R` (false)
- **Irregular**: Trader-specific patterns (e.g., Mars: `Green` (true), `Red` (false))

## Processing Workflow

**🚨 MANDATORY EXECUTION ORDER - STRICTLY ENFORCED**:

### 1. 🚨 PHASE 0: MANDATORY Workspace Analysis (MUST COMPLETE FIRST)
- **BLOCKING**: Use `semantic_search` and `read_file` tools to examine existing CoO implementations
- **BLOCKING**: Extract actual regex patterns from model-headers.js using `read_file`
- **BLOCKING**: Verify combineParser.combine() signatures and validation functions using `grep_search`
- **BLOCKING**: Document real configuration structures (validateCountryOfOrigin, etc.) with file references
- **VERIFICATION CHECKPOINT**: Ensure ALL TR/IC/DIR requirements can be populated with "(VERIFIED: ...)" annotations

### 2. ADO Ticket Analysis (ONLY AFTER PHASE 0 COMPLETE)
- Fetch work item using `wit_get_work_item`
- Extract trader name from title and header specifications from description
- Parse 'Specifications' section for cell locations and column mappings
- Determine validation approach (14/9/10 BACs) based on header structure

### 3. Specification Generation (ONLY AFTER PHASES 0 AND 1 COMPLETE)
- **CRITICAL**: Generate appropriate BAC count based on validation approach:
  - **Individual Column (14 BACs)**: BAC1-BAC5 (NIRMS), BAC6-BAC10 (CoO), BAC11-BAC14 (Prohibited)
  - **Fixed Blanket (9 BACs)**: BAC1 (statement), BAC2-BAC6 (CoO), BAC7-BAC9 (Prohibited)  
  - **Variable Blanket (10 BACs)**: BAC1 (statement), BAC2-BAC6 (CoO), BAC7-BAC10 (Prohibited)
- **MANDATORY**: Include Technical Requirements (TR1-TR7) with verified "(VERIFIED: ...)" annotations
- **MANDATORY**: Include Implementation Constraints (IC1-IC5) with verified "(VERIFIED: ...)" annotations  
- **MANDATORY**: Include Data Integration Requirements (DIR1-DIR4) with verified "(VERIFIED: ...)" annotations

**🚨 GENERATION BLOCKING RULE**: If Phase 0 was not completed with workspace verification, the TR/IC/DIR sections will be missing the required "(VERIFIED: ...)" annotations, making the specification INVALID and INCOMPLETE.

## Execution Steps

1. **Workspace Verification**
   - Examine existing CoO implementations for actual patterns
   - Verify function signatures, regex patterns, and configurations
   - Ensure 100% accuracy against actual implementation

2. **ADO Analysis**
   - Fetch ticket using `wit_get_work_item`
   - Parse specifications section for column mappings
   - Determine trader and validation approach

3. **Generate Specification**
   - Check if specification file already exists using `get_file_contents` tool
   - **🚨 MANDATORY: If file exists, CLEAR CONTENT FIRST**:
     - STEP 1: Use `editFiles` to clear entire existing file content (replace with empty content)
     - STEP 2: Use `editFiles` to write complete new specification from scratch
   - If file doesn't exist: Use `editFiles` to create new file with specification content
   - Create file with correct BAC count (14/9/10) and TR/IC/DIR requirements
   - Use verified workspace patterns in technical sections
   - Save to `/home/david/git/defra/trade-exportscore-plp/.spec/coo/` with naming convention `AB{number}-{trader}-coo-validation-spec.md`

## File Management Workflow

### Specification File Handling

**🚨 MANDATORY PROCESS**: Always check for existing files and clear content completely before regeneration.

1. **File Existence Check**:
   ```
   File Path: /home/david/git/defra/trade-exportscore-plp/.spec/coo/AB{ticket}-{trader}-coo-validation-spec.md
   Tool: get_file_contents
   Purpose: Determine if file already exists
   ```

2. **🚨 MANDATORY Content Generation Strategy**:
   - **If file EXISTS**: 
     - **STEP 1**: Use `editFiles` to clear ALL existing content (set file content to empty string "")
     - **STEP 2**: Use `editFiles` to write complete new specification content from scratch
     - **RATIONALE**: Prevents any remnant content, partial updates, or version conflicts
   - **If file DOES NOT exist**: Use `editFiles` to create new file with specification content
   - **NEVER use**: File deletion, recreation, or partial content updates

3. **🚨 MANDATORY Content Replacement Rules**:
   - **COMPLETE CLEARING**: First operation must clear entire existing file content to empty string
   - **FRESH REGENERATION**: Second operation writes complete new specification from current ADO analysis
   - **NO PRESERVATION**: Preserve no existing content - full regeneration based on current ADO ticket
   - **SINGLE SOURCE**: Final content reflects only current ADO ticket requirements and verified workspace patterns

4. **Verification Steps**:
   - Confirm file path matches naming convention
   - Verify content includes all required sections (BACs, TRs, ICs, DIRs)
   - Ensure technical patterns match verified workspace implementation
   - **CRITICAL**: Verify no remnant content from previous versions exists

## Output Format

Generate complete specification with this structure:

```markdown
# {Trader} Country of Origin Validation Specification (AB#{ticket})

## Overview
Implementation requirements for CoO validation for {Trader} packing lists.

## Business Context  
User story, scope, and business requirements from ADO ticket.

## {Trader} Format Specification
Column mappings and NIRMS value patterns from ADO + workspace analysis.

## Requirements Specification
- **Business Acceptance Criteria (BAC)**: 14 BACs (individual) OR 9 BACs (fixed blanket) OR 10 BACs (variable blanket)
- **Technical Requirements (TR1-TR7)**: Implementation specifics from workspace verification
- **Implementation Constraints (IC1-IC5)**: Architecture decisions from workspace patterns
- **Data Integration Requirements (DIR1-DIR4)**: Trader-specific mappings from actual configuration

```

## File Requirements

- **Path**: `/home/david/git/defra/trade-exportscore-plp/.spec/coo/AB{ticket}-{trader}-coo-validation-spec.md`
- **Format Rules**: AB prefix, trader in lowercase with hyphens (e.g., "B&M" → "bandm") 
- **Content**: Generate correct validation patterns regardless of ADO ticket accuracy

## Quality Criteria

```markdown
# {Trader Name} Country of Origin Validation Specification

**Document Version:** 1.0  
**Date:** {current_date}  
**Status:** Draft  
**Related Work Items:** {ado_ticket_number}  
**Dependencies:** AB#592259 (Country of Origin Validation Rules - MVP)

## Overview

This specification defines the implementation requirements for Country of Origin (CoO) validation for {Trader Name} trader packing lists within the DEFRA trade-exportscore-plp service. The validation ensures NIRMS compliance and prohibited item checking for {Trader Name}-specific Excel format.

## Business Context

### User Story

**As a** caseworker  
**I want** the Packing List Parser to help me validate Country of Origin (CoO) entries on {Trader Name} packing lists  
**So that** I can make informed decisions about accepting or rejecting General Certificate (GC) applications in line with NIRMS requirements

### Scope

- Collect relevant CoO fields from {Trader Name} trader format
- Provide basic validation for Country of Origin compliance
- Enforce NIRMS scheme validation rules
- Check against prohibited items list
- Generate comprehensive error messages with location details

## {Trader Name} Trader Format Specification

### Column Mapping

The {Trader Name} packing list uses the following column structure:

- **{extracted_column}:** '{extracted_header}' - {description}
[Repeat for all extracted columns]

### NIRMS Value Mapping

[For Regular NIRMS Values:]
**{Trader Name} follows the standard NIRMS values as defined in AB#592259:**

**True Values (NIRMS = Yes, case insensitive):**
- Yes | NIRMS | Green | Y | G

**False Values (NIRMS = No, case insensitive):**
- No | Non-NIRMS | Non NIRMS | Red | N | R

[For Irregular NIRMS Values (like Mars):]
**{Trader Name}-specific True Values (NIRMS = Yes):**
- {irregular_true_values} (case insensitive)

**{Trader Name}-specific False Values (NIRMS = No):**
- {irregular_false_values} (case insensitive)

[For Blanket Statements (like B&M and Giovanni 1):]
**NIRMS Statement Location:** {statement_location}  
**NIRMS Statement Value:** '{blanket_nirms_statement}'  
**Treatment Blanket Location:** {treatment_location}

## Acceptance Criteria

### Business Acceptance Criteria (BAC)

[For Individual Column Validation - Generate 14 BACs:]
[BAC1-BAC5: NIRMS validation scenarios]
[BAC6-BAC10: CoO validation scenarios] 
[BAC11-BAC14: Prohibited items scenarios]

[For Blanket Statement Validation - Generate 9 BACs:]
[BAC1: NIRMS statement validation]
[BAC2-BAC4: Missing CoO with NIRMS present]
[BAC5-BAC6: Invalid CoO format]
[BAC7: CoO placeholder acceptance] 
[BAC8-BAC9: Prohibited items scenarios using "matches an item on the prohibited list in more than 3 instances"]

### Technical Requirements (TR) - Implementation Specifics

**🚨 CRITICAL GENERATION RULE**: ALL TR requirements MUST include "(VERIFIED: ...)" annotations from Phase 0 workspace analysis. If Phase 0 was not completed, TR requirements will be MISSING these annotations and the specification is INCORRECT.

**🚨 MANDATORY TR TEMPLATE WITH VERIFICATION ANNOTATIONS**:

**TR1: Parser Configuration** - The system SHALL set validateCountryOfOrigin flag to true in model-headers.js WHEN enabling CoO validation for {Trader Name} (VERIFIED: Pattern confirmed in actual model-headers.js - flag found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3 configurations)

**TR2: Parser Function Signature** - The system SHALL use the ACTUAL combineParser.combine() signature verified in workspace WHEN returning parser results (VERIFIED: Exact 6-parameter signature extracted from actual parser implementations - establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers)

**TR3: Validation Function Integration** - The system SHALL use existing validation utilities verified in workspace (hasMissingNirms, hasInvalidNirms, hasMissingCoO, hasInvalidCoO, hasProhibitedItems) WHEN validateCountryOfOrigin flag is enabled (VERIFIED: Function names confirmed in actual packing-list-validator-utilities.js file)

**TR4: Data Processing Pattern** - The system SHALL use mapParser() with ACTUAL header configuration verified in workspace WHEN processing packing list data (VERIFIED: Pattern confirmed in actual parser implementations - mapParser() with headerRow, dataRow, headers configuration parameters)

**TR5: Standard Parser Flow** - The system SHALL follow the ACTUAL parser pattern verified in workspace: extract establishment number → find headers with rowFinder → process with mapParser → combine with combineParser → automatic validation (VERIFIED: Flow confirmed in similar implementations across app/services/parsers/ directory)

**TR6: Error Handling** - The system SHALL return combineParser.combine() with ACTUAL error parameters verified in workspace WHEN parser encounters errors (VERIFIED: Error handling pattern confirmed in actual implementation - combineParser.combine(null, [], false, parserModel.NOMATCH))

**TR7: Header Structure Integration** - The system SHALL use rowFinder() with matchesHeader callback and ACTUAL header structure verified in model-headers.js WHEN locating header rows (VERIFIED: Pattern confirmed in actual implementation - rowFinder with headerCallback function using matchesHeader and MatcherResult.CORRECT)

### Implementation Constraints (IC) - Architecture Decisions

**🚨 CRITICAL GENERATION RULE**: ALL IC requirements MUST include detailed "(VERIFIED: ...)" annotations from Phase 0 workspace analysis. If Phase 0 was not completed, IC requirements will be MISSING these annotations and the specification is INCORRECT.

**🚨 MANDATORY IC TEMPLATE WITH VERIFICATION ANNOTATIONS**:

**IC1: Header Pattern Compliance** - MUST use headers.{TRADER_NAME}.regex structure verified in actual model-headers.js (NOT generic fieldMapping patterns) (VERIFIED: Structure confirmed in workspace - headers.SAINSBURYS1.regex, headers.SAVERS1.regex, headers.BANDM1.regex patterns found in actual model-headers.js)

**IC2: Validation Pipeline Integration** - MUST integrate with existing validation pipeline infrastructure through combineParser.combine() function with ACTUAL signature verified in workspace (VERIFIED: Integration pattern confirmed - 6-parameter signature (establishmentNumber, packingListContents, allRequiredFieldsPresent, parserModel, establishmentNumbers, headers) found in multiple parser implementations)

**IC3: Parser Architecture Consistency** - MUST follow established parser patterns used by ACTUAL implementations verified in workspace (SAINSBURYS1, SAVERS1, NISA1 etc.) (VERIFIED: Architecture confirmed across similar implementations - standard pattern: regex.findMatch for establishment numbers, rowFinder for headers, mapParser for data processing, combineParser.combine for results)

**IC4: Configuration-Driven Validation** - MUST enable CoO validation through validateCountryOfOrigin flag in model-headers.js with ACTUAL configuration structure verified in workspace (VERIFIED: Flag usage confirmed in actual implementations - validateCountryOfOrigin: true found in SAINSBURYS1, SAVERS1, BANDM1, NISA1, TJMORRIS2, TESCO3, COOP1, DAVENPORT2, BOOKER2 configurations)

**IC5: Error Location Tracking** - MUST provide sheet name and row number information using ACTUAL error tracking patterns verified in workspace implementations (VERIFIED: Error tracking pattern confirmed - sheet parameter passed to mapParser() function, row numbers tracked through dataRow variable in parser implementations)

### Data Integration Requirements (DIR) - Trader-Specific Mappings

**🚨 CRITICAL GENERATION RULE**: ALL DIR requirements MUST include specific actual patterns from Phase 0 workspace analysis with detailed "(VERIFIED: ...)" annotations. If Phase 0 was not completed, DIR requirements will be MISSING these specific patterns and the specification is INCORRECT.

**🚨 MANDATORY DIR TEMPLATE WITH ACTUAL PATTERNS AND VERIFICATION ANNOTATIONS**:

**DIR1: Establishment Number Pattern** - The system SHALL use ACTUAL establishment number regex pattern verified in workspace model-headers.js for target trader (VERIFIED: Pattern extracted from real configuration - example: /^RMS-GB-000094(-\d{3})?$/i for SAINSBURYS1, /RMS-GB-000247-(\d{3})?/i for SAVERS1, /^RMS-GB-000005-\d{3}$/i for BANDM1)

**DIR2: Column Mapping Configuration** - The system SHALL map {Trader Name} columns using ACTUAL header mappings verified in workspace model-headers.js configuration (VERIFIED: Mappings confirmed in actual trader configuration - regex patterns like /Product \/ Part Number Description/i, /NIRMS Country of Origin/i, /NIRMS or non-NIRMS/i found in existing configurations)

**DIR3: NIRMS Recognition Pattern** - The system SHALL recognize NIRMS values using ACTUAL patterns verified in workspace implementation for target trader (VERIFIED: Recognition patterns confirmed in actual codebase - standard patterns: Yes|NIRMS|Green|Y|G (true), No|Non-NIRMS|Red|N|R (false) OR irregular patterns like Mars: Green (true), Red (false))

**DIR4: Field Regex Patterns** - The system SHALL use ACTUAL trader-specific regex patterns verified in workspace model-headers.js: {extracted actual regex patterns for description, commodity_code, country_of_origin, nirms, etc.} (VERIFIED: All regex patterns extracted from real configuration - examples: /ITEM DESCRIPTION/i, commodityCodeRegex, /COUNTRY OF ORIGIN/i, /NIRMS \/ SPS Item/i)



### File Naming Convention

**MANDATORY**: Save all generated specification files in the CoO specifications directory:

- **Full Path**: `/home/david/git/defra/trade-exportscore-plp/.spec/coo/AB{TICKET_NUMBER}-{trader}-coo-validation-spec.md`
- **Directory**: Must be saved in `.spec/coo/` relative to repository root
- **Format**: `AB{TICKET_NUMBER}-{trader}-coo-validation-spec.md`

**Real Examples from Workspace**:
- AB591514-asda3-coo-validation-spec.md
- AB591516-bandm-coo-validation-spec.md
- AB591539-sainsburys-coo-validation-spec.md
- AB591540-savers-coo-validation-spec.md
- AB599300-mars-coo-validation-spec.md

### Validation Rules for AC Generation

#### Individual Column Validation (14 BACs + Technical Requirements)

Generate these business acceptance criteria patterns:

**BAC1: NOT within NIRMS Scheme**
```gherkin
Given a {Trader} packing list item has a NIRMS value specified in the '{NIRMS_header}' column [column {X}]
And it contains a False value below (case insensitive):
  • {false_values}
When the packing list is submitted
Then the packing list will pass
```

**BAC2: Null NIRMS value**
```gherkin
Given a {Trader} packing list item has no NIRMS value specified in the '{NIRMS_header}' column [column {X}]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

**BAC3-BAC5**: Invalid NIRMS value scenarios (single, multiple >3)

**BAC6: Null CoO Value**
```gherkin
Given a {Trader} packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • {true_values}
And the CoO value is null in the '{CoO_header}' column [column {Y}]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

**BAC7-BAC10**: CoO validation scenarios (invalid format, multiple errors, X placeholder)

**BAC11-BAC14**: Prohibited items scenarios (with/without treatment type, multiple errors)

**Then generate corresponding Technical Requirements:**

**TR1-TR7**: Implementation specifics (parser configuration, function signatures, validation integration, data processing patterns, standard flow, error handling, header structure)

**IC1-IC5**: Architecture constraints (header pattern compliance, validation pipeline integration, parser architecture consistency, configuration-driven validation, error location tracking)

**DIR1-DIR4**: Data integration mappings (establishment number patterns, column mappings, NIRMS recognition patterns, field regex patterns)

#### Blanket Statement Validation (9 BACs + Technical Requirements)

Generate these business acceptance criteria patterns:

**BAC1: NIRMS Statement Validation**
```gherkin
Given a {Trader} packing list does not contain "{blanket_statement}"
When the packing list is processed
Then the validation should fail
And the failure reason should be "NIRMS/Non-NIRMS goods not specified"
And allRequiredFieldsPresent should be false
```

**BAC2-BAC9**: Follow B&M pattern for blanket statement validation

**Then generate corresponding Technical Requirements with blanket statement-specific patterns in DIR requirements.**

## Quality Criteria

**Success Measurement:**

| Category | Requirement | Validation |
|----------|-------------|------------|
| **Implementation Accuracy** | 100% verified against workspace | All TR/IC/DIR with "(VERIFIED: ...)" |
| **BAC Generation** | Correct count (9/10/14) | Matches validation approach |
| **File Management** | Proper naming & location | `.spec/coo/AB{ticket}-{trader}-coo-validation-spec.md` |
| **Content Quality** | No theoretical patterns | Only workspace-verified code |
| **Overview Update** | Trader entry added | Overview.md updated |

**🚨 Failure Indicators:**
- Missing "(VERIFIED: ...)" annotations in TR/IC/DIR sections
- Theoretical or template-based technical content
- Incorrect BAC count for validation approach
- File saved in wrong location or with wrong name

## Error Handling

**Graceful Error Management:**
- **Missing ADO Ticket**: Clear error message with retry guidance
- **Incomplete Header Info**: Request proper format with examples
- **File System Issues**: Handle permissions and directory creation
- **Workspace Verification Failures**: Stop processing, report specific missing patterns

## Implementation Requirements

### File Structure Generation

**MANDATORY FILE LOCATION AND NAMING**:

```
/home/david/git/defra/trade-exportscore-plp/.spec/coo/AB{ticket}-{trader}-coo-validation-spec.md

Directory: Must be .spec/coo/ (relative to repo root)
Full Path: /home/david/git/defra/trade-exportscore-plp/.spec/coo/
Format: AB{ADO_TICKET_NUMBER}-{trader_lowercase}-coo-validation-spec.md

Examples matching existing files:
- AB591514-asda3-coo-validation-spec.md
- AB591516-bandm-coo-validation-spec.md
- AB591527-giovanni1-coo-validation-spec.md  
- AB591532-kepak-coo-validation-spec.md
- AB591539-sainsburys-coo-validation-spec.md
- AB591540-savers-coo-validation-spec.md
- AB599300-mars-coo-validation-spec.md
```

**MANDATORY Overview.md UPDATE**:

After generating the specification file, you MUST update the trader specifications table in `/home/david/git/defra/trade-exportscore-plp/.spec/coo/Overview.md` by adding a new row:

```markdown
| {Trader Name} | {ADO_TICKET} | [AB{TICKET_NUMBER}-{trader}-coo-validation-spec.md](AB{TICKET_NUMBER}-{trader}-coo-validation-spec.md) | Specification Ready | {Key Features Description} |
```

**Key Features Examples:**
- Individual Column Validation: "Individual column CoO validation"
- Blanket Statement Validation: "Blanket statement processing"
- Irregular NIRMS Values: "Irregular NIRMS value patterns"
- Standard Implementation: "Standard CoO validation"

**Status Options:**
- "Specification Ready" - For new specifications awaiting implementation
- "✅ **IMPLEMENTED**" - For completed implementations (only use if confirmed by user)
- "🚧 **IN PROGRESS**" - For specifications under development

Insert the new row in alphabetical order by trader name in the existing table.

Required Sections:
1. Document header with version, date, status, work items, dependencies
2. Overview with specification purpose and scope
3. Business Context with user story and value proposition
4. Trader Format Specification with column mapping
5. NIRMS Value Mapping (regular, irregular, or blanket statements)
6. Acceptance Criteria (exactly 9, 11, or 14 based on approach)
```

### Validation Rules for AC Generation

#### Individual Column Validation (14 BACs + Technical Requirements)

Generate these business acceptance criteria patterns:

**NIRMS Validation (BAC1-BAC5):**
- **BAC1**: Valid NIRMS Classification (pass scenario)
- **BAC2**: Null NIRMS value (single failure)
- **BAC3**: Invalid NIRMS value (single failure) 
- **BAC4**: Null NIRMS value, more than 3 (multiple failures)
- **BAC5**: Invalid NIRMS value, more than 3 (multiple failures)

**CoO Validation (BAC6-BAC10):**
- **BAC6**: Null CoO Value (single failure)
- **BAC7**: Invalid CoO Value (single failure)
- **BAC8**: Null CoO Value, more than 3 (multiple failures)
- **BAC9**: Invalid CoO Value, more than 3 (multiple failures) 
- **BAC10**: CoO Value is Acceptable Placeholder (X/x pass scenario)

**Prohibited Items Validation (BAC11-BAC14) - CRITICAL: Must follow ASDA3 pattern:**
- **BAC11**: Prohibited Item with Treatment Type (single item failure)
- **BAC12**: Prohibited Item, More Than 3 (Treatment Type specified - multiple failures)
- **BAC13**: Prohibited Item without Treatment Type (single item failure)
- **BAC14**: Prohibited Item, More Than 3 (no Treatment Type specified - multiple failures)

**BAC1: NOT within NIRMS Scheme**
```gherkin
Given a {Trader} packing list item has a NIRMS value specified in the '{NIRMS_header}' column [column {X}]
And it contains a False value below (case insensitive):
  • {false_values}
When the packing list is submitted
Then the packing list will pass
```

**BAC2: Null NIRMS value**
```gherkin
Given a {Trader} packing list item has no NIRMS value specified in the '{NIRMS_header}' column [column {X}]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified in sheet X row Y"
```

**BAC3-BAC5**: Invalid NIRMS value scenarios (single, multiple >3)

**BAC6: Null CoO Value**
```gherkin
Given a {Trader} packing list item has a NIRMS value specified
And it contains a True value below (case insensitive):
  • {true_values}
And the CoO value is null in the '{CoO_header}' column [column {Y}]
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

**BAC7-BAC10**: CoO validation scenarios (invalid format, multiple errors, X placeholder)

**BAC11: Prohibited Item with Treatment Type**
```gherkin
Given a {Trader} packing list item has NIRMS value specified
And it contains a True value below (case insensitive):
  • {true_values}
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x")
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

**BAC12: Prohibited Item, More Than 3 (Treatment Type specified)**
```gherkin
Given a {Trader} packing list has more than 3 items that have NIRMS value specified
And it contains a True value below (case insensitive):
  • {true_values}
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x")
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

**BAC13: Prohibited Item without Treatment Type**
```gherkin
Given a {Trader} packing list item has NIRMS value specified
And it contains a True value below (case insensitive):
  • {true_values}
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x")
And the commodity code is specified
And the treatment type is null
And the commodity code + CoO combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

**BAC14: Prohibited Item, More Than 3 (no Treatment Type specified)**
```gherkin
Given a {Trader} packing list has more than 3 items that have NIRMS value specified
And it contains a True value below (case insensitive):
  • {true_values}
And the CoO value is valid (ISO code, comma-separated list, or "X"/"x")
And the commodity code is specified
And the treatment type is null
And the commodity code + CoO combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y, sheet X row Y, sheet X row Y, in addition to Z other locations"
```

#### Fixed Blanket Statement Validation (9 BACs + Technical Requirements)

**For traders with fixed treatment type (e.g., B&M always "Processed"):**

Generate these business acceptance criteria patterns:

**NIRMS Statement Validation (BAC1):**
- **BAC1**: Missing NIRMS Statement (failure scenario)

**CoO with NIRMS Validation (BAC2-BAC6):**
- **BAC2**: Missing CoO Value (single failure) 
- **BAC3**: Invalid CoO Value (single failure)
- **BAC4**: Missing CoO Value, More Than 3 (multiple failures)
- **BAC5**: Invalid CoO Value, More Than 3 (multiple failures)
- **BAC6**: CoO Value is Acceptable Placeholder (X/x pass scenario)

**Prohibited Items Validation (BAC7-BAC9):**
- **BAC7**: Prohibited Item with Fixed Treatment Type (single failure)
- **BAC8**: Prohibited Item without Treatment Type (single failure) 
- **BAC9**: Prohibited Items, Multiple Occurrences (multiple failures)

#### Variable Blanket Statement Validation (10 BACs + Technical Requirements)

**For traders with variable treatment type but CoO-focused validation (e.g., Kepak, Giovanni 1):**

Generate these business acceptance criteria patterns:

**NIRMS Statement Validation (BAC1):**
- **BAC1**: Missing NIRMS Statement (failure scenario)

**CoO with NIRMS Validation (BAC2-BAC6):**
- **BAC2**: Missing CoO Value (single failure)
- **BAC3**: Invalid CoO Value (single failure) 
- **BAC4**: Missing CoO Value, More Than 3 (multiple failures) - **CRITICAL: Must include "for more than 3 line items" condition**
- **BAC5**: Invalid CoO Value, More Than 3 (multiple failures) - **CRITICAL: Must include "And there are more than 3 line items with these CoO-related errors" clause**
- **BAC6**: CoO Value is Acceptable Placeholder (X/x pass scenario)

**Prohibited Items Validation (BAC7-BAC10):**
- **BAC7**: Prohibited Item with Treatment Type (single failure)
- **BAC8**: Prohibited Item, More Than 3 (Treatment Type specified - multiple failures) - **CRITICAL: Must include "matches an item on the prohibited list in more than 3 instances" condition**
- **BAC9**: Prohibited Item without Treatment Type (single failure)
- **BAC10**: Prohibited Items, More Than 3 (no Treatment Type specified - multiple failures) - **CRITICAL: Must include "matches an item on the prohibited list in more than 3 instances" condition**

**CRITICAL: Variable Blanket Statement Template Requirements**
- **DO NOT** use specific treatment type values like 'Processed' in BAC7 and BAC8 Gherkin scenarios
- **USE GENERIC LANGUAGE**: "treatment type is specified" instead of "packing list has 'Processed' in the treatment type field"
- **EXAMPLE**: "And the treatment type is specified" NOT "And the packing list has 'Processed' in the treatment type field"
- **RATIONALE**: Variable blanket statement validation must accommodate any treatment type value, not specific ones

**🚨 MANDATORY FULL NIRMS STATEMENT REQUIREMENTS FOR BLANKET VALIDATION:**
- **BAC2-BAC10 REQUIREMENT**: MUST use the complete NIRMS statement text from ADO ticket, NOT abbreviated references
- **CORRECT FORMAT**: "Given a packing list has the statement 'The exporter of the products covered by this document (NIRMS RMS-GB-XXXXXX) declares that these products are intend for the Green lane and will remain in Northern Ireland.' specified anywhere on it"
- **INCORRECT FORMAT**: "Given a packing list has the NIRMS statement specified anywhere on it"
- **RATIONALE**: ADO ticket comparison requires exact text matching. Abbreviated references cause specification text differences that fail validation
- **EXTRACTION RULE**: Extract the exact NIRMS statement text from ADO ticket description or acceptance criteria and use it verbatim in BAC2-BAC10

**TEMPLATE EXAMPLE FOR VARIABLE BLANKET STATEMENT VALIDATION:**

**BAC2: Null CoO Value**
```gherkin
Given a {Trader} packing list has the statement '{NIRMS_STATEMENT_FROM_ADO}' specified anywhere on it
And the CoO value is null
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Missing Country of Origin in sheet X row Y"
```

**BAC3: Invalid CoO Value**
```gherkin
Given a {Trader} packing list has the statement '{NIRMS_STATEMENT_FROM_ADO}' specified anywhere on it
And the CoO value is not a valid ISO 2-digit country code
And the CoO value is not a comma-separated list of valid ISO 2-digit country codes
And the CoO value is not X or x
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Invalid Country of Origin ISO Code in sheet X row Y"
```

**BAC7: Prohibited Item with Treatment Type**
```gherkin
Given a {Trader} packing list has the statement '{NIRMS_STATEMENT_FROM_ADO}' specified anywhere on it
And the CoO value is valid (single ISO 2-digit country code or comma-separated list of ISO 2-digit country codes)
And the commodity code is specified
And the treatment type is specified
And the commodity code + CoO + treatment combination matches an item on the prohibited list
When the packing list is submitted
Then the packing list will fail
And the failure reason is: "Prohibited item identified on the packing list in sheet X row Y"
```

**CRITICAL**: Replace `{NIRMS_STATEMENT_FROM_ADO}` with the actual NIRMS statement text extracted from the ADO ticket for BAC2-BAC10.

**🚨 MANDATORY "MORE THAN 3" PATTERN REQUIREMENTS:**
- **BAC4 REQUIREMENT**: MUST include "for more than 3 line items" after "the CoO value is null"
- **BAC5 REQUIREMENT**: MUST include "And there are more than 3 line items with these CoO-related errors" as separate And clause
- **BAC8 REQUIREMENT**: MUST include "matches an item on the prohibited list in more than 3 instances" NOT "matches an item on the prohibited list"
- **BAC10 REQUIREMENT**: MUST include "matches an item on the prohibited list in more than 3 instances" NOT "matches an item on the prohibited list"
- **ENFORCEMENT**: Any specification missing these exact conditions is INCORRECT and must be regenerated

**Quality Checklist**: Verify BAC count (14/9/10), file naming (AB{ticket}-{trader}-coo-validation-spec.md in .spec/coo/), and technical accuracy against workspace implementation.
