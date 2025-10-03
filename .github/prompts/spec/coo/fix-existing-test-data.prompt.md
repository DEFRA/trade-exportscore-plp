---
description: "Add non-NIRMS values to existing test data models to prevent CoO validation failures when implementing new CoO validation for specific models"
mode: "agent"
tools: ['codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'extensions', 'editFiles', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks']
---

# Add Non-NIRMS Values to Existing Test Data Models

## Purpose

This prompt systematically adds non-NIRMS values to existing test data models to comply with Universal Implementation Principles when implementing CoO validation for specific retailer models. This prevents existing unit tests from failing due to new CoO validation requirements.

**🚨 CRITICAL SCOPE LIMITATION: This prompt ONLY adds the NIRMs/Non-NIRMs column as specified in the ticket. It does NOT add other CoO-related columns like Commodity Code, Country of Origin, or Treatment Type. The header name for the NIRMs column varies by retailer and must match exactly what is specified in the ticket specification.**

**🚨 CRITICAL IMPLEMENTATION RULE: When updating existing test data models, you must ONLY:**
1. **Add the NIRMs/Non-NIRMs column header** to header rows (with exact name from ticket specification)
2. **Add "Non-NIRMS" values** to existing data rows in the NIRMs column
3. **DO NOT modify or shift existing column data** - existing data must remain exactly as is
4. **DO NOT add any other CoO-related columns** (Commodity Code, Country of Origin, Treatment Type columns)
5. **Use a completely new column** that is not already used by any row in the model
6. **Maintain column consistency** - all header rows and data rows must use the SAME selected column for NIRMs data

**Example of CORRECT implementation:**
- BEFORE: Columns B, C, D, E, F... (some rows may use up to column J)
- Analyze ALL rows to find highest used column (e.g., J is used in one row)
- AFTER: Add NIRMs column to next available column (K in this example)
- Header rows get "NIRMs/Non-NIRMs" in column K
- Data rows get "Non-NIRMS" in column K
- ALL existing data in columns B through J remains unchanged

## Usage

```
Follow instructions in [add-non-nirms-to-existing-test-data.prompt.md]. <ADO_TICKET_ID>
```

**Example:**
```
Follow instructions in [add-non-nirms-to-existing-test-data.prompt.md]. AB#591514
```

The prompt will automatically determine the test data file path from the ADO ticket specification.

## Universal Implementation Compliance

**🚨 MANDATORY: These principles apply to ALL CoO validation test data updates:**

1. **✅ Existing unit tests SHOULD still be passing** - Updates must not break existing functionality for unrelated models
2. **✅ Test data for existing unit tests should have non-NIRMS values** - Populate relevant NIRMS columns with "Non-NIRMS" values to prevent validation failures on models that don't have CoO validation enabled
3. **✅ Only the relevant model should be updated** - Implementation should be isolated to the target model only

## Instructions

### Step 1: Specification Analysis and Path Detection

#### 1.1 Locate Specification File
```bash
# Find specification file based on ADO ticket number
TICKET_ID="${ADO_TICKET_ID#AB#}"  # Remove AB# prefix if present
SPEC_FILE=$(find .spec/ -name "*${TICKET_ID}*-spec.md" | head -1)

if [ -z "$SPEC_FILE" ]; then
    echo "❌ No specification file found for ${ADO_TICKET_ID}"
    echo "Available specification files:"
    find .spec/ -name "*-spec.md" | sort
    exit 1
fi

echo "✅ Found specification: $SPEC_FILE"
```

#### 1.2 Auto-Detect Test Data Model Path
Extract retailer name and model number from specification filename to automatically build the test data path:

