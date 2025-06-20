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

## Available Tools

### Pattern Discovery

- **`get_patterns`** - Get an overview of all 11 available patterns with descriptions and use cases

### React Patterns

- **`get_container_presentational_pattern`** - Separate data logic from presentation
- **`get_render_props_pattern`** - Share code between components using render props
- **`get_compound_component_pattern`** - Create flexible, composable component APIs
- **`get_higher_order_component_pattern`** - Enhance components with additional functionality

### Architecture Patterns

- **`get_dependency_injection_pattern`** - Manage dependencies and improve testability
- **`get_service_layer_pattern`** - Organize business logic and external integrations
- **`get_adapter_pattern`** - Bridge incompatible interfaces

### Code Quality Patterns

- **`get_declarative_programming_pattern`** - Write more readable, maintainable code
- **`get_prop_drilling_solutions_pattern`** - Solve prop drilling with modern techniques

### Design Patterns

- **`get_builder_pattern`** - Construct complex objects step by step
- **`get_factory_pattern`** - Create objects without specifying exact classes
- **`get_strategy_pattern`** - Define algorithms and make them interchangeable

Each pattern tool provides:

- Comprehensive description and use cases
- Bad vs good code examples
- Best practices and common mistakes
- Related patterns and further reading

## Best Practices

### Using Clean Code React with AI Coding Assistants

1. **Refactor Existing Components**

   ```text
   "Refactor settings page using clean-code-react mcp"
   ```

2. **Design New Features**

   ```text
   "I need to build [feature description]. Implement using clean-code-react mcp."
   ```

3. **Code Reviews**

   ```text
   "Review this code using clean-code-react mcp"
   ```

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
├── adapters/        # MCP protocol adapters and type safety wrappers
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
