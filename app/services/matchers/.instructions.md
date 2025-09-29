# Document Matcher System Instructions

**applyTo**: `app/services/matchers/`

## System Integration

The matcher system serves as the **first critical decision point** in the PLP processing pipeline, determining which retailer-specific parser should handle each incoming packing list document. This system enables the PLP to automatically identify document formats from 20+ different retailers without manual intervention.

**Pipeline Position**: Document Upload → **Matcher System** → Parser Selection → Data Extraction → Validation

The matcher system integrates with:
- **Route handlers** (`non-ai.js`, `ai.js`) - Entry points that invoke document matching used for local testing
- **Parser Service** - Orchestrates the overall parsing pipeline via `findParser()`
- **Parser Factory** - Contains the core matching logic in `getExcelParser()`, `getPdfParser()`, and `getPdfNonAiParser()`
- **Model Headers** - Provides regex patterns for establishment numbers and column headers

## Architectural Decisions

### Two-Stage Validation Pattern
Each matcher implements a **dual validation approach** to ensure accurate document identification:

1. **Establishment Number Validation** - Verifies REMOS (RMS-GB-XXXXXX-XXX) compliance
2. **Header Pattern Matching** - Confirms expected column headers exist in the document

**Rationale**: This prevents false positives where documents might share similar establishment numbers but have different data structures, ensuring the correct parser is selected for reliable data extraction.

### Fail-Fast with Graceful Fallback
Matchers return specific error codes (`WRONG_ESTABLISHMENT_NUMBER`, `WRONG_HEADER`, `GENERIC_ERROR`) rather than throwing exceptions, enabling the system to:
- Try alternative matchers
- Provide diagnostic information for troubleshooting
- Fall back to generic handling (`NOMATCH`)

**Trade-off**: Individual matcher failures don't crash the entire pipeline, but debugging specific matcher issues requires analyzing returned error codes.

### Sequential Trial Strategy
The **parser factory** (`parsers.js`) attempts matchers in a **predefined order** until one succeeds, rather than using parallel matching or scoring systems. Each document type (Excel, PDF AI, PDF Non-AI) has its own matching function that iterates through available parsers.

**Benefits**:
- Simple, predictable behavior
- Clear logging trail for debugging
- Deterministic results (same document always matches same pattern)

**Trade-off**: Processing time increases with position in matcher list, but document variety makes optimization complex.

## Component Interactions

### Retailer-Specific Matcher Structure
```
matchers/
├── [retailer]/          # One folder per retailer
│   ├── model1.js        # First document format
│   └── model2.js        # Alternative formats (optional)
```

Each retailer may have multiple models because:
- **Format Evolution**: Retailers update their packing list templates over time
- **Regional Variations**: Different distribution centers may use slightly different formats  
- **System Migrations**: New systems may coexist with legacy formats during transitions

### Header Configuration Centralization
The `model-headers.js` file centralizes all regex patterns for establishment numbers and field mappings, preventing:
- **Pattern Duplication**: Same regex defined in multiple matchers
- **Inconsistent Validation**: Different matchers using slightly different patterns
- **Maintenance Overhead**: Updates require changes across multiple files

### No-Match Fallback Logic
The special `no-match/model1.js` provides fallback identification for documents that contain valid REMOS numbers but don't match known formats.

This prevents legitimate trade documents from being rejected while maintaining data quality standards.

### Error Propagation Strategy
Matchers use **structured error codes** rather than exceptions to communicate results:
- `CORRECT` - Proceed with matched parser
- `WRONG_ESTABLISHMENT_NUMBER` - Try next matcher
- `WRONG_HEADER` - Try next matcher  
- `GENERIC_ERROR` - Log error, try next matcher
- `EMPTY_FILE` - Handle as invalid document

This approach enables the parser factory functions (`getExcelParser`, `getPdfParser`, `getPdfNonAiParser`) to make intelligent decisions about whether to continue trying matchers or escalate to error handling.

Understanding this matcher system is essential for maintaining data quality and ensuring new document formats are properly integrated into the PLP processing pipeline.
