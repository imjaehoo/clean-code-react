import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

export const getDeclarativeProgrammingPatternTool: Tool = {
  name: 'get_declarative_programming_pattern',
  description:
    'Get detailed information about the Declarative Programming pattern for transforming imperative code into declarative React patterns.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export function handleGetDeclarativeProgrammingPattern(): DetailedPatternResponse {
  const pattern = getDetailedPattern('declarative-programming');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
