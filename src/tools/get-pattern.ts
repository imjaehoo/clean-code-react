import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern, getPatternIds } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

export const getPatternTool: Tool = {
  name: 'get_pattern',
  description:
    'Get detailed information about a specific React pattern with comprehensive examples and implementation guidance.',
  inputSchema: {
    type: 'object',
    properties: {
      patternId: {
        type: 'string',
        description: 'The ID of the pattern to retrieve',
        enum: getPatternIds(),
      },
    },
    required: ['patternId'],
  },
};

export function handleGetPattern(patternId: string): DetailedPatternResponse {
  const pattern = getDetailedPattern(patternId);
  assert(pattern, `Pattern '${patternId}' not found`);
  return { pattern };
}
