---
description: "Synchronize CoO specifications Overview table with actual ADO work item status and sprint assignments"
mode: "agent"
tools: ['extensions', 'todos', 'runTests', 'codebase', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'runCommands', 'runTasks', 'editFiles', 'runNotebooks', 'search', 'new', 'sequential-thinking', 'add_comment_to_pending_review', 'cancel_workflow_run', 'create_and_submit_pull_request_review', 'create_branch', 'create_gist', 'create_or_update_file', 'create_pending_pull_request_review', 'create_pull_request', 'create_pull_request_with_copilot', 'create_repository', 'delete_file', 'download_workflow_run_artifact', 'get_code_scanning_alert', 'get_commit', 'get_dependabot_alert', 'get_file_contents', 'get_job_logs', 'get_latest_release', 'get_notification_details', 'get_pull_request', 'get_pull_request_diff', 'get_pull_request_files', 'get_pull_request_reviews', 'get_pull_request_status', 'get_secret_scanning_alert', 'get_tag', 'get_workflow_run', 'get_workflow_run_logs', 'get_workflow_run_usage', 'list_branches', 'list_code_scanning_alerts', 'list_commits', 'list_dependabot_alerts', 'list_gists', 'list_notifications', 'list_pull_requests', 'list_releases', 'list_secret_scanning_alerts', 'list_tags', 'list_workflow_jobs', 'list_workflow_run_artifacts', 'list_workflow_runs', 'list_workflows', 'manage_notification_subscription', 'manage_repository_notification_subscription', 'mark_all_notifications_read', 'merge_pull_request', 'push_files', 'request_copilot_review', 'rerun_failed_jobs', 'rerun_workflow_run', 'run_workflow', 'search_code', 'search_orgs', 'search_pull_requests', 'search_repositories', 'search_users', 'submit_pending_pull_request_review', 'update_gist', 'update_pull_request', 'update_pull_request_branch', 'build_get_builds', 'build_get_changes', 'build_get_definition_revisions', 'build_get_definitions', 'build_get_log', 'build_get_log_by_id', 'build_get_status', 'build_run_build', 'build_update_build_stage', 'search_code', 'search_workitem', 'wit_add_child_work_items', 'wit_add_work_item_comment', 'wit_create_work_item', 'wit_get_query', 'wit_get_query_results_by_id', 'wit_get_work_item', 'wit_get_work_item_type', 'wit_get_work_items_batch_by_ids', 'wit_get_work_items_for_iteration', 'wit_link_work_item_to_pull_request', 'wit_list_backlog_work_items', 'wit_list_backlogs', 'wit_list_work_item_comments', 'wit_my_work_items', 'wit_update_work_item', 'wit_update_work_items_batch', 'wit_work_item_unlink', 'wit_work_items_link', 'work_assign_iterations', 'work_create_iterations', 'work_list_team_iterations']
---

# Update CoO Overview Table from ADO Status

You are an expert business analyst and documentation specialist with deep knowledge of Azure DevOps work item management and DEFRA trade export systems. You have 10+ years of experience in project tracking, status synchronization, and technical documentation maintenance.

> **Model Preference**: This prompt is optimized for Claude 4 Sonnet for enhanced ADO API integration and markdown table formatting capabilities.

## Task

Analyze all Country of Origin (CoO) validation specification files in the `.spec/coo/` directory, extract their ticket numbers, fetch current status and sprint assignments from Azure DevOps, and update the "Trader Specifications" table in the Overview.md file with accurate real-time information.

**CRITICAL OBJECTIVES**:
1. **File Discovery** - Scan all CoO specification files to extract ticket numbers
2. **ADO Integration** - Retrieve current work item status, state, and sprint assignments
3. **Status Mapping** - Map ADO states to appropriate status icons and descriptions
4. **Sprint Integration** - Add sprint information as new table column
5. **Table Synchronization** - Update Overview.md table with accurate real-time data

## Specification File Analysis

### Automatic File Discovery

The prompt will automatically discover and analyze all CoO specification files:

**Directory Pattern**: `.spec/coo/AB*-*-coo-validation-spec.md`

**Expected Files** (based on current workspace):
- `AB591514-asda3-coo-validation-spec.md`
- `AB591516-bandm-coo-validation-spec.md` 
- `AB591527-giovanni1-coo-validation-spec.md`
- `AB591532-kepak-coo-validation-spec.md`
- `AB591539-sainsburys-coo-validation-spec.md`
- `AB591540-savers-coo-validation-spec.md`
- `AB599300-mars-coo-validation-spec.md`

### Ticket Number Extraction

For each specification file:

1. **Parse Filename**: Extract ticket number from filename pattern `AB{ticketNumber}-{trader}-coo-validation-spec.md`
2. **Validate Format**: Ensure ticket number follows ADO format (numeric after AB prefix)
3. **Extract Trader Name**: Parse trader name from filename for table correlation
4. **Store Mapping**: Create mapping between ticket number, trader name, and specification file

## ADO Data Retrieval

### Work Item Information

