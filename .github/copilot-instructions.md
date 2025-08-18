# GitHub Copilot Instructions for trade-exportscore-plp

## Project Overview

This is a **Packing List Parser (PLP)** service that processes Excel/PDF packing lists from various retailers (Co-op, Tesco, ASDA, etc.) to extract structured data for DEFRA's trade exports system. The service uses pattern matching and retailer-specific parsers to identify and parse different packing list formats.

**Repository**: `DEFRA/trade-exportscore-plp` | **Language**: Node.js/JavaScript + Jest  
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

### Standard Data Output

Output includes: `description`, `commodity_code`, `number_of_packages`, `total_net_weight_kg`, `country_of_origin`, `row_location`

## Development Workflow

### Key Commands

```bash
npm run start:watch          # Local development
npm test                     # Run tests
make app-up                  # Docker app
```

### DevOps Integration

- **Azure DevOps**: Work item management, sprint planning, pipeline monitoring
- **GitHub**: PR reviews, branch management, code collaboration
- **Sequential Thinking**: Structured problem-solving for complex DevOps scenarios
- **Local Testing**: `http://localhost:3000/non-ai?filename={filename}`
- **Test Files**: Place in `app/packing-lists/` directory
- **New Parsers**: Create matcher + parser + headers + register + tests

### Pipeline & Deployment

- **Build Pipeline**: Azure DevOps automated CI/CD
- **Environments**: dev1, tst1, snd4, pre1, prd1 (see `appConfig/`)
- **Docker**: Multi-stage builds with debug configurations
- **Database**: PostgreSQL with Liquibase migrations (`changelog/`)

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
