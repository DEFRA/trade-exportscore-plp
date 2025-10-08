# Country of Origin (CoO) Validation Specifications

This directory contains comprehensive specifications for implementing Country of Origin validation across multiple traders in the Packing List Parser (PLP) service.

## Overview

All CoO validation implementations follow the **configuration-driven approach** using the existing validation pipeline:

1. **Header Configuration** (`model-headers.js`) - Defines field mappings and enables `validateCountryOfOrigin: true`
2. **Parser Integration** - Passes header configuration to `combineParser.combine()`
3. **Existing Validation Pipeline** - Automatic validation using generic utilities in `packing-list-validator-utilities.js`

## Implementation Architecture

### Core Components

- **Generic Validation Utilities** (`app/services/validators/packing-list-validator-utilities.js`)
  - `hasMissingCoO()` / `hasInvalidCoO()` - Country of Origin validation
  - `hasMissingNirms()` / `hasInvalidNirms()` - NIRMS classification validation
  - `hasProhibitedItems()` - Cross-reference prohibited items lists
- **Column Validator** (`app/services/validators/packing-list-column-validator.js`)
  - Checks `validateCountryOfOrigin` flag from parser configuration
  - Applies CoO validation rules when flag is enabled
- **Parser Factory** (`app/services/parsers/parser-factory.js`)
  - Orchestrates validation through `packingListValidator.validatePackingList()`

### Configuration Pattern

```javascript
// model-headers.js
TRADER_NAME: {
  establishmentNumber: /existing regex/,
  fieldMapping: {
    // ... existing mappings ...
    country_of_origin: /country.?of.?origin/i,
    nirms: /nirms|rms/i,
    type_of_treatment: /treatment|process/i
  },
  validateCountryOfOrigin: true  // Enable CoO validation
}
```

## Trader Specifications

| Ticket ID | Title                                               | Current Status      | Sprint Assignment | Assignee     | Specification File                                                                       |
| --------- | --------------------------------------------------- | ------------------- | ----------------- | ------------ | ---------------------------------------------------------------------------------------- |
| AB#591539 | Sainsburys - Country of Origin Validation           | ✅ **Closed**       | NIRMS Sprint 27   | Devi D.      | [AB591539-sainsburys-coo-validation-spec.md](AB591539-sainsburys-coo-validation-spec.md) |
| AB#591516 | B&M - Country of Origin Validation                  | 🔄 **Resolved**     | NIRMS Sprint 29   | Devi D.      | [AB591516-bandm-coo-validation-spec.md](AB591516-bandm-coo-validation-spec.md)           |
| AB#591540 | Savers - Country of Origin Validation               | 🔄 **Resolved**     | NIRMS Sprint 29   | Devi D.      | [AB591540-savers-coo-validation-spec.md](AB591540-savers-coo-validation-spec.md)         |
| AB#591514 | ASDA 3 - Country of Origin Validation               | 📋 **New**          | NIRMS Sprint 30   | Hanna S-A.   | [AB591514-asda3-coo-validation-spec.md](AB591514-asda3-coo-validation-spec.md)           |
| AB#591527 | Giovanni 1 - Country of Origin Validation           | ✅ **Complete**     | NIRMS Sprint 30   | David P.     | [AB591527-giovanni1-coo-validation-spec.md](AB591527-giovanni1-coo-validation-spec.md)   |
| AB#591532 | Kepak - Country of Origin Validation                | ⚡ **Active**       | NIRMS Sprint 30   | Hanna S-A.   | [AB591532-kepak-coo-validation-spec.md](AB591532-kepak-coo-validation-spec.md)           |
| AB#599300 | Mars - Country of Origin Validation                 | 📋 **New**          | NIRMS Sprint 30   | John F.      | [AB599300-mars-coo-validation-spec.md](AB599300-mars-coo-validation-spec.md)             |
| AB#591536 | Nisa 2 - Country of Origin Validation               | Specification Ready | NIRMS Sprint 31   | Not Assigned | [AB591536-nisa2-coo-validation-spec.md](AB591536-nisa2-coo-validation-spec.md)           |
| AB#603666 | ASDA 4 - Create new parser model for ASDA .csv file | Specification Ready | NIRMS Sprint 31   | Not Assigned | [AB603666-asda4-coo-validation-spec.md](AB603666-asda4-coo-validation-spec.md)           |

## Foundation Work Item

All specifications depend on **AB#592259** - the foundational validation rules and prohibited items cross-reference functionality already implemented in the generic validation utilities.

## Implementation Notes

- **No Custom Validation Code Required** - All validation uses existing generic utilities
- **Configuration-Driven** - Changes isolated to header mappings and parser integration
- **Consistent Error Messages** - All traders use standardized validation error formats
- **Extensible Pattern** - New traders follow same configuration approach

## Testing Strategy

Each specification includes comprehensive test scenarios covering:

- Missing/invalid NIRMS values
- Missing/invalid Country of Origin values
- Prohibited items cross-referencing
- Error message formatting and aggregation
- Edge cases and boundary conditions

## Next Steps

1. **Review specifications** with stakeholders for business rule accuracy
2. **Implement parser configurations** for Mars, ASDA3, and B&M traders
3. **Add comprehensive tests** following the patterns established in Savers implementation
4. **Validate against real packing list data** from each trader format