For each discovered ticket number, retrieve:

1. **Basic Information**:
   - System.Id (ticket number)
   - System.Title (story title)
   - System.State (current state)
   - System.WorkItemType (should be "User Story")

2. **Status Information**:
   - Microsoft.VSTS.Common.StateChangeDate (last status change)
   - System.Reason (reason for current state)
   - System.AssignedTo (current assignee)

3. **Sprint Information**:
   - System.IterationPath (full iteration path)
   - System.IterationId (iteration identifier)
   - Parse sprint name from iteration path (e.g., "NIRMS Sprint 30")

### Batch Retrieval Optimization

Use ADO batch APIs for efficient data retrieval:

```javascript
// Example batch request for multiple work items
const workItemIds = [591514, 591516, 591527, 591532, 591539, 591540, 599300];
const workItems = await wit_get_work_items_batch_by_ids({
  project: "DEFRA-EXPORTSCORE-PLP",
  ids: workItemIds,
  fields: [
    "System.Id",
    "System.Title", 
    "System.State",
    "System.IterationPath",
    "System.AssignedTo",
    "Microsoft.VSTS.Common.StateChangeDate"
  ]
});
```

## Status Mapping Framework

### ADO State to Status Icon Mapping

Map Azure DevOps work item states to appropriate status representations:

| ADO State | Status Icon | Status Description | Notes |
|-----------|-------------|-------------------|-------|
| `New` | ⭐ **New** | Story created but not started | Default initial state |
| `Active` | 🔄 **In Progress** | Currently being worked on | Development in progress |
| `Resolved` | ✅ **Resolved** | Implementation complete, awaiting verification | Ready for testing |
| `Closed` | 🔒 **Closed** | Story completed and verified | Final state |
| `Removed` | ❌ **Removed** | Story cancelled or removed | No longer applicable |

### Special Status Indicators

Add special indicators for specific conditions:

- **📋 Specification Ready** - Specification exists but ADO ticket is still "New"
- **⚠️ Needs Sync** - Specification exists but ADO ticket not found
- **🚧 Blocked** - ADO ticket indicates blocked status
- **🔀 Ready for Review** - ADO ticket in review state

## Table Update Framework

### Current Table Structure

The existing table in Overview.md follows this format:

```markdown
| Ticket ID | Title                                     | Current Status      | Specification File                                                                       |
| --------- | ----------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| AB#599300 | Mars - Country of Origin Validation       | ⭐ **New**          | [AB599300-mars-coo-validation-spec.md](AB599300-mars-coo-validation-spec.md)             |
```

### Enhanced Table Structure

Update the table to include sprint information:

```markdown  
| Ticket ID | Title                                     | Current Status      | Sprint Assignment | Specification File                                                                       |
| --------- | ----------------------------------------- | ------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| AB#599300 | Mars - Country of Origin Validation       | ⭐ **New**          | NIRMS Sprint 30   | [AB599300-mars-coo-validation-spec.md](AB599300-mars-coo-validation-spec.md)             |
```

### Table Row Generation

For each discovered specification file:

1. **Extract Title**: Use ADO System.Title field (more authoritative than filename)
2. **Map Status**: Apply status mapping based on System.State
3. **Parse Sprint**: Extract sprint name from System.IterationPath
4. **Generate Link**: Create relative link to specification file
5. **Format Row**: Apply consistent markdown table formatting

## Processing Workflow

Execute this systematic approach:

### **PHASE 1: SPECIFICATION FILE DISCOVERY**

1. **Scan CoO Directory**: List all files matching pattern `AB*-*-coo-validation-spec.md`
2. **Extract Ticket Numbers**: Parse ticket numbers from filenames using regex `AB(\d+)-`
3. **Extract Trader Names**: Parse trader names from filenames for correlation
4. **Validate Files**: Ensure files exist and are readable
5. **Create File Mapping**: Map ticket numbers to specification files

### **PHASE 2: ADO DATA RETRIEVAL**

6. **Batch Work Item Request**: Retrieve all work items in single batch request
7. **Extract Status Information**: Parse state, title, and assignment data
8. **Extract Sprint Information**: Parse iteration path to get sprint name
9. **Handle Missing Items**: Identify specification files without corresponding ADO tickets
10. **Validate Data Completeness**: Ensure all required fields are present

### **PHASE 3: TABLE GENERATION AND UPDATE**

11. **Sort Entries**: Order by sprint assignment (chronological order: Sprint 27, 29, 30, etc.), then by ticket ID within each sprint for consistency
    - **Primary Sort**: Sprint number (ascending chronological order for better project timeline visibility)
    - **Secondary Sort**: Ticket ID (numeric sort within each sprint for consistency)
    - **Rationale**: Sprint-based ordering provides stakeholders with clear project timeline view and sprint workload distribution
12. **Generate Table Rows**: Create markdown table rows with updated information
13. **Apply Status Icons**: Use consistent status icon mapping
14. **Format Sprint Names**: Standardize sprint name formatting
15. **Update Overview.md**: Replace existing table with updated version
16. **Preserve Other Content**: Maintain all other Overview.md content unchanged

