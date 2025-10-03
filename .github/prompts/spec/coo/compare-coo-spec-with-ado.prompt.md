---
description: "Perform systematic text comparison between ADO work item acceptance criteria and specification file BACs to identify exact differences"
mode: "agent"
tools: ['extensions', 'todos', 'runTests', 'codebase', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'runCommands', 'runTasks', 'editFiles', 'runNotebooks', 'search', 'new', 'sequential-thinking', 'add_comment_to_pending_review', 'cancel_workflow_run', 'create_and_submit_pull_request_review', 'create_branch', 'create_gist', 'create_or_update_file', 'create_pending_pull_request_review', 'create_pull_request', 'create_pull_request_with_copilot', 'create_repository', 'delete_file', 'download_workflow_run_artifact', 'get_code_scanning_alert', 'get_commit', 'get_dependabot_alert', 'get_file_contents', 'get_job_logs', 'get_latest_release', 'get_notification_details', 'get_pull_request', 'get_pull_request_diff', 'get_pull_request_files', 'get_pull_request_reviews', 'get_pull_request_status', 'get_secret_scanning_alert', 'get_tag', 'get_workflow_run', 'get_workflow_run_logs', 'get_workflow_run_usage', 'list_branches', 'list_code_scanning_alerts', 'list_commits', 'list_dependabot_alerts', 'list_gists', 'list_notifications', 'list_pull_requests', 'list_releases', 'list_secret_scanning_alerts', 'list_tags', 'list_workflow_jobs', 'list_workflow_run_artifacts', 'list_workflow_runs', 'list_workflows', 'manage_notification_subscription', 'manage_repository_notification_subscription', 'mark_all_notifications_read', 'merge_pull_request', 'push_files', 'request_copilot_review', 'rerun_failed_jobs', 'rerun_workflow_run', 'run_workflow', 'search_code', 'search_orgs', 'search_pull_requests', 'search_repositories', 'search_users', 'submit_pending_pull_request_review', 'update_gist', 'update_pull_request', 'update_pull_request_branch', 'build_get_builds', 'build_get_changes', 'build_get_definition_revisions', 'build_get_definitions', 'build_get_log', 'build_get_log_by_id', 'build_get_status', 'build_run_build', 'build_update_build_stage', 'search_code', 'search_workitem', 'wit_add_child_work_items', 'wit_add_work_item_comment', 'wit_create_work_item', 'wit_get_query', 'wit_get_query_results_by_id', 'wit_get_work_item', 'wit_get_work_item_type', 'wit_get_work_items_batch_by_ids', 'wit_get_work_items_for_iteration', 'wit_link_work_item_to_pull_request', 'wit_list_backlog_work_items', 'wit_list_backlogs', 'wit_list_work_item_comments', 'wit_my_work_items', 'wit_update_work_item', 'wit_update_work_items_batch', 'wit_work_item_unlink', 'wit_work_items_link', 'work_assign_iterations', 'work_create_iterations', 'work_list_team_iterations']
---

# Compare CoO Specification with ADO Ticket

You are a senior business analyst specializing in requirements traceability and acceptance criteria validation with expertise in DEFRA trade systems and systematic text comparison methodologies.

## Task

Compare all acceptance criteria from an ADO work item against all business acceptance criteria in the corresponding specification file using systematic text matching to identify alignment differences. Handle any number of criteria and provide detailed mismatch analysis when counts differ.

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
**From ADO (extract all acceptance criteria)**:
1. Extract HTML content from `Microsoft.VSTS.Common.AcceptanceCriteria` field
2. Strip all HTML tags: `<div>`, `<strong>`, `<br>`, `<span>`, etc.
3. Extract all AC sections matching pattern `AC\d+:`
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

- **Checkpoint 3**: Display counts found (ADO: X ACs, Spec: Y BACs) and proceed to alignment analysis

### Step 4: Alignment Analysis and Comparison
**If counts match (ADO ACs = Spec BACs)**:
- Compare each AC/BAC pair after text normalization
- Mark as ✅ MATCH or ❌ DIFFERENT
- Proceed to standard comparison analysis

