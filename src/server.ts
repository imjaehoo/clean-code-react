import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
  getCodeQualityFundamentalsTool,
  getPatternTool,
  getPatternsTool,
  handleGetCodeQualityFundamentals,
  handleGetPattern,
  handleGetPatterns,
} from './tools/index.js';
import { getVersion } from './version.js';

export function createServer() {
  const server = new Server(
    {
      name: 'clean-code-react',
      version: getVersion(),
    },
    {
      capabilities: {
        tools: {
          get_patterns: getPatternsTool,
          get_pattern: getPatternTool,
          get_code_quality_fundamentals: getCodeQualityFundamentalsTool,
        },
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [getPatternsTool, getPatternTool, getCodeQualityFundamentalsTool],
    };
  });

  const toolHandlers = new Map<string, (args?: Record<string, unknown>) => unknown>([
    ['get_patterns', handleGetPatterns],
    [
      'get_pattern',
      (args) => {
        if (!args || typeof args.patternId !== 'string') {
          throw new Error('patternId is required');
        }
        return handleGetPattern(args.patternId);
      },
    ],
    ['get_code_quality_fundamentals', handleGetCodeQualityFundamentals],
  ]);

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const handler = toolHandlers.get(name);
    if (!handler) {
      throw new Error(`Tool '${name}' not found`);
    }

    try {
      const result = handler(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: errorMessage }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
