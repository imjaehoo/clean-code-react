import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse, ErrorResponse } from '../types/index.js';

export const getFactoryPatternTool: Tool = {
  name: 'get_factory_pattern',
  description:
    'Get detailed information about the Factory pattern for creating objects through factory functions without specifying exact classes.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleGetFactoryPattern(): Promise<DetailedPatternResponse | ErrorResponse> {
  const pattern = getDetailedPattern('factory-pattern');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
