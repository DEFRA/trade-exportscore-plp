# Document Parser System Instructions

**applyTo**: `app/services/parsers/`

## System Integration

The parser system serves as the **data extraction engine** in the PLP processing pipeline, transforming retailer-specific document formats into standardized trade data for DEFRA's export system. Once the matcher system identifies the correct parser, this system extracts and normalizes business-critical information from packing lists.

**Pipeline Position**: Document Upload → Matcher System → **Parser Selection & Data Extraction** → Validation → Standardized Output

The parser system integrates with:
- **Parser Factory** (`parser-factory.js`) - Entry point that routes documents by type (Excel/PDF AI/PDF Non-AI)
- **Parser Orchestrator** (`parsers.js`) - Contains matching logic and parser selection for each document type
- **Parser Service** - High-level service coordinating the parsing workflow via `findParser()`
- **Validation System** - Receives extracted data for business rule compliance checking
- **Model Headers** - Provides configuration for field mapping and establishment number patterns

## Architectural Decisions

### Three-Tier Processing Strategy
The system handles three distinct document processing paths based on format and complexity:

1. **Excel Parsers** - JSON conversion with header detection and mapParser() transformation
2. **PDF AI Parsers** - Azure Document Intelligence for structured form recognition  
3. **PDF Non-AI Parsers** - Coordinate-based extraction for complex layouts

**Rationale**: Different document types require fundamentally different extraction approaches. Excel files can be reliably processed through structured JSON, while PDFs need either AI-powered form recognition or precise coordinate mapping depending on layout complexity.

### Standardized Parser Interface
All parsers implement a consistent `parse()` function signature that returns standardized output via `combineParser.combine()`, regardless of input format complexity.

**Benefits**:
- **Uniform Integration**: Parser factory can treat all parsers identically
- **Predictable Error Handling**: All parsers return structured results rather than throwing exceptions
- **Consistent Data Schema**: Downstream validation expects identical output structure

**Trade-off**: Some parsers require internal complexity to conform to the interface, but this enables seamless parser substitution and testing.

### Retailer-Specific Specialization
Each retailer folder contains multiple model parsers to handle format variations over time, with shared utilities for common operations.

**Design Philosophy**: Business requirements change faster than system architecture, so the parser system accommodates retailer format evolution without requiring system-wide changes.

## Component Interactions

### Parser Factory Orchestration Flow
The factory uses **file-type detection** to determine the appropriate processing path, first attempting Excel parsing for spreadsheet files, then trying PDF Non-AI processing for PDF documents, with an optional fallback to PDF AI processing when Document Intelligence is enabled.

### Data Extraction Patterns

#### Excel Processing Pattern
The Excel processing follows a standardized four-step approach:

1. **Extract establishment number** - Uses regex pattern matching to locate REMOS numbers in the first sheet
2. **Find header row** - Employs rowFinder with callback functions to locate column headers dynamically
3. **Process with mapParser** - Transforms raw Excel data using field mapping configurations
4. **Return standardized output** - Uses combineParser to normalize results into consistent schema

#### PDF AI Processing Pattern  
PDF AI processing leverages Azure Document Intelligence for form recognition:

1. **Extract establishment number** - Retrieves REMOS from AI-recognized form fields
2. **Transform recognized fields** - Converts AI output to standard format using mapPdfParser
3. **Extract additional data** - Processes full document text for comprehensive establishment number collection

#### PDF Non-AI Processing Pattern
Coordinate-based PDF processing handles complex layouts through precise positioning:

1. **Convert to coordinate JSON** - Transforms PDF into text elements with X/Y coordinates
2. **Extract establishment number** - Searches text content using regex patterns  
3. **Calculate data positions** - Uses Y-coordinate analysis to identify data rows
4. **Map coordinates to data** - Transforms positional information into structured records

### Data Standardization Layer
The `combineParser.combine()` function serves as the **data normalization chokepoint**, ensuring all parsers output identical schema regardless of source format. The standardized output includes registration approval numbers, item details with business-critical fields like commodity codes and weights, business validation checks, parser model identification, and collected establishment numbers.

### Error Handling Strategy
Parsers implement **graceful degradation** rather than catastrophic failure through try-catch blocks that capture parsing errors and return standardized failure responses. When parsing fails, the system logs the error for diagnostic purposes but returns a valid response structure with empty data and NOMATCH parser model identification.

This approach ensures the pipeline continues processing even when individual documents fail, while providing diagnostic information for troubleshooting and system monitoring.

### Header Configuration Integration
The parser system leverages centralized header definitions (`model-headers.js`, `model-headers-pdf.js`) for:

- **Field Mapping**: Column headers to standardized field names
- **Establishment Number Patterns**: REMOS validation regex
- **Processing Hints**: Special handling flags (findUnitInHeader, validateCountryOfOrigin, blanketNirms)

This **configuration-driven approach** enables header pattern updates without code changes and ensures consistent validation across all parsers.
