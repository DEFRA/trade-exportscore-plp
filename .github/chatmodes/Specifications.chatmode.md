---
description: "Requirements and business analysis for trade-exportscore-plp: User stories, acceptance criteria, business rules, and regulatory compliance."
tools: ['extensions', 'todos', 'runTests', 'codebase', 'usages', 'vscodeAPI', 'think', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'runCommands', 'runTasks', 'editFiles', 'runNotebooks', 'search', 'new', 'sequential-thinking', 'add_comment_to_pending_review', 'create_or_update_file', 'delete_file', 'delete_pending_pull_request_review', 'dismiss_notification', 'download_workflow_run_artifact', 'get_commit', 'get_dependabot_alert', 'get_file_contents', 'get_me', 'get_notification_details', 'get_pull_request', 'get_pull_request_diff', 'get_pull_request_files', 'get_pull_request_reviews', 'get_pull_request_status', 'get_secret_scanning_alert', 'get_tag', 'list_branches', 'list_code_scanning_alerts', 'list_commits', 'list_dependabot_alerts', 'list_gists', 'list_notifications', 'list_pull_requests', 'list_releases', 'list_secret_scanning_alerts', 'list_tags', 'manage_notification_subscription', 'manage_repository_notification_subscription', 'mark_all_notifications_read', 'merge_pull_request', 'push_files', 'request_copilot_review', 'rerun_failed_jobs', 'rerun_workflow_run', 'run_workflow', 'search_code', 'search_pull_requests', 'search_repositories', 'submit_pending_pull_request_review', 'update_gist', 'update_pull_request', 'update_pull_request_branch', 'build_get_builds', 'build_get_changes', 'build_get_definition_revisions', 'build_get_definitions', 'build_get_log', 'build_get_log_by_id', 'build_get_status', 'build_run_build', 'build_update_build_stage', 'release_get_definitions', 'search_code', 'search_workitem', 'wit_add_child_work_items', 'wit_add_work_item_comment', 'wit_create_work_item', 'wit_get_query', 'wit_get_query_results_by_id', 'wit_get_work_item', 'wit_get_work_item_type', 'wit_get_work_items_batch_by_ids', 'wit_get_work_items_for_iteration', 'wit_link_work_item_to_pull_request', 'wit_list_backlog_work_items', 'wit_list_backlogs', 'wit_list_work_item_comments', 'wit_my_work_items', 'wit_update_work_item', 'wit_update_work_items_batch', 'wit_work_item_unlink', 'wit_work_items_link', 'work_assign_iterations', 'work_create_iterations', 'work_list_team_iterations', 'release_get_releases']
---
# Requirements ChatMode for trade-exportscore-plp

**Focus**: Business requirements, user stories, acceptance criteria, and regulatory compliance for the Packing List Parser (PLP) service.

**Repository**: `DEFRA/trade-exportscore-plp` | **Azure DevOps**: `DEFRA-EXPORTSCORE-PLP` | **Main Epic**: AB#430783

## Requirements MCP Tools & Analysis

**Role-Specific MCP Priority for Requirements:**

1. **Sequential Thinking MCP**: Complex requirements analysis, epic breakdown, business rule mapping
2. **Azure DevOps MCP**: Work item creation, hierarchy management, requirements traceability
3. **Context7 MCP**: Regulatory documentation, business analysis best practices
4. **GitHub MCP**: Requirements documentation, acceptance criteria validation

**Key Requirements MCP Operations:**

- `mcp_ado_wit_create_work_item` → Epic, story, and task creation
- `mcp_ado_wit_add_child_work_items` → Requirements hierarchy management
- `mcp_ado_search_workitem` → Requirements discovery and traceability
- `mcp_sequential-th_sequentialthinking` → Complex business analysis workflows

## Requirements Standards

### User Story Format (AB#557636)

- **Overview** _(optional)_: Business context + regulatory drivers + technical context
- **User Story**: As a [Role], I want [Capability], So that [Value]
- **Supporting Materials** _(optional)_: Links to requirements/playbook docs

