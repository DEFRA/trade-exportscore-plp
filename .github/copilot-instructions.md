# GitHub Copilot Instructions for trade-exportscore-plp

## Project Overview

**Packing List Parser (PLP)** service processing Excel/PDF packing lists from retailers (Co-op, Tesco, ASDA, etc.) to extract structured data for DEFRA's trade exports system using pattern matching and retailer-specific parsers.

**Repository**: `DEFRA/trade-exportscore-plp` | **Stack**: Node.js/Hapi.js + Jest + PostgreSQL  
**Azure DevOps**: `DEFRA-EXPORTSCORE-PLP` | **Main Epic**: AB#430783  
**Branches**: `main` (production), `develop` (integration)

**DevOps Scope**: Full agentic lifecycle with Azure DevOps work items, GitHub PRs, automated pipelines, and MCP server integration.

_Reference paths relative to repository root (e.g., `app/services/parsers/co-op/model1.js`). Work items format: `AB#[WorkItemId]`._

## Core Architecture

### Matcher-Parser Pipeline

1. **Document Detection** → Excel vs PDF path
2. **Matchers** (`app/services/matchers/`) → Identify retailer format via establishment numbers + headers
3. **Parsers** (`app/services/parsers/`) → Extract structured data via retailer-specific logic
4. **Data Mapping** → Transform to standardized format via `mapParser()`
5. **Validation** → Business rule compliance + completeness check
6. **Result Combination** → Final standardized output

### Parser Categories

- **Excel**: JSON conversion (ASDA, TESCO, BANDM)
- **PDF AI**: Azure Form Recognizer (ICELAND, MANDS)
- **PDF Non-AI**: Coordinate-based (BOOKER, GIOVANNI)
- **Fallback**: Unrecognized documents → "NOMATCH"

### Standard Implementation Pattern

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

**Output Schema**: `description`, `commodity_code`, `number_of_packages`, `total_net_weight_kg`, `country_of_origin`, `row_location`

### Header Matching System (model-headers.js)

- **Structure**: Each retailer has establishmentNumber regex + field mapping regex patterns
- **Pattern**: `RETAILER1/RETAILER2` variants with specific regex for each format
- **Example**: ASDA1/ASDA2 with different header patterns but same establishment number
- **Field Mappings**: description, nature_of_products, type_of_treatment, number_of_packages, total_net_weight_kg
- **REMOS Pattern**: `/^RMS-GB-\d{6}-\d{3}$/i` for establishment number validation

### Regex Utilities (app/utilities/regex.js)

- **Core Functions**: `test()`, `findMatch()`, `testAllPatterns()`, `findAllMatches()`
- **Usage**: Property-based regex matching across object arrays
- **Pattern**: Skip inherited properties, match string values only

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

## Agentic DevOps Workflow

### Tool Integration Hierarchy

**Always prioritize MCP servers over local commands for remote operations:**

1. **Context7 MCP**: Library documentation and current best practices
2. **GitHub MCP**: Repository operations, PRs, issues, reviews
3. **Azure DevOps MCP**: Work items, batch operations, hierarchy management
4. **Sequential Thinking MCP**: Complex problem-solving and architecture planning

### Context7 Integration Pattern

**Before providing library-specific guidance:**

1. **Resolve Library**: `mcp_context7_resolve-library-id` to find current documentation
2. **Get Documentation**: `mcp_context7_get-library-docs` for latest patterns
3. **Apply Context**: Provide informed guidance with current examples

**Priority Libraries**: Hapi.js, Jest, Sequelize, Docker, Azure Services

### Development Lifecycle

#### 1. Work Item → Feature Branch (Agentic)

```
Azure DevOps Work Item → GitHub MCP Branch Creation
├── Branch naming: feature/[WorkItemId]-description
├── Base: develop (integration) / main (hotfixes)
└── Auto-link work item references
```

#### 2. Development → Testing (Local + CI)

```bash
npm run start:watch    # Local development
npm test              # Run full test suite
make app-up          # Docker environment
npm run test:debug   # Debug mode testing
```

#### 2.1. Pre-PR Quality Gates (Mandatory)

```bash
make prettier         # Format code (REQUIRED before PR)
npm run test:unit     # Run unit tests (MUST pass before PR)
```

#### 2.2. Version Management (Required)

```bash
```

#### 2.2. Version Management (Required)
```bash
# Check version against main branch
# Current branch version must be higher than main branch
# Example: main=6.20.5 → current branch=6.20.6+
# ALWAYS ask user confirmation before incrementing version
# Update both package.json and package-lock.json
```

#### 2.3. Git Operations (Required Sequence)
```bash
git add .                    # Add ALL changes (not selective files)
git commit -m "message"      # Commit with comprehensive message
git push origin <branch>     # Push to remote (NEVER forget this step)
```

