import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

export const getAdapterPatternTool: Tool = {
  name: 'get_adapter_pattern',
  description:
    'Get detailed information about the Adapter pattern for integrating with external APIs and legacy systems.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export function handleGetAdapterPattern(): DetailedPatternResponse {
  const pattern = getDetailedPattern('adapter-pattern');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
