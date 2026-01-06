# Document Validation System Instructions

**applyTo**: `app/services/validators/`

## System Integration

The validation system serves as the **data quality gatekeeper** in the PLP processing pipeline, ensuring extracted trade data meets DEFRA regulatory requirements and business compliance standards before final processing. This system transforms raw parser output into validated, audit-ready information for export documentation.

**Pipeline Position**: Document Upload → Matcher System → Parser Selection & Data Extraction → **Validation & Quality Assurance** → Standardized Output

The validation system integrates with:
- **Parser Factory** - Receives parsed data structures for comprehensive validation
- **Parser Service** - Orchestrates validation as part of the overall processing workflow  
- **Business Logic Layer** - Applies trade-specific regulatory requirements and compliance rules
- **Data Cleaning Utilities** - Removes invalid entries and sanitizes data for downstream processing
- **Error Reporting System** - Generates detailed failure descriptions for caseworker intervention

## Architectural Decisions

### Three-Layer Validation Architecture
The system implements a **comprehensive validation hierarchy** that addresses different aspects of data quality:

1. **Basic Field Validation** - Ensures required fields are present and correctly formatted
2. **Business Rule Compliance** - Validates establishment numbers, document structure, and trade requirements
3. **Country of Origin Validation** - Applies NIRMS compliance and Ineligible item detection when enabled

**Rationale**: Different validation concerns require different approaches and error handling. Basic field validation catches data extraction issues, business rules ensure regulatory compliance, and Country of Origin validation addresses specific Northern Ireland trade requirements.

### Conditional Validation Strategy
Country of Origin validation only executes when `validateCountryOfOrigin` flag is enabled in the parser configuration, allowing the system to adapt validation intensity based on retailer requirements and document context.

**Benefits**:
- **Flexible Compliance**: Different retailers may have different regulatory requirements
- **Gradual Rollout**: New validation rules can be enabled selectively

**Trade-off**: Adds configuration complexity but prevents unnecessary processing overhead for documents that don't require enhanced validation.

### Fail-Fast with Detailed Diagnostics
The validation system immediately identifies all validation failures across the entire document rather than stopping at the first error, providing comprehensive feedback for caseworker review.

**Design Philosophy**: Caseworkers need complete visibility into document quality issues to make informed decisions about manual intervention, rather than discovering problems incrementally through multiple submission attempts.

## Component Interactions

### Validation Flow Orchestration
The primary validator (`packing-list-column-validator.js`) coordinates validation across three distinct domains, aggregating results into a single comprehensive assessment that determines overall document compliance.

### Data Quality Assessment Process
Validation follows a **systematic evaluation pattern**:

1. **Basic Field Validation** - Checks for missing descriptions, invalid product codes, missing package counts, incorrect net weights, and missing weight units
2. **Document Status Validation** - Verifies establishment number presence, document completeness, parser success, and single RMS compliance
3. **Regulatory Compliance Validation** - Applies NIRMS requirements, Country of Origin validation, and Ineligible item detection when enabled
4. **Aggregate Assessment** - Combines all validation results to determine overall compliance status

### Error Categorization and Reporting
The system categorizes validation failures into specific types with precise location information, enabling targeted remediation:

- **Missing Data Failures** - Required fields not present in source document
- **Invalid Format Failures** - Data present but in incorrect format or type
- **Business Rule Violations** - Data conflicts with trade regulations or business requirements
- **Regulatory Non-Compliance** - Country of Origin or NIRMS requirement violations
- **Multiple RMS Detection**: Identifies documents with multiple establishment numbers requiring special handling

### Intelligent Error Messaging
Failure descriptions include **contextual location information** (sheet names, page numbers, row positions) and aggregate similar errors to provide actionable feedback without overwhelming caseworkers with excessive detail.

### Data Sanitization Integration
The validation system includes **corrective capabilities** through data cleaning utilities that remove empty items and sanitize invalid data entries, allowing the pipeline to continue processing recoverable documents while flagging items requiring attention.

### Special Handling for Business Context
The system recognizes **header-level configurations** and **blanket statements** that affect validation requirements:

- **Unit in Header**: When weight units are specified at document level rather than per item
- **Blanket NIRMS**: When NIRMS statements apply to entire document rather than individual items

### Country of Origin Compliance Framework
When enabled, the system applies **comprehensive NIRMS validation**:

- **NIRMS Classification**: Determines whether items qualify for simplified customs procedures
- **Country of Origin Verification**: Validates ISO country codes against approved reference data
- **Ineligible Item Detection**: Cross-references commodity codes, countries, and treatment types against regulatory restrictions
- **Treatment Type Correlation**: Ensures Country of Origin requirements align with product treatment specifications

### Validation Result Aggregation
The system produces **standardized validation outcomes** regardless of input complexity:

- **Compliance Status**: Boolean indication of overall document validity
- **Detailed Failures**: Specific descriptions of validation issues with precise locations
- **Row-Level Tracking**: Maps validation problems to source document positions for efficient correction
- **Regulatory Flags**: Identifies specific trade compliance concerns requiring caseworker attention

### Error Threshold Management
The validation system implements **intelligent error summarization** that presents the first three specific failures of each type, then summarizes additional occurrences to prevent information overload while maintaining comprehensive coverage.

Understanding this validation system is essential for maintaining data quality standards and ensuring all processed trade documents meet regulatory requirements before reaching DEFRA's export processing systems.