```bash
# Extract retailer and model from filename pattern: AB{ticket}-{retailer}{model?}-coo-validation-spec.md
SPEC_BASENAME=$(basename "$SPEC_FILE" -spec.md)
SPEC_BASENAME=${SPEC_BASENAME#AB*-}  # Remove AB{ticket}- prefix
SPEC_BASENAME=${SPEC_BASENAME%-coo-validation}  # Remove -coo-validation suffix

# Parse retailer name and model number
if [[ "$SPEC_BASENAME" =~ ^([a-zA-Z]+)([0-9]+)$ ]]; then
    RETAILER=${BASH_REMATCH[1]}
    MODEL_NUMBER=${BASH_REMATCH[2]}
elif [[ "$SPEC_BASENAME" =~ ^([a-zA-Z]+)$ ]]; then
    RETAILER=${BASH_REMATCH[1]}
    MODEL_NUMBER=1  # Default to model 1 if no number specified
else
    echo "❌ Unable to parse retailer and model from: $SPEC_BASENAME"
    exit 1
fi

# Convert to lowercase and build path
RETAILER_LOWER=$(echo "$RETAILER" | tr '[:upper:]' '[:lower:]')
TEST_DATA_MODEL_PATH="test/unit/test-data-and-results/models/${RETAILER_LOWER}/model${MODEL_NUMBER}.js"

echo "✅ Auto-detected path: $TEST_DATA_MODEL_PATH"
echo "   Retailer: $RETAILER_LOWER, Model: $MODEL_NUMBER"

# Verify the file exists
if [ ! -f "$TEST_DATA_MODEL_PATH" ]; then
    echo "❌ Test data file not found: $TEST_DATA_MODEL_PATH"
    echo "Available models for $RETAILER_LOWER:"
    ls -1 test/unit/test-data-and-results/models/${RETAILER_LOWER}/ 2>/dev/null || echo "  No models found for retailer: $RETAILER_LOWER"
    exit 1
fi

echo "✅ Test data file confirmed: $TEST_DATA_MODEL_PATH"
```

**Auto-Detection Examples:**
- `AB591514-asda3-coo-validation-spec.md` → `test/unit/test-data-and-results/models/asda/model3.js`
- `AB591516-bandm-coo-validation-spec.md` → `test/unit/test-data-and-results/models/bandm/model1.js` (defaults to model1)
- `AB603666-asda4-coo-validation-spec.md` → `test/unit/test-data-and-results/models/asda/model4.js`
- `AB591539-sainsburys-coo-validation-spec.md` → `test/unit/test-data-and-results/models/sainsburys/model1.js`

#### 1.3 Extract Column Mapping and NIRMS Values
From the specification file, extract:

1. **NIRMS Column Name**: Look for column mapping section
   - Example: `Column C: 'NIRMs/Non-NIRMs' - NIRMS classification values`
   - **Note**: The column header name varies by retailer specification and should match exactly what's specified

2. **NIRMS Value Mapping**: Extract false (non-NIRMS) values
   - **True Values (NIRMS = Yes)**: `Yes | NIRMS | Green | Y | G`
   - **False Values (NIRMS = No)**: `No | Non-NIRMS | Non NIRMS | Red | N | R`

**⚠️ IMPORTANT: This prompt ONLY adds the NIRMs/Non-NIRMs column. Do NOT add other CoO columns like Commodity Code, Country of Origin, or Treatment Type - those should already exist in the test data or be added by separate processes.**

### Step 2: Test Data Model Analysis

#### 2.1 Examine Current Test Data Structure
Read the specified test data model file and identify:

1. **All Model Objects**: Extract all exported model objects (validModel, validHeadersNoData, etc.)
2. **Sheet Structure**: Identify sheet names and data structure
3. **Header Row Pattern**: Locate header row (typically first row in each sheet)
4. **Data Row Pattern**: Identify data rows that need NIRMS values added
5. **Column Mapping**: Map logical columns (A, B, C, etc.) to data structure

#### 2.2 Identify Required Updates
For each model object:
- **Header Rows**: Need NIRMS column header added
- **Data Rows**: Need non-NIRMS values added
- **Empty/Minimal Rows**: May need selective updates

### Step 3: Column Detection and Mapping

#### 3.1 Determine Next Available Column (PER MODEL)
```javascript
// CRITICAL: Column detection must be done PER MODEL, not globally across all models
// Each model gets its own next available column based on its individual usage pattern
function findNextAvailableColumnForModel(singleModel) {
  const allUsedColumns = new Set();
  
  // Analyze THIS SPECIFIC MODEL ONLY - all its sheets and rows
  Object.values(singleModel).forEach(sheet => {
    sheet.forEach(row => {
      Object.keys(row).forEach(col => {
        allUsedColumns.add(col);
      });
    });
  });
  
  // Find next available column after highest used column IN THIS MODEL
  const usedColumns = Array.from(allUsedColumns).sort();
  const lastColumn = usedColumns[usedColumns.length - 1];
  
  // Convert to next letter (A->B, B->C, etc.)
  if (lastColumn) {
    return String.fromCharCode(lastColumn.charCodeAt(0) + 1);
  }
  return 'A';
}

// WRONG APPROACH: Do NOT analyze all models globally
// Each model should be independent based on its own column usage
```

