# Remove Parser Model Prompt

You are a coding agent tasked with removing a deprecated parser model from the PLP codebase. The only input is the MODEL KEY (e.g., `DAVENPORT1`, `TESCO2`). Perform all changes atomically and validate by running unit tests.

Input variables:
- MODEL_KEY: The registry key used in `model-parsers.js` and `parser-model.js` (e.g., DAVENPORT1). Derive the following internally:
   - RETAILER_DIR: from MODEL_KEY by stripping trailing digits and lowercasing (e.g., DAVENPORT1 -> davenport).
   - MODEL_NUMBER: the trailing variant number (e.g., DAVENPORT1 -> 1).

Steps:
1. Update enumeration and registries
   - Edit `app/services/parser-model.js`: remove the `MODEL_KEY` entry from the `ParserModel` object.
   - Edit `app/services/model-parsers.js`:
     - Remove `require` statements for the matcher and parser for `MODEL_KEY`.
     - Remove the entry under the appropriate group:
       - Excel: `parsersExcel[MODEL_KEY]`
       - CSV: `parsersCsv[MODEL_KEY]`
       - PDF AI: `parsersPdf[MODEL_KEY]`
       - PDF Non-AI: `parsersPdfNonAi[MODEL_KEY]`

2. Update model headers
   - Edit `app/services/model-headers/<RETAILER_DIR>.js` and remove the `MODEL_KEY` block entirely (e.g., `DAVENPORT1: { ... }`). Ensure remaining models are valid JSON and export unchanged.

3. Delete matcher and parser source files
   - Delete `app/services/matchers/<RETAILER_DIR>/model<MODEL_NUMBER>.js`.
   - Delete `app/services/parsers/<RETAILER_DIR>/model<MODEL_NUMBER>.js`.

4. Delete unit tests and test data/results
   - Delete matcher tests: `test/unit/services/matchers/<RETAILER_DIR>/model<MODEL_NUMBER>.test*.js`.
   - Delete parser tests: `test/unit/services/parsers/<RETAILER_DIR>/model<MODEL_NUMBER>.test*.js` and `test/unit/services/parser-service/<RETAILER_DIR>/model<MODEL_NUMBER>.test*.js`.
   - Delete test data: `test/unit/test-data-and-results/models/<RETAILER_DIR>/model<MODEL_NUMBER>.js`.
   - Delete expected results: `test/unit/test-data-and-results/results/<RETAILER_DIR>/model<MODEL_NUMBER>.js`.
   - Remove any cross-file imports referencing the deleted results (e.g., another retailer’s results importing `../<RETAILER_DIR>/model<MODEL_NUMBER>`); inline or replace with local fixtures.

5. Validation
   - Run unit tests: `npm run test:unit`.
   - If any import or reference errors occur, grep for `MODEL_KEY` and `<RETAILER_DIR>/model<MODEL_NUMBER>` and remove or refactor remaining references.

6. Documentation cleanup
   - Search the repository for references to `MODEL_KEY` and the retailer model in documentation and instructions (e.g., `README.md`, `.github/prompts/**`, `.github/copilot-instructions.md`, `MDM-INTEGRATION.md`).
   - Remove or update any mention of the deprecated model so docs are consistent, but ignore specification files.

Assumptions:
- MODEL_KEY maps to files named `model<MODEL_NUMBER>.js`.
- RETAILER_DIR exists under both `matchers` and `parsers` and within test directories.

Success criteria:
- All references to MODEL_KEY are removed.
- Unit tests pass with no broken imports.
- Headers file remains syntactically correct and exports expected remaining models.
