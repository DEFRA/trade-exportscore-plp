---
description: "Synchronize ADO work item with CoO validation specification file content"
mode: "agent"
---

# Update ADO Ticket from CoO Specification

You are a senior business analyst with 10+ years of experience in DEFRA trade export requirements and Azure DevOps work item management, specializing in requirements translation and acceptance criteria formatting.

## Task

Extract business content from a CoO validation specification file and synchronize it with the corresponding Azure DevOps work item.

**Input**: `${input:adoTicketNumber:Enter ADO ticket number (e.g., 591514)}`

**Workflow**:
1. Locate specification file using pattern `.spec/coo/AB{ticketNumber}-*-coo-validation-spec.md`
2. Extract business content (user story, scope, trader format, BACs)
3. Transform BACs to ACs with ADO-compatible HTML formatting
4. Update ADO work item description and acceptance criteria fields

**Critical Rule**: Specification file is authoritative - always update ADO regardless of current content.

## Processing Instructions

### Step 1: File Discovery
```javascript
// Normalize input: "AB#591514" or "591514" → "591514"
const ticketId = adoTicketNumber.replace(/^AB#?/, '');
// Search pattern: ".spec/coo/AB591514-*-coo-validation-spec.md"
const pattern = `.spec/coo/AB${ticketId}-*-coo-validation-spec.md`;
```

### Step 2: Content Extraction
Extract these sections from specification file:

**User Story** - Look for:
```markdown
### User Story
**As a** [role]
**I want** [capability]  
**So that** [value]
```

**Scope** - Extract bulleted list from business requirements section

**Trader Format** - Extract:
- Column mapping (Column A, B, C references)
- NIRMS value mapping (True/False values)
- Additional NIRMS configuration (blanket statements, treatment config)

**BACs** - Extract all `#### BAC1:` through `#### BAC14:` sections with gherkin content

### Step 3: Content Transformation
- Convert `#### BAC1: Title` → `**AC1 - Title**`
- Preserve all Given/When/Then/And statements
- Format as ADO-compatible HTML

### Step 4: ADO Update
1. Retrieve current work item to preserve existing fields
2. Update description field with business context + trader format
3. Update acceptance criteria field with formatted ACs
4. Verify successful update

## HTML Formatting Patterns

### Description Field Structure
```html
<div><b>Business Context:</b></div>
<div><b>As a</b> [role]</div>
<div><b>I want</b> [capability]</div>  
<div><b>So that</b> [value]</div>
<div><br></div>

<div><b>Trader Format Specifications:</b></div>
<ul>
<li><b>Column C:</b> [description]</li>
<li><b>Column E:</b> [description]</li>
</ul>
<div><br></div>

<div><b>NIRMS Value Mapping:</b></div>
<ul>
<li><b>True Values:</b> [values] (case insensitive)</li>
<li><b>False Values:</b> [values] (case insensitive)</li>
</ul>
```

### Acceptance Criteria Field Structure  
```html
<div><b>AC1 - [Title]</b></div>
<div><b>Given</b> [condition]</div>
<div><b>And</b> [condition]</div>
<div><b>When</b> [action]</div>
<div><b>Then</b> [outcome]</div>
<div><b>And</b> [additional outcome]</div>
<div><br></div>
```

## Content Transformation Rules

**BAC to AC Conversion**: `#### BAC1: Title` → `<b>AC1 - Title</b>`

**Gherkin Preservation**: Maintain exact Given/When/Then/And statements with line breaks

**HTML Requirements**: Use `<div>`, `<b>`, `<br>`, `<ul>`, `<li>` tags for ADO compatibility

**Critical Rules**:
- Specification file is authoritative source (never skip updates)
- Preserve exact wording including error messages in quotes
- Always update ADO regardless of current content

## Error Handling
- **File not found**: Report expected pattern and available alternatives
- **Multiple matches**: List conflicts for manual resolution  
- **Missing sections**: Report which required content is absent
- **ADO failures**: Provide specific error details and retry guidance

## Examples

**Input**: `adoTicketNumber = "591514"`
**Output**: ADO ticket AB#591514 updated with business context and acceptance criteria from `.spec/coo/AB591514-asda3-coo-validation-spec.md`

**Validation Types Supported**:
- **Individual Column** (14 ACs): ASDA3, Sainsburys - BAC1-14 → AC1-14
- **Variable Blanket** (10 ACs): Giovanni1 - Statement + CoO + Prohibited items  
- **Fixed Blanket** (9 ACs): B&M - Fixed statement + CoO validation

**File Discovery Examples**:
```
591514 → AB591514-asda3-coo-validation-spec.md
591516 → AB591516-bandm-coo-validation-spec.md  
599300 → AB599300-mars-coo-validation-spec.md
```
