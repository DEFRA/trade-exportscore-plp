# GitHub Copilot Instructions for trade-exportscore-plp

## Project Overview

**Packing List Parser (PLP)** service processing Excel/PDF packing lists from retailers (Co-op, Tesco, ASDA, etc.) to extract structured data for DEFRA's trade exports system using pattern matching and retailer-specific parsers.

**Repository**: `DEFRA/trade-exportscore-plp` | **Stack**: Node.js/Hapi.js + Jest + PostgreSQL  
**Azure DevOps**: `DEFRA-EXPORTSCORE-PLP` | **Main Epic**: AB#430783  
**Branches**: `main` (production), `develop` (integration)

_Reference paths relative to repository root (e.g., `app/services/parsers/co-op/model1.js`). Work items format: `AB#[WorkItemId]`._

## MCP Server Integration

### Tool Hierarchy (Universal Priority Order)

**Always prioritize MCP servers over local commands for remote operations:**

1. **Sequential Thinking MCP**: Complex problem-solving and architecture planning
2. **Context7 MCP**: Library documentation and current best practices
3. **GitHub MCP**: Repository operations, PRs, issues, reviews
4. **Azure DevOps MCP**: Work items, batch operations, hierarchy management
5. **Excel MCP**: Excel file processing, data manipulation, bulk operations

_Note: Each chatmode provides role-specific MCP tool guidance building on this foundation._

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

## Project Infrastructure

### Technology Stack

- **Framework**: Hapi.js with plugin architecture
- **Database**: PostgreSQL + Sequelize ORM + Liquibase migrations
- **Containerization**: Docker multi-stage builds
- **Cloud**: Azure Service Bus, Blob Storage, Document Intelligence
- **Testing**: Jest with coverage reporting
- **Monitoring**: Automated health checks + rollback triggers

### Azure Services Dependencies

- **Document Intelligence**: `@azure/ai-form-recognizer` for PDF AI parsing
- **Service Bus**: `@azure/service-bus` for messaging (PLP topic/subscription)
- **Blob Storage**: `@azure/storage-blob` for file operations
- **Identity**: `@azure/identity` with DefaultAzureCredential for authentication

### Environment Configuration

- **Structure**: `appConfig.yaml` (base) + environment-specific overrides
- **Environments**: dev1, tst1, snd4, pre1, prd1
- **Key Patterns**: PostgreSQL settings, Azure Service Bus, Dynamics, KeyVault references
- **Format**: YAML key-value with optional KeyVault type specification

## Development Patterns

### Core Requirements

- **Graceful Degradation**: Failed parsers return "NOMATCH" vs throwing exceptions
- **Business Validation**: Single RMS number required, all mandatory fields validated
- **Error Handling**: Comprehensive logging with specific error types
- **Testing**: Unit tests for all parsers with mock data and edge cases

## Comments Format

To keep comments consistent across the codebase use the following conventions:

- **Module header**: Every module should start with a short header comment describing its purpose and any important behavioural notes. Prefer a JSDoc-style block for modules that export multiple utilities, for example:
 - **Module header**: Every module should start with a short header comment describing its purpose and any important behavioural notes. Prefer a JSDoc-style block for modules that export multiple utilities, for example:

  ```javascript
  /**
   * CSV utility wrapper
   *
   * Provides a minimal helper to convert CSV content into an array of rows
   * using `csv-parse`. Accepts `Buffer`, `Readable` or filename inputs.
   */
  ```

  Important: the module header must appear before any `require` or `import` statements.
  Use this minimal template at the top of files:

  ```javascript
  /**
   * Module purpose - short summary.
   *
   * Additional behavioural notes (side-effects, exported helpers, testing hints).
   */
  const dep = require('path/to/dep');
  ```

- **Function JSDoc**: Exported or non-trivial functions should include a small JSDoc block with `@param` and `@returns` where helpful. Keep types simple (e.g., `Array`, `Object`, `string`). Example:

  ```javascript
  /**
   * Convert CSV input to an array of records.
   * @param {Buffer|string|Readable} bufferOrFilename - CSV source
   * @returns {Promise<Array>} rows - Array of row arrays
   */
  ```

- **Inline comments**: Use short, focused inline comments to explain non-obvious behaviour, assumptions, or why a particular transformation is safe. Keep them concise (one or two lines) and place them immediately above the code they describe.

- **Error logging**: When a function logs an error, include the module-local `filenameForLogging` and the specific function name to keep logs consistent.

- **Tone & style**: Use English, present tense, and active voice. Prefer clarity over cleverness.

Keeping comments uniform makes it easier for future contributors and automated tools (linters, documentation generators) to surface useful information.

**Require JSDoc For All Functions**

All functions in the repository — exported functions and non-trivial helpers — must include a JSDoc block immediately above the function declaration. This helps IDEs, reviewers and automated tools understand intent and types. Use the following minimal template for consistency:

```javascript
/**
 * Short description of the function purpose.
 * @param {Type} argName - Short arg description
 * @param {Type} other - Short arg description
 * @returns {Type} description of return value
 */
function example(argName, other) { ... }
```

### Testing Standards (PLP-Specific)

- **Jest Configuration**: Coverage with cobertura/lcov output to `test-output/`
- **Test Structure**: `test/unit/` and `test/integration/` directories
- **Parser Test Pattern**:
  - Import parser + logger + test data + expected results
  - Test cases: validModel, emptyModel, multiple sheets, error handling
  - Logger spy pattern: `jest.spyOn(logger, "logError")` validation
- **Mock Patterns**: Extensive mocking of Azure services, databases
- **Commands**: `npm test`, `npm run test:unit`, `npm run test:debug`

### Key Project Commands

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

### PLP-Specific File Structure

```
app/
├── services/
│   ├── matchers/           # Document type detection
│   ├── parsers/           # Retailer-specific parsers
│   │   └── [retailer]/    # Each retailer has own folder
│   └── utilities/         # Shared utilities (regex.js)
├── models/                # Database models
├── messaging/             # Azure Service Bus integration
└── routes/                # API endpoints

test/
├── unit/services/parser-service/[retailer]/  # Parser tests
└── unit/test-data-and-results/               # Test data
```
