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

export function handleGetPatterns(): PatternOverviewResponse {
  const patterns = getAllPatternOverviews();

  return {
    patterns: patterns.map((pattern) => ({
      name: pattern.name,
      description: pattern.description,
      whenToUse: pattern.whenToUse,
      patternId: pattern.id,
    })),
    usage: {
      nextStep:
        'Choose pattern(s) that fits your needs and call get_pattern with the patternId for detailed guidance and examples. Be careful not to over-engineer - start simple and add complexity only when needed.',
      example:
        "Call get_pattern with patternId 'container-presentational' for detailed Container/Presentational pattern implementation",
    },
  };
}