#### 3.2 Column Assignment Strategy
Based on specification analysis:

1. **PER-MODEL ANALYSIS**: Each model gets its own next available column independently
2. **NIRMS Column ONLY**: Assign to next available column that is completely unused within that specific model
3. **NO SHIFTING**: Do not shift or modify existing data - all existing columns remain exactly as they were
4. **CONSISTENT COLUMN**: Use the SAME column letter for both header rows and data rows across all sheets within each model

**⚠️ CRITICAL: Do NOT add additional columns like Commodity Code, Country of Origin, or Treatment Type. This prompt focuses exclusively on the NIRMs/Non-NIRMs column as specified in the ticket.**

### Step 4: Systematic Model Updates

#### 4.1 Model Update Pattern

For **EACH** model object in the test data file:

**Header Row Updates:**
```javascript
// EXAMPLE: Per-model analysis for different models

// BEFORE - Most models (validModel, emptyModel, etc.) use columns B-I
{
  B: "Description Of All Retail Goods",
  C: "Nature of Product",
  D: "Treatment Type",
  // ... existing columns
  I: "kilograms/grams",
}

// AFTER - Most models get column J (next after their last column I)
{
  B: "Description Of All Retail Goods",
  C: "Nature of Product", 
  D: "Treatment Type",
  // ... existing columns (UNCHANGED)
  I: "kilograms/grams",
  J: "NIRMs/Non-NIRMs",        // ← Most models use column J
}

// SPECIAL CASE - multipleRms model uses columns B-J
// BEFORE - multipleRms has data in column J
{
  B: "Description Of All Retail Goods",
  C: "Nature of Product",
  D: "Treatment Type", 
  // ... existing columns
  I: "kilograms/grams",
  // (Some data rows in this model use column J for RMS numbers)
}

// AFTER - multipleRms gets column K (next after its last column J)  
{
  B: "Description Of All Retail Goods",
  C: "Nature of Product",
  D: "Treatment Type",
  // ... existing columns (UNCHANGED)
  I: "kilograms/grams", 
  K: "NIRMs/Non-NIRMs",        // ← multipleRms uses column K because it already used J
}
```

**Data Row Updates:**
```javascript
// EXAMPLE: Most models get column J for data rows to match their header column J

// BEFORE - Most models (validModel, emptyModel, etc.)
{
  B: "100000261 DAILY CROISSANT CHOCO 1PK",
  C: "Bakery Bought In",
  D: "Ambient Grocery",
  // ... existing data
  I: "kgs",
  // No NIRMs data yet
}

// AFTER - Most models use column J for NIRMs data
{
  B: "100000261 DAILY CROISSANT CHOCO 1PK", 
  C: "Bakery Bought In",
  D: "Ambient Grocery",
  // ... existing data (ALL UNCHANGED)
  I: "kgs",
  J: "Non-NIRMS",              // ← Most models use column J for NIRMs data
}

// SPECIAL CASE - multipleRms model already uses column J for RMS data
// BEFORE - multipleRms data row with existing RMS in column J
{
  B: "100000261 DAILY CROISSANT CHOCO 1PK",
  C: "Bakery Bought In",
  D: "Ambient Grocery",
  // ... existing data
  I: "kgs",
  J: "RMS-GB-000015-005",      // ← This existing RMS data MUST NOT be modified
}

// AFTER - multipleRms uses column K for NIRMs data (preserving column J RMS data)
{
  B: "100000261 DAILY CROISSANT CHOCO 1PK", 
  C: "Bakery Bought In",
  D: "Ambient Grocery",
  // ... existing data (ALL UNCHANGED)
  I: "kgs",
  J: "RMS-GB-000015-005",      // ← Existing RMS data preserved exactly as is
  K: "Non-NIRMS",              // ← NIRMs data in column K to avoid conflict
}
```

**⚠️ CRITICAL: ALL existing data must remain in original columns. Only ADD the new NIRMs column, never modify or shift existing data.**

#### 4.2 Model-Specific Update Rules

**validModel / validModelMultipleSheets:**
- Add NIRMS column header to header rows (using exact header text from specification)
- Add "Non-NIRMS" values to all data rows (or appropriate false value from spec)

**validHeadersNoData:**
- Add NIRMS column header only (no data rows)

**emptyModel:**
- Add NIRMS column header to header rows
- Leave empty rows empty (no additional data)

