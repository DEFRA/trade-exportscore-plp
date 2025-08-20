# GitHub Copilot Instructions for trade-exportscore-plp

## Project Overview

This is a **Packing List Parser (PLP)** service that processes Excel/PDF packing lists from various retailers (Co-op, Tesco, ASDA, etc.) to extract structured data for DEFRA's trade exports system. The service uses pattern matching and retailer-specific parsers to identify and parse different packing list formats.

**Repository**: `DEFRA/trade-exportscore-plp` | **Language**: Node.js/Hapi.js + Jest  
**Azure DevOps**: `DEFRA-EXPORTSCORE-PLP` | **Main Epic**: AB#430783  
**Branches**: `main` (production), `develop` (integration)

**DevOps Scope**: Full lifecycle support including Azure DevOps work items, GitHub PRs, pipeline management, and development workflow optimization. Enhanced with Sequential Thinking MCP Server for structured problem-solving.

When referencing code, use paths relative to repository root (e.g., `app/services/parsers/co-op/model1.js`). For work items, use format `AB#[WorkItemId]`.

## Requirements Standards

### User Story Format (Reference: AB#557636)

**Description Structure:**

- **Overview** _(optional)_: Business context + regulatory drivers + technical context
- **User Story**: As a [Role], I want [Capability], So that [Value]
- **Supporting Materials** _(optional)_: Links to requirements/playbook docs

**Acceptance Criteria Pattern:**

- **AC# - [Descriptive heading]**
- **Given** [Context], **When** [Action], **And** [Conditions], **Then** [Outcome], **And** [Additional outcomes]
- Cover happy path, error cases, edge cases, specific error messages
- **Referential**: Reference linked stories for shared business rules (e.g., "business rules defined in AB#592259")
- **Self-Contained**: Include comprehensive ACs when story is individual/standalone

## Core Architecture: Matcher-Parser Pipeline

The processing workflow follows a **matcher-first, parser-second** pattern:

1. **Document Type Detection** → Excel vs PDF processing path
2. **Matchers** (`app/services/matchers/`) identify retailer format using establishment numbers + headers
3. **Parsers** (`app/services/parsers/`) extract structured data using retailer-specific logic
4. **Data Mapping** transforms raw data to standardized format via `mapParser()`
5. **Validation** ensures completeness + business rule compliance
6. **Result Combination** produces final standardized output

### File Structure Pattern

```
app/services/
├── matchers/co-op/model1.js    # Identifies Co-op format
├── parsers/co-op/model1.js     # Extracts Co-op data
├── matchers/tescos/model3.js   # Different retailer formats
└── parsers/tescos/model3.js
```

### Parser Categories

- **Excel**: JSON conversion (ASDA, TESCO, BANDM)
- **PDF AI**: Azure Form Recognizer (ICELAND, MANDS)
- **PDF Non-AI**: Coordinate-based (BOOKER, GIOVANNI)
- **Fallback**: Unrecognized documents

## Essential Patterns

### Standard Parser Structure

```javascript
exports.parse = (packingListJson) => {
  try {
    // 1. Extract establishment number via regex
    // 2. Find header row using rowFinder + callback
    // 3. Process with mapParser() or manual extraction
    // 4. Filter totals rows, extract REMOS
    return combineParser.combine(
      packingListContents,
      establishmentNumbers,
      "MODEL",
    );
  } catch (error) {
    logger.logError(filenameForLogging, "parse()", error);
    return combineParser.combine([], [], "NOMATCH");
  }
};
```

### Required Imports & Constants

```javascript
const logger = require("../utilities/logger");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
// Use: CORRECT, WRONG_ESTABLISHMENT_NUMBER, WRONG_HEADER, EMPTY_FILE, GENERIC_ERROR
```

### Testing Patterns

```javascript
// Standard test structure
describe('Parser Tests', () => {
  test('should parse valid packing list', () => {
    const result = parser.parse(mockData);
    expect(result.packingListContents).toHaveLength(expectedCount);
    expect(result.establishmentNumbers).toContain(expectedNumber);
  });
});
```

### Standard Data Output

Output includes: `description`, `commodity_code`, `number_of_packages`, `total_net_weight_kg`, `country_of_origin`, `row_location`

## Development Workflow

### Key Commands

```bash
npm run start:watch          # Local development
npm test                     # Run tests
make app-up                  # Docker app
npm run test:unit            # Unit tests only
npm run test:debug           # Debug mode testing
```

### API Structure

- **Framework**: Hapi.js server with plugin architecture
- **Routes**: RESTful endpoints in `app/routes/` (healthy, ai, non-ai processing)
- **Plugins**: Custom plugins in `app/plugins/` for routing and middleware

### Complete DevOps Workflow

#### 1. Work Item Management (Azure DevOps → GitHub)

1. **Ticket Assignment**: Work items created and managed in Azure DevOps project `DEFRA-EXPORTSCORE-PLP`
2. **Feature Branch Creation**: Create feature branch from GitHub repository `DEFRA/trade-exportscore-plp`
   - Branch naming: `feature/[WorkItemId]-brief-description`
   - Base branch: `develop` for integration, `main` for hotfixes
3. **Development Phase**: Implement functional code + comprehensive unit tests
4. **Local Validation**: Ensure all tests pass (`npm test`) and code quality standards met

