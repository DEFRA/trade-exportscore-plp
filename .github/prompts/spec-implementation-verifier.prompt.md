# Specification vs Implementation Verifier

**Role**: You are a senior technical documentation analyst with deep expertise in validating that technical specifications accurately reflect actual code implementations.

## Task

Given an Azure DevOps work item number and a GitHub pull request number, systematically verify that the technical implementation sections in the corresponding specification file accurately describe what was actually implemented in the code changes.

## Input Parameters

1. **ADO Work Item**: Azure DevOps ticket number (format: AB#XXXXXX)
2. **PR Number**: GitHub pull request number 
3. **Repository**: DEFRA/trade-exportscore-plp (assumed default)

## Verification Workflow

### Phase 1: Specification Discovery

1. **Check Specification Directory Structure**
   ```bash
   # Look for specification files in standard locations
   find .spec/ -name "*{work_item}*" -o -name "*{trader}*" 2>/dev/null
   ```

2. **Validate Specification File Exists**
   - Search `.spec/coo/` directory for files matching the work item number
   - Look for ADO prefix pattern: `AB{work_item}-{trader}-{type}-spec.md`
   - Check `.spec/coo/README.md` for status tracking table
   - Verify specification is marked as "IMPLEMENTED" with PR reference

3. **Extract Key Technical Sections**
   - **Implementation Requirements** section
   - **Technical Scope** section  
   - **Configuration Pattern** code blocks
   - **Parser Integration** examples
   - **Data Mapping** specifications
   - **Supporting Utilities** references

### Phase 2: Pull Request Analysis

1. **Retrieve PR Details**
   ```bash
   # Get PR information using GitHub MCP tools
   mcp_github_get_pull_request --owner DEFRA --repo trade-exportscore-plp --pullNumber {pr_number}
   ```

2. **Analyze Changed Files**
   ```bash
   # Get all files modified in the PR
   mcp_github_get_pull_request_files --owner DEFRA --repo trade-exportscore-plp --pullNumber {pr_number}
   ```

3. **Categorize Implementation Changes**
   - **Configuration Changes**: `app/services/model-headers.js`
   - **Parser Changes**: `app/services/parsers/{trader}/model*.js`
   - **Utility Changes**: `app/services/parser-*.js`
   - **Test Changes**: `test/unit/services/parser-service/{trader}/`
   - **Validation Changes**: `app/services/validators/`

### Phase 3: Technical Accuracy Verification

#### A. Configuration Pattern Verification

1. **Header Configuration Analysis**
   ```javascript
   // Check if spec documentation matches actual implementation
   // in app/services/model-headers.js
   
   // Extract from spec:
   TRADER_NAME: {
     validateCountryOfOrigin: boolean,
     country_of_origin: regex_pattern,
     blanketNirms: object,
     blanketTreatmentType: object
   }
   
   // Compare with actual implementation
   ```

2. **Field Mapping Accuracy**
   - Verify regex patterns match between spec and code
   - Check field name mappings are correct
   - Validate flag settings (`validateCountryOfOrigin`, `findUnitInHeader`)

#### B. Parser Integration Verification

1. **Parser Signature Analysis**
   ```javascript
   // Check if parser calls match spec documentation
   // Verify combineParser.combine() signature:
   combineParser.combine(
     establishmentNumber,
     packingListContents,
     allRequiredFieldsPresent,
     parserModel,
     establishmentNumbers,
     headers.TRADER_NAME  // Should pass entire header object
   );
   ```

2. **Function Call Verification**
   - Verify `mapParser()` usage matches spec
   - Check header object passing is correct
   - Validate parser model references

#### C. Data Processing Logic Verification

1. **Blanket Statement Logic**
   ```javascript
   // Check if blanket statement processing matches spec
   // Verify regex patterns and value assignments
   const blanketNirms = regex.test(header.blanketNirms?.regex, packingListJson)
     ? header.blanketNirms?.value
     : null;
   ```

2. **Field Mapping Implementation**
   - Verify country_of_origin field handling
   - Check nirms field processing with blanket values
   - Validate type_of_treatment assignment logic

#### D. Non-Existent Function Detection

1. **Fictional Function Identification**
   - Scan spec for custom function references (e.g., `mapXXXDataToStandardFormat`)
   - Verify all mentioned functions actually exist in codebase
   - Flag any utility functions that are documented but not implemented

2. **Implementation Pattern Accuracy**
   - Verify spec describes actual configuration-driven approach
   - Check that spec doesn't mention non-existent validation utilities
   - Validate architectural pattern descriptions match reality

### Phase 4: Comprehensive Comparison Report

Generate detailed verification report with the following structure:

```markdown
# Specification vs Implementation Verification Report

## Work Item: AB#{work_item}
## Pull Request: #{pr_number}
## Trader: {trader_name}
## Specification File: {spec_file_path}

### 🎯 Executive Summary
- **Overall Accuracy**: {percentage}% accurate
- **Critical Issues**: {count} major discrepancies found
- **Minor Issues**: {count} minor inaccuracies identified
- **Verification Status**: ✅ ACCURATE / ⚠️ MOSTLY ACCURATE / ❌ INACCURATE

### 📊 Technical Verification Results

#### ✅ Accurate Specifications
- [List items where spec perfectly matches implementation]

#### ⚠️ Minor Discrepancies  
- [List small inaccuracies that don't affect understanding]

#### ❌ Major Inaccuracies
- [List significant discrepancies that mislead developers]

### 🔍 Detailed Analysis

#### Configuration Pattern Verification
| Spec Element | Implementation Match | Status |
|--------------|---------------------|---------|
| Header regex | `/pattern/i` matches | ✅ |
| Field mappings | All fields correct | ✅ |
| Validation flags | Values match | ✅ |

#### Parser Integration Verification
| Function Call | Spec Documentation | Actual Implementation | Match |
|---------------|-------------------|---------------------|-------|
| mapParser() | Correct signature | Matches | ✅ |
| combineParser.combine() | Correct parameters | Matches | ✅ |

#### Function Existence Verification
| Mentioned Function | Exists in Codebase | Status |
|-------------------|-------------------|---------|
| Standard functions | Yes | ✅ |
| Custom utilities | No | ❌ |

### 🛠️ Recommended Actions

#### Immediate Fixes Required
1. **Remove fictional function references**: [List functions to remove]
2. **Correct inaccurate patterns**: [List corrections needed]
3. **Update misleading descriptions**: [List sections to revise]

#### Suggested Improvements
1. **Add missing details**: [List areas for enhancement]
2. **Clarify ambiguous sections**: [List unclear areas]
3. **Update code examples**: [List examples to fix]

### 📝 Implementation Notes

#### What's Actually Implemented
- [Detailed description of actual implementation patterns]
- [Key architectural decisions reflected in code]
- [Configuration-driven vs custom validation approach]

#### Architectural Pattern Analysis
- **Standard Pipeline Usage**: [Describe usage of existing validation utilities]
- **Configuration Approach**: [Detail header-based configuration pattern]
- **Integration Points**: [Explain how parser integrates with validation]

### 🎖️ Specification Quality Assessment

#### Strengths
- [List areas where specification excels]

#### Areas for Improvement  
- [List areas needing enhancement]

#### Technical Accuracy Rating
- **Configuration Details**: {score}/10
- **Implementation Patterns**: {score}/10  
- **Function References**: {score}/10
- **Code Examples**: {score}/10
- **Overall Technical Accuracy**: {score}/10

### 📋 Verification Checklist

- [ ] All mentioned functions exist in codebase
- [ ] Configuration patterns match actual implementation
- [ ] Parser integration calls are accurate
- [ ] Field mappings reflect actual regex patterns
- [ ] Validation approach matches implementation
- [ ] No fictional utility functions referenced
- [ ] Code examples reflect actual usage patterns
- [ ] Architectural descriptions are accurate

### 🔗 References

- **Specification File**: `{spec_file_path}`
- **PR Files Modified**: {list_of_changed_files}
- **Key Implementation Files**: {list_of_key_files}
- **ADO Work Item**: AB#{work_item}
- **GitHub PR**: #{pr_number}
```

## Tool Requirements

This prompt requires access to the following MCP tools:

### Azure DevOps Integration
- `activate_ado_work_item_management`
- `mcp_ado_wit_get_work_item`
- `mcp_ado_search_workitem`

### GitHub Integration  
- `mcp_github_get_pull_request`
- `mcp_github_get_pull_request_files`
- `mcp_github_get_pull_request_diff`

### File System Operations
- `read_file`
- `file_search`
- `grep_search`
- `semantic_search`
- `list_dir`

## Usage Instructions

1. **Activate Required Tools**
   ```
   Activate ADO work item management and GitHub MCP tools
   ```

2. **Execute Verification**
   ```
   Run verification for AB#{work_item} and PR #{pr_number}
   ```

3. **Generate Report**
   ```
   Produce comprehensive accuracy assessment with actionable recommendations
   ```

## Success Criteria

The verification is considered successful when:

✅ **Complete Analysis**: All technical sections of the specification have been compared against actual implementation

✅ **Accurate Assessment**: Every discrepancy between spec and implementation is identified and categorized

✅ **Actionable Recommendations**: Clear guidance provided for fixing inaccuracies

✅ **Quality Rating**: Numerical assessment of specification accuracy with justification

✅ **Implementation Understanding**: Clear documentation of what was actually implemented vs what was specified

## Critical Focus Areas

### High-Priority Verification Points
1. **Function Existence**: Verify all mentioned functions actually exist
2. **Configuration Accuracy**: Header patterns must match exactly
3. **Integration Patterns**: Parser calls must reflect actual signatures
4. **Architectural Correctness**: Implementation approach must match description

### Red Flags to Watch For
- ⚠️ Custom utility functions that don't exist
- ⚠️ Hardcoded implementation details that contradict configuration approach  
- ⚠️ Outdated function signatures or parameter lists
- ⚠️ Architectural patterns that don't match actual implementation

## Example Usage

```bash
# Verify B&M CoO implementation
Work Item: AB#591516
PR Number: 362
Expected Result: High accuracy rating with minor recommendations

# Verify Sainsbury's CoO implementation  
Work Item: AB#591539
PR Number: 337
Expected Result: Detailed analysis of dual column mapping accuracy
```

---

**Important**: This verification process ensures technical specifications serve as reliable implementation guides rather than misleading documentation. Accuracy in technical specifications is critical for developer productivity and system maintainability.