**invalidModel_MissingColumnCells / missingKgunit:**
- Add NIRMS column header to header rows
- Add "Non-NIRMS" values to data rows that have data
- Keep missing/null pattern for rows that are intentionally incomplete

**multipleRms:**
- Add NIRMS column header to header rows  
- Add "Non-NIRMS" values to all data rows
- Maintain multiple RMS number pattern

**incorrectHeader / incorrectHeaderMultiple:**
- Add NIRMS column to correct header rows only
- Do NOT add to intentionally incorrect header rows
- Add "Non-NIRMS" values to data rows

**wrongEstablishment / wrongEstablishmentMultiple:**
- Add NIRMS column header to header rows (if they exist)
- Add "Non-NIRMS" values to data rows
- Maintain wrong establishment number pattern

### Step 5: Value Selection Strategy

#### 5.1 Non-NIRMS Value Selection
From specification false values, choose the clearest option:
- **Primary Choice**: `"Non-NIRMS"` (most explicit)
- **Alternative**: `"No"` (if Non-NIRMS not in spec)
- **Consistent Usage**: Use same value throughout all models

**⚠️ REMINDER: Only add NIRMs/Non-NIRMs values. Do not add other CoO-related data.**

### Step 6: Implementation Execution

#### 6.1 Systematic File Updates
For the specified test data model file:

1. **Read Current File**: Parse existing module.exports structure
2. **Analyze Column Usage PER MODEL**: Examine each model individually to determine its highest used column
3. **Select NIRMs Column PER MODEL**: Choose next available column that is completely unused within that specific model
4. **Update Each Model**: Apply the model-specific update rules with per-model column selection
5. **Preserve All Existing Data**: Ensure no existing data is modified or shifted
6. **Maintain Formatting**: Preserve existing indentation and structure  
7. **Validate Syntax**: Ensure JavaScript object syntax remains valid
8. **Write Updated File**: Save with all models updated using their individual NIRMs columns

**Critical Per-Model Column Selection Process:**
```javascript
// CORRECT: Analyze EACH model individually
Object.keys(allTestModels).forEach(modelName => {
  const singleModel = allTestModels[modelName];
  
  // Step 1: Find used columns in THIS MODEL ONLY
  const modelUsedColumns = new Set();
  Object.values(singleModel).forEach(sheet => {
    sheet.forEach(row => {
      Object.keys(row).forEach(col => modelUsedColumns.add(col));
    });
  });
  
  // Step 2: Find next available column for THIS MODEL
  const sortedColumns = Array.from(modelUsedColumns).sort();
  const nextColumn = String.fromCharCode(
    sortedColumns[sortedColumns.length - 1].charCodeAt(0) + 1
  );
  
  // Step 3: Use this column for ALL rows in THIS MODEL
  console.log(`${modelName} will use column ${nextColumn} for NIRMs`);
});

// WRONG: Do NOT find global highest column and apply to all models
// This would give incorrect results where most models get over-assigned columns
```
const nextColumn = String.fromCharCode(
  sortedColumns[sortedColumns.length - 1].charCodeAt(0) + 1
);

// Step 3: Use this SAME column for ALL header rows and data rows
```

#### 6.2 Update Verification
```javascript
// Verification pattern for each updated model
const updatedModel = require('./path/to/updated/model.js');

// Check all models have required updates
Object.keys(updatedModel).forEach(modelName => {
  const model = updatedModel[modelName];
  
  Object.keys(model).forEach(sheetName => {
    const sheet = model[sheetName];
    if (sheet.length > 0) {
      // Verify header row has NIRMS column
      const headerRow = sheet[0];
      const nirmsColumn = Object.values(headerRow).find(v => 
        v && v.toLowerCase().includes('nirms')
      );
      console.log(`${modelName}.${sheetName}: NIRMS header = ${!!nirmsColumn}`);
      
      // Verify data rows have NIRMS values  
      const dataRows = sheet.slice(1).filter(row => 
        Object.keys(row).length > 0
      );
      dataRows.forEach((row, idx) => {
        const nirmsValue = Object.entries(headerRow).find(([col, header]) => 
          header && header.toLowerCase().includes('nirms')
        );
        if (nirmsValue) {
          const [nirmsCol] = nirmsValue;
          console.log(`${modelName}.${sheetName} row ${idx + 2}: NIRMS = ${row[nirmsCol]}`);
        }
      });
    }
  });
});
```

### Step 7: Testing and Validation

#### 7.1 Test Syntax Validation
```bash
# Verify updated file has valid JavaScript syntax
node -c "${TEST_DATA_MODEL_PATH}"
if [ $? -eq 0 ]; then
    echo "✅ Updated test data file has valid syntax"
