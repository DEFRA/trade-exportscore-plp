# MCP Server Configuration

This directory contains the Model Context Protocol (MCP) server configuration for the trade-exportscore-plp project.

## What is MCP?

MCP is a protocol that enables AI Assistants (like GitHub Copilot) to securely fetch context from external systems when responding to your requests. This helps the AI provide more accurate, project-specific assistance by accessing real project data.

## Configured MCP Servers

This project uses the following approved MCP servers:

### 1. GitHub MCP Server

- **Type**: Remote (vendor-hosted)
- **Purpose**: Access GitHub repositories, pull requests, issues, and code search
- **Configuration**: HTTP connection to `https://api.githubcopilot.com/mcp/`

### 2. Azure DevOps MCP Server

- **Type**: Local (stdio)
- **Purpose**: Access Azure DevOps work items, queries, backlogs, and iterations
- **Configuration**: Runs via `npx @azure-devops/mcp defragovuk`
- **Organization**: defragovuk

### 3. SonarQube MCP Server

- **Type**: Local (Docker-based)
- **Purpose**: Access SonarCloud analysis results, quality gates, code issues, and metrics
- **Configuration**: Runs via Docker container `mcp/sonarqube`
- **Organization**: defra
- **Project Key**: trade-exportscore-plp

#### SonarQube MCP Capabilities

The SonarQube MCP server provides access to:

- **Quality Gate Status**: Check if the project passes quality gate conditions
- **Code Metrics**: Retrieve metrics like coverage, duplications, complexity, lines of code
- **Issue Management**: Search and analyze code quality issues (bugs, vulnerabilities, code smells)
- **Security Analysis**: Access security hotspots and vulnerability details
- **Rule Information**: Get detailed information about SonarQube rules
- **Code Analysis**: Analyze code snippets using SonarQube analyzers

#### Authentication Setup

To use the SonarQube MCP server, you need to configure authentication:

1. **Create a SonarCloud Token**:
   - Log in to [SonarCloud](https://sonarcloud.io)
   - Go to **My Account** → **Security**
   - Generate a new token with appropriate permissions

2. **Configure Local Environment**:
   - Create a `.env` file in the project root (if it doesn't exist)
   - Add your token: `SONARQUBE_TOKEN=your_sonarcloud_token_here`
   - **Important**: The `.env` file is in `.gitignore` - never commit it!

3. **Verify Configuration**:
   - Restart VS Code to reload the MCP server
   - The SonarQube MCP should authenticate automatically

#### Example Usage

Common SonarQube MCP queries:

- "What's the quality gate status for the main branch?"
- "Show me all open bugs in the project"
- "Get the test coverage metrics"
- "Explain the SonarQube rule javascript:S3403"
- "Search for security vulnerabilities in the project"

#### Alternative Configuration (Java-based)

The project also supports a Java-based SonarQube MCP configuration (commented out in `mcp.json`). This requires:

- Java Runtime Environment (JRE)
- SonarQube MCP JAR file downloaded locally
- Direct token configuration in environment variables

The Docker-based approach is recommended for consistency across development environments.

## DEFRA MCP Guidance Compliance

All MCP servers configured in this project must follow DEFRA MCP guidance as documented at:
**https://defra.github.io/defra-ai-sdlc/pages/appendix/defra-mcp-guidance.html**

### Key Requirements

✅ **Use only vendor-provided MCP servers** - GitHub and Azure DevOps are approved  
✅ **OAuth-based authentication** - Where available, use OAuth instead of PATs  
✅ **Human-in-the-loop** - Always review MCP tool calls before execution  
✅ **Least-privilege access** - Connect only to required repositories and projects  
✅ **No sensitive data** - Exclude sensitive, personal, or client-confidential data from prompts

### Security Rules

- **Never auto-approve MCP actions** - Review tool calls before they run
- **Use approved connectors only** - Do not add community or self-built MCP servers
- **Keep security tooling active** - Secret scanning, dependency scanning, SonarQube
- **Redact secrets** - Never include credentials or API keys in prompts
- **Document AI usage** - Record material AI assistance in project documentation

## When to Use MCP

✅ Use MCP when you need to:

- Query Azure DevOps work items and sprint information
- Search GitHub repository code and history
- Create or update tickets based on development work
- Access approved external work systems with proper authentication
- Review SonarQube code quality metrics and quality gate status
- Investigate and fix code quality issues flagged by SonarQube
- Analyze security vulnerabilities and code smells
- Track technical debt and maintainability ratings

❌ Do not use MCP when:

- Handling Official-Sensitive, SEC2/SEC3, or personal data
- Connecting to unapproved or community MCP servers
- AI tool usage has not been explicitly approved

## Support

For questions or concerns about MCP usage in DEFRA projects:

- Review the [DEFRA AI SDLC Playbook](https://defra.github.io/defra-ai-sdlc/)
- Contact the ACE team for approvals and guidance
- Consult your Project Architect for project-specific policies

## Configuration File

MCP servers are configured in `mcp.json` in this directory. Changes to MCP configuration should be reviewed by the team and must comply with DEFRA governance standards.