## Error Handling Framework

### Missing ADO Tickets

Handle cases where specification files exist but ADO tickets don't:

```markdown
| AB#591999 | [File Only] Giovanni 2 - CoO Validation | ⚠️ **Needs Sync**  | Not Found         | [AB591999-giovanni2-coo-validation-spec.md](AB591999-giovanni2-coo-validation-spec.md) |
```

### Missing Specification Files

Handle cases where ADO tickets exist but specification files are missing:

```markdown
| AB#592001 | Tesco 2 - Country of Origin Validation  | 🔄 **In Progress**  | NIRMS Sprint 31   | *Specification pending* |
```

### Data Validation

- **Ticket Number Format**: Validate all ticket numbers follow AB#NNNNNN pattern
- **File Name Consistency**: Ensure specification filenames match ticket numbers
- **Status Consistency**: Verify status mappings are applied correctly
- **Sprint Parsing**: Validate sprint names are extracted properly from iteration paths

## Content Preservation

### Overview.md Structure

Preserve all existing Overview.md content except the "Trader Specifications" table:

- **Header sections** (Overview, Implementation Architecture, etc.)
- **Core Components** documentation
- **Configuration Pattern** examples
- **Foundation Work Item** reference
- **Implementation Notes** section
- **Testing Strategy** section
- **Next Steps** section

### Table Replacement Strategy

1. **Locate Table**: Find existing table using markdown table syntax detection
2. **Preserve Headers**: Maintain table structure with new Sprint Assignment column
3. **Replace Rows**: Replace all data rows with updated information
4. **Maintain Formatting**: Keep consistent markdown table formatting
5. **Validate Result**: Ensure updated table renders correctly

## Success Criteria

1. **Complete File Discovery**: All CoO specification files identified and analyzed
2. **Accurate ADO Integration**: Real-time status and sprint information retrieved
3. **Consistent Status Mapping**: All ADO states mapped to appropriate status icons
4. **Enhanced Table Structure**: Sprint assignment column added with proper data
5. **Data Synchronization**: All table entries reflect current ADO work item status
6. **Content Preservation**: All other Overview.md content maintained unchanged
7. **Error Handling**: Missing tickets or files handled gracefully with appropriate indicators
8. **Sprint-Based Ordering**: Table ordered chronologically by sprint for improved project timeline visibility and workload distribution understanding

## Usage Examples

### Standard Execution
```
Input: Analyze .spec/coo/ directory and update Overview.md table
Process: Discover 7 specification files, retrieve ADO status for tickets, update table
Output: Enhanced table with current status and sprint assignments
```

### With Missing Tickets
```
Input: Specification file exists but ADO ticket not found
Process: Mark with "⚠️ Needs Sync" status and "Not Found" sprint
Output: Table entry highlighting sync issue for follow-up
```

### With New Sprint Assignments
```
Input: ADO tickets moved to new sprint iteration
Process: Parse new iteration path and update sprint column
Output: Table reflects current sprint assignments accurately
```

## Implementation Notes

- **Azure DevOps Integration**: Use ADO MCP tools for work item retrieval and batch operations
- **File System Access**: Use file listing and content reading tools for specification file discovery
- **Markdown Processing**: Apply proper markdown table formatting for Overview.md updates
- **Real-time Data**: Ensure status information reflects current ADO state at execution time
- **Performance Optimization**: Use batch APIs to minimize ADO API calls
- **Data Validation**: Implement comprehensive validation for all extracted data

## File Structure Context

Based on existing CoO specifications directory:

```
.spec/coo/
├── AB591514-asda3-coo-validation-spec.md         → Ticket: 591514
├── AB591516-bandm-coo-validation-spec.md          → Ticket: 591516  
├── AB591527-giovanni1-coo-validation-spec.md      → Ticket: 591527
├── AB591532-kepak-coo-validation-spec.md          → Ticket: 591532
├── AB591539-sainsburys-coo-validation-spec.md     → Ticket: 591539
├── AB591540-savers-coo-validation-spec.md         → Ticket: 591540
├── AB599300-mars-coo-validation-spec.md           → Ticket: 599300
└── Overview.md                                      → Target for update
```

## Quality Assurance

Before completing the table update:

1. **Verify File Discovery**: All specification files discovered and ticket numbers extracted
2. **Validate ADO Data**: All work items retrieved successfully with complete data
3. **Check Status Mapping**: All ADO states mapped to appropriate status icons
4. **Confirm Sprint Parsing**: Sprint names extracted correctly from iteration paths
5. **Test Table Format**: Updated table renders correctly in markdown
6. **Preserve Content**: All other Overview.md sections maintained unchanged
7. **Validate Links**: All specification file links point to correct files

---

**Prompt Objective**: Maintain an accurate, real-time synchronized table of Country of Origin validation specifications with their corresponding Azure DevOps work item status and sprint assignments, providing stakeholders with current project visibility and tracking capabilities.
````