else
    echo "❌ Syntax error in updated test data file"
    exit 1
fi
```

#### 7.2 Test Import Validation  
```javascript
// Test that the updated file can be imported
try {
  const testData = require('./${TEST_DATA_MODEL_PATH}');
  console.log('✅ Updated test data imports successfully');
  console.log('Models available:', Object.keys(testData));
} catch (error) {
  console.error('❌ Failed to import updated test data:', error.message);
  process.exit(1);
}
```

#### 7.3 Run Related Unit Tests
```bash
# Test the specific parser model to ensure no regressions
# Auto-build test pattern from detected retailer and model
PARSER_TEST_PATTERN="${RETAILER_LOWER}.*model${MODEL_NUMBER}"
npm run test:unit -- --testPathPattern="${PARSER_TEST_PATTERN}" --verbose

# Check for any test failures
if [ $? -eq 0 ]; then
    echo "✅ All tests pass with updated test data"
else
    echo "❌ Test failures detected - review updates"
    exit 1
fi
```

## Quality Assurance Checklist

**⚠️ CRITICAL: Updates are NOT complete until ALL items checked:**

- [ ] **Specification Analysis Complete**: ADO ticket specification located and analyzed
  - [ ] NIRMS column name identified from spec (exact header text)
  - [ ] NIRMS false values identified from spec  
  - [ ] Column mapping strategy determined
- [ ] **Test Data Structure Analysis**: Current test data model fully analyzed
  - [ ] All model objects identified
  - [ ] Sheet structure mapped
  - [ ] Header and data row patterns identified
  - [ ] Column assignment strategy planned
- [ ] **Systematic Model Updates**: ALL models updated with appropriate strategy
  - [ ] Header rows updated with NIRMS column headers (using exact text from spec)
  - [ ] Data rows updated with "Non-NIRMS" values (or spec-appropriate false value)
  - [ ] Model-specific rules applied correctly
- [ ] **Value Consistency**: Consistent value selection across all models
  - [ ] Non-NIRMS values match specification exactly
  - [ ] Null handling preserves intentional test patterns
- [ ] **File Integrity**: Updated file maintains quality standards  
  - [ ] JavaScript syntax remains valid
  - [ ] Module exports structure preserved
  - [ ] Indentation and formatting maintained
  - [ ] File imports successfully in test environment
- [ ] **Test Validation**: Updates verified through testing
  - [ ] Parser unit tests pass with updated data
  - [ ] No regressions introduced in existing functionality
  - [ ] Error scenarios still function as intended
- [ ] **Documentation**: Changes properly documented
  - [ ] Update summary provided
  - [ ] Rationale for column assignments documented
  - [ ] Any deviations from standard pattern explained

## Error Handling

**If specification not found:**
- List available `.spec/coo/AB*-spec.md` files  
- Suggest correct ticket ID format
- Provide guidance on specification location

**If auto-detection fails:**
- Show parsed retailer name and model number
- List available models for the detected retailer
- Suggest manual verification of specification filename format

**If test data file not found:**
- Display auto-detected path for verification
- List available model files in retailer directory
- Suggest checking retailer name spelling or model number

**If column mapping unclear:**
- Request clarification on NIRMS column location
- Provide examples of column mapping from spec
- Suggest manual column assignment if needed

**If tests fail after updates:**
- Analyze failure reasons systematically
- Check if CoO validation is inadvertently triggered
- Verify non-NIRMS values are recognized correctly
- Review column header format accuracy

## Success Criteria

**A successful test data update will result in:**

1. ✅ **Specification Compliance**: Updates follow ADO ticket specification exactly
2. ✅ **Universal Principle Adherence**: Follows "test data should have non-NIRMS values" principle  
3. ✅ **Complete Model Coverage**: ALL model objects in file updated appropriately
4. ✅ **Consistent Value Usage**: Same non-NIRMS values used throughout file
5. ✅ **Test Compatibility**: Existing unit tests continue to pass
6. ✅ **Syntax Preservation**: JavaScript file remains syntactically valid
7. ✅ **Structure Integrity**: Original test data structure and patterns maintained
8. ✅ **Future Readiness**: Test data prepared for CoO validation implementation

## Example Usage

### Command Example
```
Follow instructions in [add-non-nirms-to-existing-test-data.prompt.md]. AB#591514
```

**Auto-Detection Output:**
```
✅ Found specification: .spec/coo/AB591514-asda3-coo-validation-spec.md
✅ Auto-detected path: test/unit/test-data-and-results/models/asda/model3.js
   Retailer: asda, Model: 3
