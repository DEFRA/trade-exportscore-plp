---
description: "Add non-NIRMS values to existing test data models (streamlined version)"
mode: "agent"
model: GPT-5 mini (copilot)
tools: ['codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'extensions', 'editFiles', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks']
---

# Add Non-NIRMS Values to Existing Test Data Models (Streamlined)

## 1. Purpose
Add a single new NIRMS/Non-NIRMS column (exact header from spec) with "Non-NIRMS" values to existing test data models so new CoO validation does not fail legacy tests. No other CoO columns are added or modified. No existing data is shifted or altered.

## 2. Hard Scope & Rules (NO BEHAVIOUR CHANGE)
MANDATORY – ONLY do the following for the target model file:
1. Add the NIRMS column header (exact text from the ticket spec) to header rows.  
2. Populate every applicable data row with a non‑NIRMS value (prefer "Non-NIRMS").  
3. Use the next unused column letter per model (independent per exported model object).  
4. Do NOT shift, rename, delete, or reorder existing columns or values.  
5. Do NOT add Commodity Code, Country of Origin, Treatment Type columns.  
6. Keep intentional null / malformed / empty rows exactly as-is (only append new col if required).  
7. Use the same chosen column letter for all sheets inside that model.  
8. If a model already uses column J (e.g. `multipleRms`), place NIRMS in the next free column (e.g. K).  

## 3. Usage Command Pattern
```
Follow instructions in [add-non-nirms-to-existing-test-data.prompt.md]. <ADO_TICKET_ID>
```
Example:
```
Follow instructions in [add-non-nirms-to-existing-test-data.prompt.md]. AB#591514
```

## 4. Specification Discovery & Path Resolution
Given ticket `AB#<num>` locate spec: `.spec/coo/AB<num>-<retailer><model?>-coo-validation-spec.md`.

Steps:
```
TICKET_ID=${ADO_TICKET_ID#AB#}
SPEC_FILE=$(find .spec/ -name "*${TICKET_ID}*-spec.md" | head -1) || exit 1
```
Parse retailer + optional model number from filename (default model=1 if absent).  
Target test data path:
`test/unit/test-data-and-results/models/<retailer-lower>/model<modelNumber>.js`

Examples:
AB591514-asda3 → asda/model3.js  |  AB591516-bandm → bandm/model1.js  |  AB603666-asda4 → asda/model4.js  |  AB591539-sainsburys → sainsburys/model1.js

## 5. Extract From Spec
Required extraction only:
* Exact NIRMS column header text (e.g. `NIRMs/Non-NIRMs`).
* False (non‑NIRMS) value options: `No | Non-NIRMS | Non NIRMS | Red | N | R` (choose "Non-NIRMS" if available).
* True values are irrelevant here except to avoid using them for false rows.

## 6. Model File Analysis
For each exported model object (e.g. `validModel`, `multipleRms`, `invalidModel_MissingColumnCells`, etc.):
1. Gather all column letters used across all its sheets & rows.  
2. Determine highest letter (lexicographically).  
3. NewColumn = next letter after highest (e.g. I→J, J→K).  
4. Add header cell with extracted NIRMS header.  
5. For every data row (non-empty object after header) add `NewColumn: "Non-NIRMS"` unless the row is intentionally empty `{}` or solely a placeholder (retain emptiness).  
6. Preserve null/missing patterns elsewhere.  

Pseudo:
```javascript
function nextColumn(used) {
  if (!used.length) return 'A';
  const last = used.sort().at(-1);
  return String.fromCharCode(last.charCodeAt(0) + 1);
}
```

CRITICAL: Do NOT compute this globally; compute per model object independently.

## 7. Model-Specific Nuances (UNCHANGED LOGIC)
* `multipleRms`: may already occupy column J → use K. Preserve RMS values in J.
* `incorrectHeader` / `incorrectHeaderMultiple`: Only add the column to correct header rows (do not “fix” intentionally wrong headers). Still add value to data rows that follow those headers if they are considered data in tests.
* `validHeadersNoData`: Add header only. No data rows to populate.
* `emptyModel`: Add header; leave trailing empty row untouched.
* `invalidModel_MissingColumnCells`, `missingKgunit`: Populate only rows that already have substantive data; keep incomplete/null patterns intact.
* `wrongEstablishment*`: Treat like normal; add header/value while keeping wrong establishment patterns unchanged.

