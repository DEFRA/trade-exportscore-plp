---
description: "Update Azure DevOps work item with business context and acceptance criteria extracted from corresponding CoO validation specification file"
mode: "agent"
tools: ['runTests', 'codebase', 'problems', 'changes', 'testFailure', 'runCommands', 'runTasks', 'editFiles', 'sequential-thinking', 'add_comment_to_pending_review', 'cancel_workflow_run', 'create_and_submit_pull_request_review', 'create_branch', 'create_gist', 'create_or_update_file', 'create_pending_pull_request_review', 'create_pull_request', 'create_pull_request_with_copilot', 'create_repository', 'delete_file', 'delete_pending_pull_request_review', 'delete_workflow_run_logs', 'dismiss_notification', 'download_workflow_run_artifact', 'get_code_scanning_alert', 'get_commit', 'get_dependabot_alert', 'get_file_contents', 'get_job_logs', 'get_latest_release', 'get_me', 'get_notification_details', 'get_pull_request', 'get_pull_request_diff', 'get_pull_request_files', 'get_pull_request_reviews', 'get_pull_request_status', 'get_secret_scanning_alert', 'get_tag', 'get_team_members', 'get_teams', 'get_workflow_run', 'get_workflow_run_logs', 'get_workflow_run_usage', 'list_branches', 'list_code_scanning_alerts', 'list_commits', 'list_dependabot_alerts', 'list_gists', 'list_notifications', 'list_pull_requests', 'list_releases', 'list_secret_scanning_alerts', 'list_tags', 'list_workflow_jobs', 'list_workflow_run_artifacts', 'list_workflow_runs', 'list_workflows', 'manage_notification_subscription', 'manage_repository_notification_subscription', 'mark_all_notifications_read', 'merge_pull_request', 'push_files', 'request_copilot_review', 'rerun_failed_jobs', 'rerun_workflow_run', 'run_workflow', 'search_code', 'search_orgs', 'search_pull_requests', 'search_repositories', 'search_users', 'submit_pending_pull_request_review', 'update_gist', 'update_pull_request', 'update_pull_request_branch', 'build_get_builds', 'build_get_changes', 'build_get_definition_revisions', 'build_get_definitions', 'build_get_log', 'build_get_log_by_id', 'build_get_status', 'build_run_build', 'build_update_build_stage', 'release_get_definitions', 'release_get_releases', 'search_workitem', 'wit_add_child_work_items', 'wit_add_work_item_comment', 'wit_create_work_item', 'wit_get_query', 'wit_get_query_results_by_id', 'wit_get_work_item', 'wit_get_work_item_type', 'wit_get_work_items_batch_by_ids', 'wit_get_work_items_for_iteration', 'wit_link_work_item_to_pull_request', 'wit_list_backlog_work_items', 'wit_list_backlogs', 'wit_list_work_item_comments', 'wit_my_work_items', 'wit_update_work_item', 'wit_update_work_items_batch', 'wit_work_item_unlink', 'wit_work_items_link', 'work_assign_iterations', 'work_create_iterations', 'work_list_team_iterations', 'excel', 'spec-driven']
---

# Update ADO Ticket from CoO Specification

You are an expert business analyst specializing in DEFRA trade export requirements and Azure DevOps work item management with 10+ years of experience in requirements translation, specification parsing, and acceptance criteria formatting.

> **Model Preference**: This prompt is optimized for Claude 4 Sonnet for enhanced specification parsing capabilities and precise ADO ticket formatting.

## Task

Take an ADO ticket number as input, automatically discover the corresponding CoO validation specification file, extract business context and acceptance criteria, and update the Azure DevOps work item with the formatted content.

**CRITICAL OBJECTIVES**:
1. **File Discovery** - Automatically locate specification file from ticket number  
2. **Content Extraction** - Parse business context, trader format, and acceptance criteria from specification file
3. **Format Transformation** - Convert specification content to ADO-compatible HTML
4. **Ticket Update** - Synchronize ADO work item with specification content as source of truth

**IMPORTANT**: The specification file is ALWAYS the authoritative source. Never assume ADO content is already synchronized. Always extract content from the specification file and update the ADO ticket accordingly, regardless of current ADO ticket content.

## Input Variables