#### 3. Pull Request Lifecycle (GitHub MCP)
```
Feature Branch → Pre-PR Quality Gates → Version Check → Git Operations → PR Creation → Initial Review → Human Approval → Merge
├── MANDATORY: make prettier (code formatting)
├── MANDATORY: npm run test:unit (unit tests must pass)
├── MANDATORY: Version increment check vs main branch (with user confirmation)
├── MANDATORY: git add . (add ALL changes)
├── MANDATORY: git push origin <branch> (push to remote)
├── MANDATORY: Initial PR review after creation
├── Auto-generated descriptions (GitHub Copilot)
├── Work item linking (AB#[WorkItemId])
├── Continuous feedback on commits
└── Acceptance criteria validation
```
```

#### 3. Pull Request Lifecycle (GitHub MCP)

```
Feature Branch → Pre-PR Quality Gates → Version Check → PR Creation → Automated Review → Human Approval → Merge
├── MANDATORY: make prettier (code formatting)
├── MANDATORY: npm run test:unit (unit tests must pass)
├── MANDATORY: Version increment check vs main branch (with user confirmation)
├── Auto-generated descriptions (GitHub Copilot)
├── Work item linking (AB#[WorkItemId])
├── Continuous feedback on commits
└── Acceptance criteria validation
```

#### 4. Deployment Pipeline (Azure DevOps)

```
Merge → Trigger → Environment Chain → Production Gate
dev1 → tst1 → snd4 → pre1 → prd1
├── Automated progression
├── Manual production approval
└── Rollback capability
```

### Key Commands & Endpoints

```bash
# Development
npm run start:watch          # Local development
npm test                     # Run tests
make app-up                  # Docker app

# Testing
npm run test:unit            # Unit tests only
npm run test:debug           # Debug mode
http://localhost:3000/non-ai?filename={filename}  # Local testing

# Database & Docker (makefile)
make db-up                   # Database with migrations
make db-down                 # Stop database
make app-build               # Build Docker image
make prettier                # Code formatting
make tests                   # Run via scripts/test

# New Parser Creation
# 1. Create matcher + parser + headers
# 2. Register in system
# 3. Add comprehensive tests
# 4. Place test files in app/packing-lists/
```

### Branch Strategy

- **main**: Production-ready, protected
- **develop**: Integration branch
- **feature/[WorkItemId]-description**: Individual development
- **hotfix/[BugId]-description**: Emergency fixes

### Infrastructure

- **Framework**: Hapi.js with plugin architecture
- **Database**: PostgreSQL + Sequelize ORM + Liquibase migrations
- **Containerization**: Docker multi-stage builds
- **Cloud**: Azure Service Bus, Blob Storage, Document Intelligence
- **Monitoring**: Automated health checks + rollback triggers

### Azure Services (Actual Dependencies)

- **Document Intelligence**: `@azure/ai-form-recognizer` for PDF AI parsing
- **Service Bus**: `@azure/service-bus` for messaging (PLP topic/subscription)
- **Blob Storage**: `@azure/storage-blob` for file operations
- **Identity**: `@azure/identity` with DefaultAzureCredential for authentication

### Environment Configuration (appConfig/)

- **Structure**: `appConfig.yaml` (base) + environment-specific overrides
- **Environments**: dev1, tst1, snd4, pre1, prd1
- **Key Patterns**: PostgreSQL settings, Azure Service Bus, Dynamics, KeyVault references
- **Format**: YAML key-value with optional KeyVault type specification

## System Principles & Best Practices

### Core Requirements

- **Graceful Degradation**: Failed parsers return "NOMATCH" vs throwing exceptions
- **Business Validation**: Single RMS number required, all mandatory fields validated
- **Error Handling**: Comprehensive logging with specific error types
- **Testing**: Unit tests for all parsers with mock data and edge cases

### Testing Standards (Actual Implementation)

- **Jest Configuration**: Coverage with cobertura/lcov output to `test-output/`
- **Test Structure**: `test/unit/` and `test/integration/` directories
- **Parser Test Pattern**:
  - Import parser + logger + test data + expected results
  - Test cases: validModel, emptyModel, multiple sheets, error handling
  - Logger spy pattern: `jest.spyOn(logger, "logError")` validation
- **Mock Patterns**: Extensive mocking of Azure services, databases
- **Commands**: `npm test`, `npm run test:unit`, `npm run test:debug`

### MCP Server Operations

#### GitHub MCP (Remote Operations)

- `mcp_github_create_branch` → Branch creation
- `mcp_github_create_pull_request` → PR management
- `mcp_github_create_or_update_file` → File operations
- `mcp_github_add_comment_to_pending_review` → Code reviews

#### Azure DevOps MCP (Work Item Management)

- `mcp_ado_wit_create_work_item` → Story/task creation
- `mcp_ado_wit_update_work_items_batch` → Bulk updates
- `mcp_ado_wit_add_child_work_items` → Hierarchy management
- `mcp_ado_search_workitem` → Discovery operations

#### Sequential Thinking MCP (Complex Analysis)

- `mcp_sequential-th_sequentialthinking` → Multi-step problem solving
- Architecture planning and epic breakdown
- Pipeline debugging and process optimization

### Context7 Documentation Priority

**Essential Libraries**: Hapi.js, Jest, Sequelize, Docker, Azure Services

**Process**: Library Resolution → Documentation Retrieval → Current Pattern Application

_Rationale: Ensure agents use current documentation and best practices vs outdated patterns_
