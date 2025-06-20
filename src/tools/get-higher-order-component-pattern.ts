import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse, ErrorResponse } from '../types/index.js';

export const getHigherOrderComponentPatternTool: Tool = {
  name: 'get_higher_order_component_pattern',
  description:
    'Get detailed information about the Higher-Order Component (HOC) pattern with comprehensive examples and implementation guidance.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleGetHigherOrderComponentPattern(): Promise<
  DetailedPatternResponse | ErrorResponse
> {
  const pattern = getDetailedPattern('higher-order-component');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
