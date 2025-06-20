# Clean React MCP Server

A Model Context Protocol (MCP) server that provides systematic code quality guidance for React and Next.js developers.

## Overview

Clean React helps developers write better React/Next.js code by providing:

- A comprehensive quality checklist for code review
- Pattern-based solutions for common issues
- Best practices guidance with real examples

## Installation

```bash
npm install -g clean-react
```

## Usage

### Configure with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "clean-react": {
      "command": "clean-react"
    }
  }
}
```

### Available Tools

1. **`get_quality_checklist`** - Get a comprehensive quality checklist for React/Next.js components

   - Optional: Filter by category (Component Structure, State Management, etc.)

2. **`fix_component_structure`** - Get patterns for fixing component structure issues
   - Handles large components, multiple responsibilities, poor organization

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Inspect server with MCP Inspector (for debugging)
npm run inspect
```

### MCP Inspector

The project includes the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) for debugging and development:

```bash
npm run inspect
```

This opens a web interface where you can:

- Test all available tools interactively
- Inspect tool schemas and responses
- Debug server behavior
- Validate MCP protocol implementation

## Architecture

The server follows a clean architecture pattern:

- `src/tools/` - MCP tool implementations with colocated pattern data
- `src/types/` - TypeScript type definitions
- `src/utils/` - MCP adapters and utilities
- `src/server.ts` - Core server setup
- `src/index.ts` - Entry point with stdio transport

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT
