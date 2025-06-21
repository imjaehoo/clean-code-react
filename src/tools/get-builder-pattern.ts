import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

export const getBuilderPatternTool: Tool = {
  name: 'get_builder_pattern',
  description:
    'Get detailed information about the Builder pattern for constructing complex objects step by step with a fluent interface.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export function handleGetBuilderPattern(): DetailedPatternResponse {
  const pattern = getDetailedPattern('builder-pattern');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