## 8. Value Choice
Primary: "Non-NIRMS".  
Fallback (if spec omits it): "No".  
Use exactly one consistent false value for all rows in the file.

## 9. Implementation Steps (Algorithm)
1. Load file AST or treat as plain JS object text (simple find/replace acceptable if safe).  
2. For each exported model key: collect columns → decide `nirmsCol`.  
3. Insert header field `nirmsCol: <HeaderText>` into each header row (first row of each sheet that already lists column headings).  
4. Append `nirmsCol: "Non-NIRMS"` to each qualifying data row.  
5. Do not reorder object keys (append at end for minimal diff).  
6. Save file.  
7. Syntax check (`node -c`).  
8. Run targeted unit tests: `npm run test:unit -- --testPathPattern="<retailer>.*model<modelNumber>"`.  

## 10. Verification Script Sketch
```javascript
Object.entries(models).forEach(([modelName, sheets]) => {
  Object.values(sheets).forEach(sheet => {
    if (!sheet.length) return;
    const header = sheet[0];
    const col = Object.entries(header).find(([,v]) => v && /nirms/i.test(v));
    console.log(modelName, 'headerHasNirms', !!col);
  });
});
```

## 11. Testing
1. Syntax: `node -c <file>`.  
2. Import: `require(file)` (ensure no runtime errors).  
3. Run unit tests pattern; must pass with zero regressions.  

## 12. Quality Checklist (ALL must be true)
| Area | Requirement |
|------|-------------|
| Spec | Spec file found & header text extracted |
| Column Strategy | Per-model next free column chosen |
| Headers | NIRMS header added to every legitimate header row |
| Data Rows | All data rows populated with consistent non-NIRMS value |
| Integrity | No existing values modified / shifted |
| Null Patterns | Original null / missing patterns preserved |
| Isolation | Only target model file changed |
| Syntax | File parses successfully |
| Tests | All relevant unit tests pass |
| Documentation | Change rationale (column letter) explained in PR if needed |

## 13. Error Handling (Standard Responses)
* Spec not found → list available `.spec/coo/*-spec.md` and abort.  
* Path parse failure → echo derived basename for manual correction.  
* Test data file missing → list retailer directory contents.  
* Column ambiguity → request clarification; default to next unused letter strictly.  
* Test failures → re-check: header spelling, column insertion side-effects, unintended mutation.  

## 14. Success Criteria
1. Exact header added; no other CoO columns introduced.  
2. All models in file updated consistently with independent column selection.  
3. Non-NIRMS values present everywhere required.  
4. No regressions (all tests green).  
5. Structure, formatting, semantics preserved.  
6. Ready for future CoO validation enablement without retrofitting.

## 15. Minimal Before / After Illustration
Most models (highest column I): add J.
```
Header BEFORE: ... I: "kilograms/grams"
Header AFTER : ... I: "kilograms/grams", J: "NIRMs/Non-NIRMs"
Data   BEFORE: ... I: "kgs"
Data   AFTER : ... I: "kgs", J: "Non-NIRMS"
```
`multipleRms` (already uses J): add K preserving J RMS data.
```
RMS Row BEFORE: J: "RMS-GB-000015-005"
RMS Row AFTER : J: "RMS-GB-000015-005", K: "Non-NIRMS"
```

## 16. Key Principle (Must Not Change)
Per-model column detection ONLY. Never choose a global maximum. Never rewrite existing data. Only append exactly one new column per model.

## 17. Output Expectation
After execution the file diff shows ONLY added `NIRMs/Non-NIRMs` headers and `Non-NIRMS` data fields at the end of relevant row objects (or K for special case like `multipleRms`). No other alterations.

---
End of streamlined prompt. Logic & behaviour remain identical to the original verbose version; only redundancy removed and ordering optimized for execution.
