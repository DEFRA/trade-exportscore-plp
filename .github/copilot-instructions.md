# GitHub Copilot Instructions for trade-exportscore-plp

## Project Overview

**Packing List Parser (PLP)** service processing Excel/PDF packing lists from retailers (Co-op, Tesco, ASDA, etc.) to extract structured data for DEFRA's trade exports system using pattern matching and retailer-specific parsers.

**Repository**: `DEFRA/trade-exportscore-plp` | **Stack**: Node.js/Hapi.js + Jest + PostgreSQL  
**Azure DevOps**: `DEFRA-EXPORTSCORE-PLP` | **Main Epic**: AB#430783  
**Branches**: `main` (production), `develop` (integration)

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

## Technical Infrastructure

### Framework & Stack

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

### Repository Structure

```
app/
├── services/
│   ├── matchers/          # Retailer format detection
│   ├── parsers/           # Data extraction logic
│   ├── model-headers.js   # Excel parser field mappings
│   └── model-headers-pdf.js # PDF parser field mappings
├── utilities/
│   └── regex.js           # Pattern matching utilities
├── config/                # Application configuration
├── models/                # Database models
└── routes/                # API endpoints

test/
├── unit/                  # Unit tests
└── integration/           # Integration tests

appConfig/                 # Environment configurations
changelog/                 # Database migrations
```

## Supported Retailers

**33 parser variants across 22 retail organizations:**

- **Excel Parsers (27)**: ASDA, BANDM, BOOTS, BUFFALOAD, CDS, COOP, DAVENPORT, FOWLERWELCH, GIOVANNI, KEPAK, MARS, NISA, NUTRICIA, SAINSBURYS, SAVERS, TESCO, TJMORRIS, WARRENS
- **PDF AI Parsers (3)**: ICELAND, MANDS, GREGGS
- **PDF Non-AI Parsers (3)**: BOOKER, GIOVANNI3

## Specialized ChatModes

For role-specific guidance, use the appropriate chatmode:

- **@DevOps**: Azure DevOps workflows, CI/CD pipelines, Git operations, PR management
- **@Developer**: Technical implementation, parser development, testing patterns, debugging
- **@Requirements**: Business analysis, user stories, acceptance criteria, regulatory compliance

Each chatmode contains detailed, role-specific information while maintaining access to this general project context.