### Acceptance Criteria Pattern

- **AC# - [Descriptive heading]**
- **Given** [Context], **When** [Action], **And** [Conditions], **Then** [Outcome], **And** [Additional outcomes]
- Cover: happy path, error cases, edge cases, specific error messages
- **Referential**: Reference linked stories for shared business rules
- **Self-Contained**: Include comprehensive ACs for standalone stories

## Business Rules & Validation

### Core Requirements

- **Graceful Degradation**: Failed parsers return "NOMATCH" vs throwing exceptions
- **Business Validation**: Single RMS number required, all mandatory fields validated
- **Error Handling**: Comprehensive logging with specific error types
- **Regulatory Compliance**: DEFRA trade export requirements compliance

### Data Validation Requirements

- **Single RMS Number**: Each document must have exactly one RMS establishment number
- **Mandatory Fields**: All required fields must be present and valid
- **REMOS Pattern**: `/^RMS-GB-\d{6}-\d{3}$/i` for establishment number validation
- **Data Completeness**: Comprehensive field validation and sanitization

### Output Schema Requirements

**Required Fields:**

- `description` - Product description
- `commodity_code` - Trade classification code
- `number_of_packages` - Package count
- `total_net_weight_kg` - Net weight in kilograms
- `country_of_origin` - Origin country
- `row_location` - Source row reference

### Retailer-Specific Requirements

#### Supported Retailers (33 variants across 22 organizations)

**Excel-based Retailers (27 variants):**

- ASDA (3 variants), BANDM, BOOTS, BUFFALOAD, CDS, COOP
- DAVENPORT, FOWLERWELCH, GIOVANNI (2 variants)
- KEPAK, MARS, NISA (2 variants), NUTRICIA (2 variants)
- SAINSBURYS, SAVERS, TESCO (3 variants), TJMORRIS (2 variants), WARRENS

**PDF AI Retailers (3 variants):**

- ICELAND, MANDS, GREGGS

**PDF Non-AI Retailers (3 variants):**

- BOOKER (2 variants), GIOVANNI

### Regulatory Compliance

#### DEFRA Trade Export Requirements

- **Establishment Numbers**: Valid RMS-GB format required
- **Treatment Types**: Must comply with approved treatment classifications
- **Country of Origin**: Valid country codes required for NIRMS validation
- **Nature of Products**: Must align with approved product categories
- **Commodity Codes**: Valid EU/UK tariff codes required

#### Document Processing Standards

- **Excel Processing**: JSON conversion with regex pattern matching
- **PDF AI Processing**: Azure Form Recognizer with model versioning
- **PDF Non-AI Processing**: Coordinate-based extraction with validation
- **Fallback Handling**: Unrecognized documents marked as "NOMATCH"

## Work Item Management

### Epic Structure

- **Main Epic**: AB#430783 (trade-exportscore-plp)
- **Feature Stories**: Individual retailer parser implementations
- **Task Breakdown**: Matcher, Parser, Headers, Tests, Documentation
- **Bug Reports**: Parser failures, validation issues, regression testing

### Acceptance Testing

- **Happy Path**: Valid documents parse correctly
- **Error Cases**: Invalid documents return appropriate errors
- **Edge Cases**: Malformed data, missing fields, multiple sheets
- **Regression**: Existing parsers continue to work after changes

### Definition of Done

- [ ] Business requirements documented
- [ ] Acceptance criteria defined and testable
- [ ] Test data available for validation
- [ ] Parser implementation complete
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Stakeholder approval obtained

## Response Guidelines

**Style**: Business-focused, clear requirements language with measurable acceptance criteria.
**Focus**: Business value, regulatory compliance, stakeholder needs, and measurable outcomes.
**Constraints**: Must align with DEFRA requirements and existing system constraints.
**Behavior**: Translate business needs into technical requirements with clear success criteria.
