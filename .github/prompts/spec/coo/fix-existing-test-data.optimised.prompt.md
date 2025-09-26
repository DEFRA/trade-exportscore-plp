---
description: "Add non-NIRMS values to existing test data models (streamlined version)"
mode: "agent"
model: GPT-5 mini (copilot)
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
Required extraction only (dynamic — DO NOT hard-code):
- Exact NIRMS column header text (e.g. `NIRMs/Non-NIRMs`).
- False (non‑NIRMS) and true value tokens (the spec will typically list accepted values for the NIRMS field). Parse the spec file to extract these tokens rather than using a static list. Use the first available false-value token found (prefer `Non-NIRMS` if present).
- True values are only needed to avoid accidentally using them for false rows; treat them as additional tokens to exclude.

Notes on extraction: specs commonly present tokens as a pipe-separated list, a comma-separated list, or inline backtick examples. Use a forgiving parser that looks for common anchors ("False", "Non-NIRMS", "No", "Options:", backticked lists, or pattern groups like `No | Non-NIRMS | ...`). If extraction fails, fall back to the safe default set: [`Non-NIRMS`, `No`].

## 6. Model File Analysis
For each exported model object (e.g. `validModel`, `multipleRms`, `invalidModel_MissingColumnCells`, etc.):
1. Collect the set of all column letters used anywhere in the model object across all sheets and rows (headers and data rows). This MUST include keys that appear only in data rows — do not rely on header-only inspection.
2. If any existing column letter already maps to a header value that matches the exact NIRMS header text (case-insensitive), then no new column is required for that model — use that column and (if necessary) ensure every sheet's header contains the same mapping.
3. Else, search existing data cells for NIRMS-like tokens using the token set extracted from the spec (case-insensitive). If any existing column contains at least one cell matching a false or true NIRMS token, prefer that column as the NIRMS column (this covers cases where test-data rows were populated but the header was accidentally omitted; example: `multipleRms` used `K` in data but lacked the `K` header). If more than one column contains NIRMS-like values, pick the rightmost one (highest letter) among them to avoid overwriting existing header/data in earlier columns.
4. If no existing column appears to be the NIRMS column, choose `NewColumn` = next letter after the highest-used column letter (per-model). Example: I → J, J → K.
5. Add the NIRMS header cell (`NewColumn: <ExactHeaderText>`) into every header object (every sheet's header row) for that model object. If a matching header column already exists (step 2) ensure every sheet's header gets the header text added to that same letter.
6. For every qualifying data row (non-empty object after header) that does not already have an NIRMS value in the chosen column, append `ChosenColumn: "Non-NIRMS"`. Do NOT populate intentionally-empty rows (`{}`), or rows that intentionally omit values.
7. Preserve null/missing patterns and do not shift or rename any existing keys.

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
1. Load the file as JS text and parse the exported models (or use an AST-based approach if comfortable). A safe plain-text JS-object edit is acceptable so long as keys are not reordered.
2. For each exported model object (do this independently per model):
  a. Collect the union of column letters present in every sheet's header row and every data row object.
  b. If an existing header cell already matches the exact NIRMS header text (case-insensitive), set `chosenCol` to that letter and continue.
  c. Else, inspect data cells for NIRMS-like tokens (false/true values from the spec). If any column contains such tokens, set `chosenCol` to the rightmost column (highest letter) among those columns.
  d. Else, compute `chosenCol` = next letter after the highest-used column letter in the union set.
3. For each sheet in the model object, ensure the sheet's header object includes `chosenCol: <ExactHeaderText>` (append at end of that object if necessary). If a sheet has no header (edge case), create a header object as the first element with only the new header column added (do this only when safe — prefer leaving untouched sheets that are intentionally headerless).
4. For each data row object in every sheet, if the row is non-empty and does not already contain a value at `chosenCol`, append `chosenCol: "Non-NIRMS"` (or chosen fallback) at the end of that object. Do not populate rows that are `{}` or intentionally malformed.
5. Preserve all other keys and value ordering where possible; append only.
6. Save file and run a syntax-only parse: `node -c <file>`.
7. Optionally `require()` the file to ensure runtime parsing succeeds (no side-effects expected in test-data files).
8. Run targeted unit tests: `npm run test:unit -- --testPathPattern="<retailer>.*model<modelNumber>" --runInBand`.

Implementation pseudo that encodes the above heuristics:
```javascript
function pickNirmsColumn(sheets, headerText, nirmsTokensRegex) {
  // Collect used letters in header and data rows
  const used = new Set();
  const dataCandidateCounts = {}; // letter -> match count

  Object.values(sheets).forEach(sheet => {
    if (!Array.isArray(sheet) || sheet.length === 0) return;
    const header = sheet[0] || {};
    Object.keys(header).forEach(k => used.add(k));
    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i] || {};
      Object.keys(row).forEach(k => {
        used.add(k);
        const v = String(row[k] ?? '').trim();
        if (nirmsTokensRegex.test(v)) dataCandidateCounts[k] = (dataCandidateCounts[k] || 0) + 1;
      });
    }
  });

  // 1) existing header match
  for (const sheet of Object.values(sheets)) {
    if (!Array.isArray(sheet) || sheet.length === 0) continue;
    const header = sheet[0] || {};
    for (const [k, v] of Object.entries(header)) {
      if (String(v).toLowerCase() === headerText.toLowerCase()) return k;
    }
  }

  // 2) prefer existing data column that contains NIRMS-like tokens (rightmost)
  const candidateCols = Object.keys(dataCandidateCounts);
  if (candidateCols.length) return candidateCols.sort().at(-1);

  // 3) fallback: next letter after highest used
  if (used.size === 0) return 'A';
  const highest = Array.from(used).sort().at(-1);
  return String.fromCharCode(highest.charCodeAt(0) + 1);
}
```

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
End of streamlined prompt.
