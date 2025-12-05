# Data files for PLP service

This folder contains static reference data used by the Packing List Parser (PLP) service.

Files

- `data-iso-codes.json` — ISO country codes and related mappings used to normalise and validate `country_of_origin` fields parsed from packing lists.
- `data-ineligible-items.json` — Current consolidated list of prohibited items and categories used by business validation checks.
- `data-ineligible-items/` — Versioned prohibited items files. Each file is a snapshot used for historic or versioned validation.

Usage notes

- Consumers should treat these files as read-only reference data.
- When updating prohibited items, add a new versioned file under `data-ineligible-items/` and update `data-ineligible-items.json` to reference the new version if needed.
- Loading should be done once at service start and cached; avoid repeatedly reading from disk on each request.

Conventions

- Files are JSON and expected to be UTF-8 encoded.
- Keep file names stable and add semantic version suffixes for any breaking changes.

Contact

- If you need to update these files, open a PR and include a short changelog entry describing the reason for the change.
