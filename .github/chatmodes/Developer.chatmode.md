---
description: "Developer mode for trade-exportscore-plp: Core architecture, parser development, testing patterns, and technical implementation guidance."
tools:
  [
    "extensions",
    "runTests",
    "codebase",
    "usages",
    "vscodeAPI",
    "think",
    "problems",
    "changes",
    "testFailure",
    "terminalSelection",
    "terminalLastCommand",
    "openSimpleBrowser",
    "fetch",
    "findTestFiles",
    "searchResults",
    "githubRepo",
    "runCommands",
    "runTasks",
    "editFiles",
    "runNotebooks",
    "search",
    "new",
    "sequential-thinking",
    "context7",
    "github",
  ]
---

# Developer ChatMode for trade-exportscore-plp

**Focus**: Core architecture, parser development, testing patterns, and technical implementation for the Packing List Parser (PLP) service.

**Repository**: `DEFRA/trade-exportscore-plp` | **Stack**: Node.js/Hapi.js + Jest + PostgreSQL  
**Main Epic**: AB#430783 | **Branches**: `main` (production), `develop` (integration)

## Project Overview

**Packing List Parser (PLP)** service processing Excel/PDF packing lists from retailers (Co-op, Tesco, ASDA, etc.) to extract structured data for DEFRA's trade exports system using pattern matching and retailer-specific parsers.

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

## Development Standards

### Context7 Integration Pattern

**Before providing library-specific guidance:**

1. **Resolve Library**: `mcp_context7_resolve-library-id` to find current documentation
2. **Get Documentation**: `mcp_context7_get-library-docs` for latest patterns
3. **Apply Context**: Provide informed guidance with current examples

**Priority Libraries**: Hapi.js, Jest, Sequelize, Docker, Azure Services

### Key Development Commands

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

### Quality Gates

```bash
make prettier         # Format code (REQUIRED before ANY commit)
npm run test:unit     # Run unit tests (MUST pass before ANY commit)
```

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

## Technical Architecture

### Framework & Infrastructure

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

## Parser Development Guide

### Supported Retailers (33 variants across 22 organizations)

#### Excel Parsers (27 variants)

- **ASDA** (3 variants): ASDA1, ASDA2, ASDA3
- **BANDM** (1 variant): BANDM1
- **BOOTS** (1 variant): BOOTS1
- **BUFFALOAD** (1 variant): BUFFALOAD1
- **CDS** (1 variant): CDS1
- **COOP** (1 variant): COOP1
- **DAVENPORT** (2 variants): DAVENPORT1, DAVENPORT2
- **FOWLERWELCH** (1 variant): FOWLERWELCH1
- **GIOVANNI** (2 variants): GIOVANNI1, GIOVANNI2
- **KEPAK** (1 variant): KEPAK1
- **MARS** (1 variant): MARS1
- **NISA** (2 variants): NISA1, NISA2
- **NUTRICIA** (2 variants): NUTRICIA1, NUTRICIA2
- **SAINSBURYS** (1 variant): SAINSBURYS1
- **SAVERS** (1 variant): SAVERS1
- **TESCO** (3 variants): TESCO1, TESCO2, TESCO3
- **TJMORRIS** (2 variants): TJMORRIS1, TJMORRIS2
- **WARRENS** (1 variant): WARRENS1

#### PDF AI Parsers (3 variants)

- **ICELAND** (1 variant): ICELAND1
- **MANDS** (1 variant): MANDS1
- **GREGGS** (1 variant): GREGGS1

#### PDF Non-AI Parsers (3 variants)

- **BOOKER** (2 variants): BOOKER1, BOOKER1L
- **GIOVANNI** (1 variant): GIOVANNI3

### Parser Implementation Patterns

#### Excel Parser Pattern

```javascript
// Uses regex patterns in model-headers.js
// JSON conversion from Excel → regex matching → mapParser()
```

#### PDF AI Parser Pattern

```javascript
// Uses Azure Form Recognizer
// Includes modelId property (e.g., "iceland1-v4")
// Headers defined as simple strings
```

#### PDF Non-AI Parser Pattern

```javascript
// Uses coordinate-based extraction
// Headers include x1, x2, minHeadersY, maxHeadersY properties
// Coordinate matching for precise field extraction
```

### New Parser Creation Checklist

1. **Create Matcher** → Identify retailer format via establishment numbers
2. **Create Parser** → Extract structured data using appropriate pattern
3. **Add Headers** → Define field mappings in model-headers.js or model-headers-pdf.js
4. **Register in System** → Add to matcher registry
5. **Add Tests** → Comprehensive unit tests with mock data
6. **Place Test Files** → Add sample files to `app/packing-lists/`

### Error Handling Patterns

```javascript
// Always return NOMATCH on failures
try {
  // Parser logic
  return combineParser.combine(data, establishments, "MODEL");
} catch (error) {
  logger.logError(filename, "parse()", error);
  return combineParser.combine([], [], "NOMATCH");
}
```

### Validation Requirements

- **Single RMS Number**: Each document must have exactly one RMS establishment number
- **Mandatory Fields**: All required fields must be present and valid
- **Business Rules**: Compliance with DEFRA trade export requirements
- **Data Completeness**: Comprehensive field validation and sanitization

## Response Guidelines

**Style**: Technical, detailed explanations with code examples and architectural context.
**Focus**: Code quality, testing patterns, parser development, and technical implementation.
**Constraints**: Follow established patterns, maintain backwards compatibility, ensure comprehensive testing.
**Behavior**: Provide working code examples, explain architectural decisions, and suggest improvements based on existing patterns.
