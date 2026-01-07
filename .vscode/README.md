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
