# Clean Code React MCP Server

A Model Context Protocol (MCP) server that provides comprehensive React and TypeScript pattern guidance for AI coding assistants.

## Overview

Clean Code React helps AI coding assistants writeN better React/TypeScript code by providing:

- **Essential Patterns**: From basic Container/Presentational to advanced Builder and Factory patterns
- **Bad vs Good Examples**: Compare problematic code with improved solutions
- **Detailed Guidance**: Comprehensive descriptions, use cases, and best practices
- **Pattern Discovery**: Get an overview of all patterns or dive deep into specific ones

## Usage

### Typical Configuration

```json
{
  "mcpServers": {
    "clean-code-react": {
      "command": "npx",
      "args": ["clean-code-react@latest"]
    }
  }
}
```

### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=clean-code-react&config=eyJjb21tYW5kIjoibnB4IGNsZWFuLWNvZGUtcmVhY3RAbGF0ZXN0In0%3D)

### Claude Code

```bash
claude mcp add clean-code-react npx clean-code-react@latest
```

### VS Code

```bash
code --add-mcp '{"name":"clean-code-react","command":"npx","args":["clean-code-react@latest"]}'
```

## What You Get

This MCP server provides AI coding assistants with access to:

- **Essential React Patterns** - From basic Container/Presentational to advanced Builder and Factory patterns
- **Code Quality Fundamentals** - Four principles of writing good code: Readability, Predictability, Cohesion, and Coupling
- **Bad vs Good Examples** - Compare problematic code with improved solutions
- **Best Practices** - Comprehensive guidance and common mistakes to avoid

## Available Patterns

### React Patterns

- **Container/Presentational** - Separate data logic from presentation
- **Render Props** - Share code between components using render props
- **Compound Component** - Create flexible, composable component APIs
- **Higher-Order Component** - Enhance components with additional functionality

### Architecture Patterns

- **Dependency Injection** - Manage dependencies and improve testability
- **Service Layer** - Organize business logic and external integrations
- **Adapter Pattern** - Bridge incompatible interfaces

### Code Quality Patterns

- **Declarative Programming** - Write more readable, maintainable code
- **Prop Drilling Solutions** - Solve prop drilling with modern techniques

### Design Patterns

- **Builder Pattern** - Construct complex objects step by step
- **Factory Pattern** - Create objects without specifying exact classes
- **Strategy Pattern** - Define algorithms and make them interchangeable

## How to Use

Simply ask your AI coding assistant to use the clean-code-react MCP server when working on React code:

### Examples

**Refactor existing code:**

```text
"Refactor this component using clean-code-react mcp"
```

**Build new features:**

```text
"Build a user settings page using clean-code-react mcp"
```

**Improve code quality:**

```text
"Apply clean-code-react mcp's quality fundamentals to improve this code"
```

The AI assistant will automatically discover and apply the most appropriate patterns and principles for your specific use case.

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

```text
src/
├── patterns/        # Pattern definitions with colocated data
├── tools/           # MCP tool implementations
├── types/           # TypeScript type definitions
├── server.ts        # Core server setup with all tools
└── index.ts         # Entry point with stdio transport
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all patterns have bad/good examples
5. Update pattern descriptions and use cases
6. Submit a pull request

## License

MIT