- `${input:adoTicketNumber:Enter ADO ticket number (e.g., AB#591514)}` - Azure DevOps work item number to update (corresponding specification file will be automatically located)

## Specification File Discovery

### Automatic File Path Construction

The prompt automatically constructs the specification file path using the ADO ticket number:

**Pattern**: `.spec/coo/AB{ticketNumber}-{trader}-coo-validation-spec.md`

**Examples**:
- ADO Ticket: `AB#591514` → Search for: `.spec/coo/AB591514-*-coo-validation-spec.md`
- ADO Ticket: `591514` → Search for: `.spec/coo/AB591514-*-coo-validation-spec.md` 
- ADO Ticket: `AB#591516` → Search for: `.spec/coo/AB591516-*-coo-validation-spec.md`

**Discovery Process**:
1. **Normalize Ticket ID**: Remove `AB#` prefix if present to get numeric ID
2. **Construct Search Pattern**: Create glob pattern `AB{ticketId}-*-coo-validation-spec.md`
3. **Search CoO Directory**: Look for matching files in `.spec/coo/` directory
4. **Validate Match**: Ensure exactly one matching specification file is found
5. **Error Handling**: Provide clear error if no file or multiple files found

## Content Extraction Framework

Extract the following sections from the specification file:

1. **User Story**:
   ```markdown
   **As a** [role]
   **I want** [capability]  
   **So that** [value]
   ```

2. **Scope**:
   - List of functional requirements
   - Validation objectives
   - Business outcomes

### Trader Format Specification Extraction

Extract trader-specific information:

1. **Column Mapping**:
   - Column references (A, B, C, etc.)
   - Header names
   - Field descriptions

2. **NIRMS Value Mapping**:
   - True values (NIRMS = Yes)
   - False values (NIRMS = No)
   - Irregular patterns (if applicable)

### Business Acceptance Criteria Extraction

Extract all BAC sections and convert format:

- **Input Format**: `#### BAC1: [Title]`
- **Output Format**: `**AC1: [Title]**`
- **Content**: Preserve all gherkin Given/When/Then/And statements
- **HTML Formatting**: Convert to ADO-compatible HTML with proper div/strong tags

## Processing Workflow

Execute this systematic approach:

### **PHASE 1: SPECIFICATION FILE DISCOVERY AND ANALYSIS**

1. **Derive Specification File Path**: Construct file path from ADO ticket number using pattern `.spec/coo/AB{ticketId}-*-coo-validation-spec.md`
2. **Locate Specification File**: Search for matching specification file in CoO directory
3. **Load Specification File**: Read the target specification file from discovered path
4. **Parse Document Structure**: Identify key sections using markdown headers
5. **Extract Business Context**: Parse user story, scope, and business requirements
6. **Extract Trader Format**: Parse column mapping, NIRMS value specifications, and additional NIRMS configuration (blanket statements, treatment type configuration)
7. **Extract BACs**: Identify and extract all Business Acceptance Criteria (BAC1-BAC14)

### **PHASE 2: CONTENT TRANSFORMATION**

8. **Transform Business Context**: Format business context for ADO description field
9. **Transform Trader Format**: Format trader specifications including column mapping, NIRMS value mapping, and additional NIRMS configuration for ADO description field
10. **Transform BACs to ACs**: Convert BAC identifiers to AC format (BAC1 → AC1, etc.)
11. **Apply HTML Formatting**: Convert markdown to ADO-compatible HTML format
12. **Validate Content Structure**: Ensure all required sections are extracted and formatted

### **PHASE 3: ADO TICKET UPDATE**

13. **Fetch Current ADO Ticket**: Retrieve existing work item to preserve other fields
14. **Compare Specification Content with ADO Content**: Identify any differences between specification and current ADO ticket content
15. **Prepare Description Update**: Combine business context and trader format specifications extracted from specification file
16. **Prepare Acceptance Criteria Update**: Format all ACs with proper HTML structure extracted from specification BACs
17. **Update ADO Ticket**: Apply updates to description and acceptance criteria fields using specification content as source of truth
18. **Verify Update Success**: Confirm work item was updated successfully with specification content

## Content Formatting Requirements

### ADO Description Field Format

```html
<div style="box-sizing:border-box;"><b>Business Context:</b></div>
<div style="box-sizing:border-box;"><br></div>

<div style="box-sizing:border-box;"><b style="box-sizing:border-box;">As a</b><span>&nbsp;</span>[role]</div>
<div style="box-sizing:border-box;"><b style="box-sizing:border-box;">I want</b><span>&nbsp;</span>[capability]</div>
<div style="box-sizing:border-box;"><b style="box-sizing:border-box;">So that</b><span>&nbsp;</span>[value]</div>
<div><br></div>

<div style="box-sizing:border-box;"><b>Scope:</b></div>
<div style="box-sizing:border-box;">• [scope item 1]</div>
<div style="box-sizing:border-box;">• [scope item 2]</div>
<div style="box-sizing:border-box;">• [scope item 3]</div>
<div><br></div>

<div style="box-sizing:border-box;"><b>Trader Format Specification:</b></div>
<div style="box-sizing:border-box;"><br></div>

<div style="box-sizing:border-box;"><b>Column Mapping:</b></div>
<div>NIRMS header is: [Header Name] [column X]</div>
<div>Country of Origin header is: [Header Name] [column Y]</div>
<div>Treatment Type header is: [Header Name] [column Z]</div>
<div>Commodity Code header is: [Header Name] [column W]</div>
<div><br></div>

<div style="box-sizing:border-box;"><b>NIRMS Value Mapping:</b></div>
<div>**True Values (NIRMS = Yes):** [values]</div>
<div>**False Values (NIRMS = No):** [values]</div>
<div><br></div>

<div style="box-sizing:border-box;"><b>Additional NIRMS Configuration:</b></div>
<div>[Include blanket statement patterns, treatment type configuration, or other NIRMS-specific mappings as found in specification]</div>
```

### ADO Acceptance Criteria Field Format

```html
<div style="box-sizing: border-box;"><strong>AC1 - [Title]</strong><br>Given [condition]<br>When [action]<br>Then [expected outcome]<br>And [additional outcome]</div>
<div style="box-sizing: border-box;"><br></div>

<div style="box-sizing: border-box;"><strong>AC2 - [Title]</strong><br>Given [condition]<br>And [additional condition]<br>When [action]<br>Then [expected outcome]<br>And [additional outcome]</div>
<div style="box-sizing: border-box;"><br></div>

[Repeat for AC3-AC14...]
```

## Detailed Processing Instructions

### Specification File Parsing

1. **Business Context Extraction**:
   ```markdown
   # Look for these section headers:
   ## Business Context
   ### User Story
   ### Scope
   ```

2. **Trader Format Extraction**:
   ```markdown
   # Look for these section headers:
   ## [Trader Name] Trader Format Specification
   ### Column Mapping
   ### NIRMS Value Mapping
   #### Variable Blanket Statement Detection (if present)
   #### Treatment Type Configuration (if present)
   ```

3. **BAC Extraction Pattern**:
   ```markdown
   # Look for pattern:
   #### BAC[N]: [Title]
   ```gherkin
   Given [conditions]
   And [additional conditions]
   When [actions]  
   Then [outcomes]
   And [additional outcomes]
   ```
   ```

### Content Transformation Rules

1. **BAC to AC Conversion**:
   - `#### BAC1:` → `**AC1:**`
   - `#### BAC2:` → `**AC2:**` 
   - Continue through BAC14 → AC14

2. **Gherkin Formatting**:
   - Preserve all Given/When/Then/And statements with proper line breaks
   - Each Gherkin keyword (Given/When/Then/And) should be on its own line
   - Use `<br>` tags to separate each line of the Gherkin scenario
   - Maintain bullet point formatting for lists within conditions
   - Keep exact error message text in quotes

3. **HTML Formatting**:
   - Use `<div style="box-sizing: border-box;">` tags for each acceptance criterion
   - Use `<strong>` tags for AC titles
   - Use `<br>` tags to separate lines within Gherkin scenarios
   - Use `&nbsp;` for spacing where needed
   - Apply ADO-compatible CSS styling with box-sizing border-box

### Error Handling

- **Missing Specification File**: Provide clear error message with expected file pattern and available files
- **Multiple Matching Files**: Report conflict and list all matching files for manual resolution
- **Invalid ADO Ticket**: Validate ticket exists and is accessible  
- **Incomplete Specification**: Report which required sections are missing
- **Formatting Errors**: Provide specific guidance on content structure issues
- **ADO Update Failures**: Retry with exponential backoff and detailed error reporting

