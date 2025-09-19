# GitHub Copilot Documentation Generator

## Context

Generate comprehensive README.md files for GitHub Copilot integration components in the Trade ExportsCore PLP project. This prompt provides a flexible framework for documenting any Copilot-related component while ensuring consistent, high-quality documentation across the project ecosystem.

## Objective

Create standardized README documentation for GitHub Copilot integration components that follows enterprise documentation standards and maintains consistency, while being flexible enough to accommodate new components, chat modes, prompt categories, or specifications.

## Usage Instructions

This prompt works in conjunction with the [Comprehensive README Generator](comprehensive-readme-generator.prompt.md). Specify the component details using the framework below, then the generator will be called with the appropriate parameters.

## Component Documentation Framework

### Step 1: Identify Component Type

Choose the appropriate component type and gather the required information:

#### Main Integration Hub (.github/)
- **Purpose**: Central coordination and overview
- **Audience**: Mixed (executives, technical teams, stakeholders)
- **Architecture**: MCP server integration, role-based assistants, quality gates
- **Key Content**: System overview, integration points, governance

#### Role-Based Assistants (chatmodes/)
- **Purpose**: Specialized AI assistance for specific roles/tasks
- **Audience**: Role-specific users (developers, devops, analysts, etc.)
- **Architecture**: Base instruction inheritance, role-specific overlays, workflow integration
- **Key Content**: Role definitions, workflows, mode-specific features

#### Reusable Templates (prompts/)
- **Purpose**: Standardized AI templates and tools
- **Audience**: All development team members
- **Architecture**: Category-based organization, standardized structure, version control
- **Key Content**: Template categories, usage patterns, maintenance procedures

#### Business Rules & Compliance (specifications/)
- **Purpose**: Regulatory requirements and validation rules
- **Audience**: Business analysts, compliance officers, developers
- **Architecture**: Rule-based validation, pipeline integration, audit trails
- **Key Content**: Validation rules, compliance requirements, implementation guidance

#### Custom Component Type
- **Purpose**: [Define the core function and business value]
- **Audience**: [Identify primary and secondary users]
- **Architecture**: [Describe high-level system design]
- **Key Content**: [Specify main documentation focus areas]

### Step 2: Gather Component Information

For your selected component type, collect the following details:

#### Basic Information
- **Component Name**: Full descriptive name
- **Location Path**: Relative path from repository root
- **Primary Purpose**: Core function and business value (1-2 sentences)
- **Creation Date**: When component was first implemented
- **Current Version**: Version or iteration number if applicable

#### Audience Analysis
- **Primary Audience**: Main users who interact with this component daily
- **Secondary Audience**: Occasional users, stakeholders, or related roles
- **Technical Level**: Range from executive summary to deep technical detail needed

#### Technical Architecture
- **Core Components**: Main parts or modules (scan directory structure)
- **Integration Points**: How it connects to other systems/components
- **Technology Stack**: Specific technologies, frameworks, or tools used
- **Dependencies**: External systems, libraries, or services required

#### Feature Discovery
- **Current Capabilities**: What it can do now (scan files for actual features)
- **Key Benefits**: Business/technical advantages it provides
- **Usage Patterns**: How it's typically used in workflows
- **Quality Features**: Built-in validation, error handling, monitoring

#### Context Integration
- **Project Role**: How it fits into the larger PLP system
- **Workflow Integration**: Where it appears in development/business processes
- **Related Components**: Other parts of the system it works with
- **Documentation Links**: Other relevant documentation (scan for actual files)

### Step 3: Auto-Discovery Patterns

To ensure accuracy and completeness, use these discovery patterns:

#### File Structure Analysis
```bash
# Scan directory structure to identify components
find [component-path] -type f -name "*.md" | head -20
find [component-path] -type f -name "*.js" | head -10
ls -la [component-path]/ | grep -E "(README|docs|spec)"
```

#### Content Pattern Recognition
- **Chat Modes**: Look for .chatmode.md files, identify role-specific patterns
- **Prompts**: Scan for .prompt.md files, identify category structures
- **Specifications**: Look for validation rules, business logic, compliance patterns
- **Integration**: Search for import/require statements, API calls, configuration