✅ Test data file confirmed: test/unit/test-data-and-results/models/asda/model3.js
```

### Expected Outcome
- Test data models updated with "Non-NIRMS" values in NIRMs/Non-NIRMs column (using exact header from specification)
- All existing test patterns preserved (empty rows, missing data, incorrect headers)
- Unit tests continue to pass without CoO validation failures
- **ONLY** the NIRMs/Non-NIRMs column added - no other CoO columns

### Auto-Detection Examples

**Different Retailers and Models:**
- `AB#591514` → `asda3` → `test/unit/test-data-and-results/models/asda/model3.js`
- `AB#591516` → `bandm` → `test/unit/test-data-and-results/models/bandm/model1.js` (default to model1)
- `AB#603666` → `asda4` → `test/unit/test-data-and-results/models/asda/model4.js`
- `AB#591539` → `sainsburys` → `test/unit/test-data-and-results/models/sainsburys/model1.js`

### Before/After Example (Per-Model Column Assignment)
```javascript
// EXAMPLE 1: Most models (validModel, emptyModel, etc.) - use column J
// BEFORE - Models that only use columns B-I
validModel: {
  Page1_1: [
    {
      B: "Description Of All Retail Goods",
      C: "Nature of Product", 
      // ... existing columns B through I only
      I: "kilograms/grams",
    },
    {
      B: "100000261 DAILY CROISSANT CHOCO 1PK",
      C: "Bakery Bought In",
      // ... existing data B through I
      I: "kgs",
    },
  ]
}

// AFTER - These models get column J (next after their highest column I)
validModel: {
  Page1_1: [
    {
      B: "Description Of All Retail Goods",
      C: "Nature of Product",
      // ... existing columns (ALL UNCHANGED)
      I: "kilograms/grams", 
      J: "NIRMs/Non-NIRMs",      // ← NIRMs header in column J (next after I)
    },
    {
      B: "100000261 DAILY CROISSANT CHOCO 1PK",
      C: "Bakery Bought In", 
      // ... existing data (ALL UNCHANGED)
      I: "kgs",
      J: "Non-NIRMS",            // ← NIRMs value in column J
    },
  ]
}

// EXAMPLE 2: multipleRms model - use column K  
// BEFORE - multipleRms model that uses columns B-J (including J for RMS data)
multipleRms: {
  Page1_1: [
    {
      B: "Description Of All Retail Goods",
      C: "Nature of Product", 
      // ... existing columns
      I: "kilograms/grams",
    },
    {
      B: "100000261 DAILY CROISSANT CHOCO 1PK",
      C: "Bakery Bought In",
      // ... existing data
      I: "kgs",
      J: "RMS-GB-000015-005",    // ← This model uses column J for RMS data!
    },
  ]
}

// AFTER - multipleRms gets column K (next after its highest column J)
multipleRms: {
  Page1_1: [
    {
      B: "Description Of All Retail Goods",
      C: "Nature of Product",
      // ... existing columns (ALL UNCHANGED)
      I: "kilograms/grams", 
      K: "NIRMs/Non-NIRMs",      // ← NIRMs header in column K (next after J)
    },
    {
      B: "100000261 DAILY CROISSANT CHOCO 1PK",
      C: "Bakery Bought In", 
      // ... existing data (ALL UNCHANGED)
      I: "kgs",
      J: "RMS-GB-000015-005",    // ← Existing RMS data preserved exactly
      K: "Non-NIRMS",            // ← NIRMs value in column K
    },
  ]
}
```

This ensures that when CoO validation is implemented for the specific model, existing test data won't fail validation due to missing NIRMS values, following the Universal Implementation Principle that "test data for existing unit tests should have non-NIRMS values."

**🔑 KEY PRINCIPLE: Per-Model Column Assignment**

The critical lesson from this implementation is that column detection must be done **per-model**, not globally:

- **✅ CORRECT**: Each model analyzes its own column usage and gets its own next available column
- **❌ WRONG**: Analyzing all models globally and applying the same column to all models

This approach ensures optimal column usage where each model uses exactly the column it needs, rather than over-assigning columns based on other models' requirements.