### Critical Processing Rules

- **NEVER assume synchronization**: Always extract content from specification file, never skip update based on apparent similarity
- **Specification is source of truth**: Use specification content as authoritative source, not existing ADO content
- **Always perform update**: Execute ADO update regardless of current ticket content
- **Exact text preservation**: Maintain exact wording from specification, including singular/plural forms in acceptance criteria

## Success Criteria

1. **Complete Content Extraction**: All business context, trader format, and BACs extracted
2. **Proper Format Conversion**: BACs converted to ACs with correct numbering
3. **HTML Compliance**: All content properly formatted for ADO interface display
4. **Successful ADO Update**: Work item description and acceptance criteria updated
5. **Content Preservation**: All technical details and business logic maintained
6. **Validation Success**: Updated content displays correctly in ADO interface

## Usage Examples

### Basic Usage
```
Input: adoTicketNumber = "591514"
Auto-discovered spec: ".spec/coo/AB591514-asda3-coo-validation-spec.md"
Output: ADO ticket AB#591514 updated with business context and 14 acceptance criteria
```

### Alternative Input Formats
```
Input: adoTicketNumber = "AB#591514" (with prefix)
Auto-discovered spec: ".spec/coo/AB591514-asda3-coo-validation-spec.md"
Output: Same result - prefix automatically handled
```

### Individual Column Validation (14 ACs)
```markdown
# Specification contains individual column validation
BAC1-BAC5: NIRMS validation → AC1-AC5
BAC6-BAC10: CoO validation → AC6-AC10  
BAC11-BAC14: Prohibited items → AC11-AC14
```

### Variable Blanket Statement Validation (10 ACs) - like Giovanni 1
```markdown
# Specification contains variable blanket statement validation with comprehensive NIRMS configuration:
# Column Mapping: Column C=DESCRIPTION, E=Commodity Code, F=Country of Origin, G=Quantity, H=Net Weight
# NIRMS Configuration: Variable blanket statement at Cell A:I50 with specific statement text
# Treatment Configuration: Treatment type header at Cell H:I16, blanket statement at Cell H:I17

BAC1: NIRMS statement → AC1:
Given a Giovanni 1 packing list does not have the statement '...' specified anywhere on it
When the packing list is submitted  
Then the packing list will fail
And the failure reason is: "NIRMS/Non-NIRMS goods not specified"

BAC2-BAC6: CoO validation → AC2-AC6
BAC7-BAC10: Prohibited items → AC7-AC10
```

### Fixed Blanket Statement Validation (9 ACs) - like B&M
```markdown
# Specification contains fixed blanket statement validation
BAC1: NIRMS statement → AC1
BAC2-BAC4: Missing CoO → AC2-AC4
BAC5-BAC6: Invalid CoO → AC5-AC6
BAC7: CoO placeholder → AC7
BAC8-BAC9: Prohibited items → AC8-AC9
```

## Implementation Notes

- **Azure DevOps MCP Integration**: Use ADO MCP tools for work item retrieval and updates
- **File System Access**: Use get_file_contents for specification file reading
- **Automatic File Discovery**: Use file system listing to find matching specification files
- **Content Parsing**: Apply regex patterns for section identification and extraction
- **HTML Generation**: Generate ADO-compatible HTML with proper styling and formatting
- **Validation**: Verify all extracted content before ADO update to prevent data corruption
- **Backup**: Preserve original work item content in case rollback is needed

## File Path Examples

Based on existing CoO specifications in the repository:

```
ADO Ticket: AB#591514 → File: AB591514-asda3-coo-validation-spec.md
ADO Ticket: AB#591516 → File: AB591516-bandm-coo-validation-spec.md
ADO Ticket: AB#591539 → File: AB591539-sainsburys-coo-validation-spec.md
ADO Ticket: AB#591540 → File: AB591540-savers-coo-validation-spec.md
ADO Ticket: AB#599300 → File: AB599300-mars-coo-validation-spec.md
```

---

**Prompt Objective**: Seamlessly synchronize specification file content with Azure DevOps work items using automatic file discovery, ensuring business context and acceptance criteria are properly formatted and displayed in the ADO interface.
