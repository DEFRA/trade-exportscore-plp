---
description: "Generate test data scenarios for net weight validation in the net-weight folder. Strictly follow the scenario list and mutation instructions below."
mode: "agent"
---


# Net Weight Tests Scenario Generation and Seeding

Generate and seed test data and Excel/CSV files for net weight validation scenarios. Each scenario must be based on the provided happy path sample file, with targeted mutations as described below. All files must be placed in `test-scenarios/net-weight/`.

## Instructions to Create and Seed Data

1. **Copy the happy path sample file** to each scenario filename in `app/packing-lists/{exporter}/test-scenarios/net-weight/` using PowerShell or CLI. Do not create blank files from scratch.
2. **For each scenario below,** use MCP Excel tools to apply the described mutations to the copied file. Never modify the original template file.
3. **For each scenario,** modify only the header row.
4. **After mutation,** verify that the file is no longer identical to the template.
5. **Track mutation progress** using PowerShell commands to ensure all files have been modified.

## Scenarios (STRICTLY FOLLOW THIS LIST)

- failurereason-net-weight-no-kilos: Change the header matched by the exporter's `total_net_weight_kg` regex to 'Net Weight' (removes 'Kilos').
- failurereason-net-weight-lbs: Change the header matched by the exporter's `total_net_weight_kg` regex to 'Net Weight (lbs)' (uses pounds instead of kilos).

## Documentation: Net Weight Scenario Types

- **failurereason-net-weight-no-kilos**: The header matched by the exporter's `total_net_weight_kg` regex is changed to 'Net Weight' (removes 'Kilos').
- **failurereason-net-weight-lbs**: The header matched by the exporter's `total_net_weight_kg` regex is changed to 'Net Weight (lbs)' (uses pounds instead of kilos).

## Output
- Place all generated files in `app/packing-lists/{exporter}/test-scenarios/net-weight/`.
- Ensure all files have appropriate mutations applied.
