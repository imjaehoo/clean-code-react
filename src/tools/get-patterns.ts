import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getAllPatternOverviews, getPatternOverview } from '../patterns/index.js';
import type { PatternOverviewResponse } from '../types/index.js';

export function getPatternById(id: string) {
  return getPatternOverview(id);
}

export const getPatternsTool: Tool = {
  name: 'get_patterns',
  description:
    'Get an overview of all available React patterns and best practices. Use this first to discover which patterns you need, then call specific pattern tools for detailed guidance.',
  inputSchema: {
    type: 'object',
  },
};

export async function handleGetPatterns(): Promise<PatternOverviewResponse> {
  const patterns = getAllPatternOverviews();

  return {
    patterns: patterns.map((pattern) => ({
      name: pattern.name,
      description: pattern.description,
      whenToUse: pattern.whenToUse,
      toolName: pattern.toolName,
    })),
    usage: {
      nextStep:
        'Choose a pattern that fits your needs and call the corresponding tool(s) for detailed guidance and examples',
      example:
        "Call 'get_container_presentational_pattern' for detailed Container/Presentational pattern implementation",
    },
  };
}