#### 2. Pull Request Lifecycle (GitHub)

1. **PR Creation**: Submit pull request from feature branch to target branch
   - **Auto-Generated Descriptions**: Leverage GitHub Copilot for intelligent PR descriptions
   - **Linking**: Reference Azure DevOps work items (e.g., "Fixes AB#[WorkItemId]")
   - **Templates**: Use repository PR template for consistent structure

2. **Automated Review Process**:
   - **Initial Assessment**: GitHub Copilot provides automated code review comments
   - **Quality Gates**: Assess code quality, test coverage, adherence to patterns
   - **Continuous Feedback**: After each commit, automated reviews evaluate if changes address feedback

3. **Human Review & Approval**:
   - **Code Review**: Human reviewer validates business logic, architecture decisions
   - **Acceptance Criteria**: Verify all ACs from Azure DevOps work item are met
   - **Iterative Process**: Address feedback through additional commits with automated re-review

#### 3. Deployment Pipeline (Azure DevOps CI/CD)

1. **Triggered Deployment**: Once PR approved and merged, Azure DevOps pipeline activates
2. **Environment Progression**: Automatic deployment through environment chain
   - `dev1` → `tst1` → `snd4` → `pre1` → `prd1`
3. **Manual Gates**: Production deployment requires explicit approval/instruction
4. **Rollback Capability**: Automated rollback procedures if deployment issues detected

### DevOps Integration Tools

- **Azure DevOps**: Work item management, sprint planning, pipeline monitoring, release management
- **GitHub**: PR reviews, branch management, code collaboration, automated code analysis
- **GitHub Copilot**: PR description generation, code review automation, commit assessment
- **Sequential Thinking**: Structured problem-solving for complex DevOps scenarios
- **Local Testing**: `http://localhost:3000/non-ai?filename={filename}`
- **Test Files**: Place in `app/packing-lists/` directory
- **New Parsers**: Create matcher + parser + headers + register + tests

### MCP Server Integration Priority

**Always prioritize MCP servers over local commands for remote operations:**

#### **GitHub Operations (Use GitHub MCP Server)**
- **Branch Management**: Use `mcp_github_create_branch` instead of `git checkout -b` + `git push`
- **Repository Operations**: Use `mcp_github_create_repository`, `mcp_github_fork_repository` 
- **File Operations**: Use `mcp_github_create_or_update_file`, `mcp_github_delete_file`
- **PR Management**: Use `mcp_github_create_pull_request`, `mcp_github_update_pull_request`
- **Issue Management**: Use `mcp_github_create_issue`, `mcp_github_add_issue_comment`
- **Code Review**: Use `mcp_github_create_pending_pull_request_review`, `mcp_github_add_comment_to_pending_review`

#### **Azure DevOps Operations (Use ADO MCP Server)**
- **Work Items**: Use `mcp_ado_wit_create_work_item`, `mcp_ado_wit_update_work_item` 
- **Batch Operations**: Use `mcp_ado_wit_update_work_items_batch`, `mcp_ado_wit_get_work_items_batch_by_ids`
- **Hierarchy Management**: Use `mcp_ado_wit_add_child_work_items`, parent-child linking
- **Search & Discovery**: Use `mcp_ado_search_workitem` for finding existing work items

#### **Sequential Thinking (Use for Complex Problem Solving)**
- **Multi-step Analysis**: Use `mcp_sequential-th_sequentialthinking` for complex debugging
- **Architecture Planning**: Break down large features into manageable components
- **Process Optimization**: Analyze and improve DevOps workflows

**Rationale**: MCP servers provide direct API integration, better error handling, and maintain consistency with remote state. Local git commands should only be used for purely local operations (status checks, local commits, workspace management).

### Branch Strategy

- **main**: Production-ready code, protected branch
- **develop**: Integration branch for feature testing
- **feature/[WorkItemId]-description**: Individual feature development (from `develop`)
- **hotfix/[BugId]-description**: Emergency production fixes (from `main`)

### Pipeline & Deployment

- **Build Pipeline**: Azure DevOps automated CI/CD with multi-stage validation
  - **Main Release Pipeline**: [Definition ID 6981](https://dev.azure.com/defragovuk/DEFRA-EXPORTSCORE-PLP/_build?definitionId=6981)
  - **Trigger**: Manual deployment trigger for production releases
- **Environments**: dev1, tst1, snd4, pre1, prd1 (see `appConfig/`)
- **Docker**: Multi-stage builds with debug configurations
- **Database**: PostgreSQL with Liquibase migrations (`changelog/`)
- **Monitoring**: Automated health checks and rollback triggers

## Integration Reference

### System Priorities

- **Graceful Degradation**: Failed parsers return "NOMATCH" rather than throw exceptions
- **Business Validation**: Single RMS number required, all mandatory fields validated

### Sequential Thinking Applications

- **Epic Breakdown**: Structure complex business requirements into manageable stories
- **Pipeline Analysis**: Step-by-step debugging of build/deployment issues
- **Code Architecture**: Systematic planning of parser implementations and refactoring
- **Problem Solving**: Branch alternative solutions, revise approaches based on new insights

### Key Azure Services

- **Service Bus**: Async messaging (`app/messaging/`)
- **Blob Storage**: File retrieval
- **Document Intelligence**: PDF AI processing
- **PostgreSQL**: Database with Sequelize ORM