**If counts differ (ADO ACs ≠ Spec BACs)**:
- Identify which criteria exist in ADO but not in Spec
- Identify which criteria exist in Spec but not in ADO  
- For criteria that exist in both, perform text comparison
- Generate comprehensive mismatch analysis

- **Checkpoint 4**: Confirm alignment analysis methodology applied

### Step 5: Generate Analysis Report

## Output Format

```markdown
# Comparison Results: AB#${input:workItemId}

## Criteria Count Analysis
- **ADO Work Item**: X acceptance criteria (AC1-ACX)
- **Specification**: Y business acceptance criteria (BAC1-BACY)  
- **Count Match**: ✅ ALIGNED / ❌ MISALIGNED (X vs Y)

## Alignment Analysis

### Criteria Present in Both ADO and Spec
| AC# | ADO Text (key part) | Spec Text (key part) | Match |
|-----|-------------------|---------------------|-------|
| AC1/BAC1 | [critical text snippet] | [critical text snippet] | ✅/❌ |
| AC2/BAC2 | [critical text snippet] | [critical text snippet] | ✅/❌ |
... [for all matching numbered pairs]

### Criteria Only in ADO (Missing from Spec)
- **AC#**: [Brief description of ADO-only criterion]
... [list all ADO criteria without corresponding BAC]

### Criteria Only in Spec (Missing from ADO)  
- **BAC#**: [Brief description of Spec-only criterion]
... [list all Spec criteria without corresponding AC]

## Summary
- **Criteria Counts**: ADO=X, Spec=Y  
- **Perfect Matches**: Z criteria
- **Text Differences**: W criteria (same logic, different wording)
- **Logic Differences**: V criteria (different business requirements)
- **ADO-Only Criteria**: U criteria
- **Spec-Only Criteria**: T criteria
- **Overall Status**: FULLY_ALIGNED / PARTIALLY_ALIGNED / MISALIGNED

## Difference Analysis

### WORDING DIFFERENCES (Same Business Logic)
List ACs with formatting/structural differences but identical requirements:
- AC#/BAC#: Brief description of difference type and impact level

### FUNDAMENTAL DIFFERENCES (Different Business Logic)  
List ACs with significant requirement or logic differences:
- AC#/BAC#: Description of ADO vs Spec logic and impact assessment

### MISSING CRITERIA IMPACT
**ADO-Only Criteria (not in Spec)**:
- Impact: Requirements defined in ADO but not documented in specification
- Risk: Implementation may not match specification expectations

**Spec-Only Criteria (not in ADO)**:
- Impact: Specification requirements not reflected in ADO work item  
- Risk: Implementation may include unexpected validation not tracked in ADO

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
- Extract all acceptance criteria from ADO and all BACs from specification (flexible count)
- Handle count mismatches gracefully with detailed analysis
- Perform character-by-character comparison after text normalization for matching criteria
- Complete all checkpoints before proceeding to analysis
- Distinguish between wording differences vs fundamental business logic changes
- Identify and analyze missing criteria in both directions (ADO→Spec, Spec→ADO)

## Error Handling

**If extraction fails**:
- ADO: Verify `Microsoft.VSTS.Common.AcceptanceCriteria` field exists and contains at least one AC
- Spec: Verify `### Business Acceptance Criteria (BAC)` section exists and contains at least one BAC
- Report extraction status showing what was found vs what was expected
- Continue with available criteria if at least one is found in each source

**If no criteria found**:
- Report complete extraction failure and stop process
- Provide specific guidance for locating criteria in each source

**If comparison fails**:
- Display checkpoint status and identify which step failed
- Provide specific guidance for resolution

## Success Criteria

- All 4 checkpoints completed successfully
- All available AC/BAC criteria extracted and analyzed (flexible count)
- Count mismatch analysis provided when ADO and Spec counts differ
- Clear categorization of differences as wording vs fundamental vs missing
- Missing criteria identified in both directions (ADO-only and Spec-only)
- Actionable recommendations provided for all types of misalignments
- Comprehensive impact assessment for missing criteria
```