#### Link Validation
- Check existing README files for link patterns
- Identify cross-references between components
- Validate relative path structures
- Ensure documentation hierarchy consistency

### Step 4: Adaptation Guidelines

#### For New Chat Modes
- Follow role-based assistant pattern
- Include MCP tool integration priorities
- Define workflow patterns and quality gates
- Document interaction with prompt library

#### For New Prompt Categories
- Use standardized prompt structure
- Define category purpose and scope
- Include usage examples and patterns
- Document integration with chat modes

#### For New Specifications
- Follow business rule documentation pattern
- Include validation logic and compliance requirements
- Define implementation guidance
- Document audit and reporting capabilities

#### For New Integration Points
- Document API/interface contracts
- Include authentication and security considerations
- Define error handling and monitoring
- Specify performance and reliability requirements

## Execution Instructions

### Step 5: Generate Documentation

1. **Component Analysis**: Use the discovery patterns above to gather current information
2. **Type Selection**: Choose the appropriate component type framework
3. **Information Collection**: Gather all required details using the framework
4. **Generator Execution**: Call the comprehensive README generator with collected parameters
5. **Validation**: Ensure output meets all quality standards

### Workflow Example

**For Any New Component**:
```
1. Scan directory structure: ls -la [component-path]/
2. Identify component type: [Integration Hub/Role Assistant/Templates/Specifications/Custom]
3. Gather information using framework:
   - Component Name: [actual name from directory/files]
   - Primary Purpose: [derived from file analysis]
   - Target Audience: [based on component type pattern]
   - Technical Architecture: [from file structure and content]
   - Key Features: [from actual file content scan]
   - Usage Context: [from integration analysis]
   - Integration Points: [from code/config analysis]
   - Related Documentation: [from link analysis]

4. Execute comprehensive README generator with parameters
5. Validate against quality checklist
```

## Quality Standards

All generated documentation must:
- **Accuracy**: Based on actual file content and structure analysis, no assumptions
- **Flexibility**: Accommodate new components without changing the prompt
- **Consistency**: Follow established structure while adapting to component specifics
- **Evidence-Based**: Include only verifiable information and capabilities
- **Future-Proof**: Work for components that don't exist yet
- **Discovery-Driven**: Use scanning and analysis rather than hardcoded content

## Discovery Commands Reference

### File Structure Discovery
```bash
# Component overview
find [path] -type f -name "*.md" -o -name "*.js" -o -name "*.json" | sort

# README files analysis
find [path] -name "README*" -exec echo "=== {} ===" \; -exec head -10 {} \;

# Configuration files
find [path] -name "*.yaml" -o -name "*.yml" -o -name "*.json" | grep -E "(config|package)"

# Link analysis
grep -r "README.md\|\.md)" [path] | grep -E "\[.*\]\(.*\)"
```

### Content Pattern Discovery
```bash
# Chat mode identification
find [path] -name "*.chatmode.md" -exec basename {} .chatmode.md \;

# Prompt category discovery
find [path] -name "*.prompt.md" -exec dirname {} \; | sort -u

# Specification pattern discovery
find [path] -name "*-spec.md" -o -name "*-validation-*.md"
```

## Adaptation Patterns

### For New Component Types
1. **Analyze Structure**: Understand the component's file organization
2. **Identify Purpose**: Determine business value and technical function
3. **Map Audience**: Identify who uses this component and how
4. **Define Architecture**: Document technical implementation approach
5. **Catalog Features**: List actual capabilities based on file analysis
6. **Document Integration**: Show how it connects to existing ecosystem

### Maintenance Strategy
- **Regular Scans**: Periodically scan for new components using discovery patterns
- **Structure Validation**: Ensure new components follow established patterns
- **Link Maintenance**: Validate and update cross-references automatically
- **Version Tracking**: Document changes and evolution over time
- **Feedback Integration**: Incorporate usage patterns and improvements

---

**Prompt Version**: 1.0  
**Created**: September 2025  
**Dependencies**: comprehensive-readme-generator.prompt.md  
**Use Case**: Generate standardized GitHub Copilot integration documentation  
**Output Format**: Calls comprehensive README generator with pre-configured parameters
