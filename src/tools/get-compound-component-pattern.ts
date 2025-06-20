import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse, ErrorResponse } from '../types/index.js';

export const getCompoundComponentPatternTool: Tool = {
  name: 'get_compound_component_pattern',
  description:
    'Get detailed information about the Compound Component pattern with comprehensive examples and implementation guidance.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleGetCompoundComponentPattern(): Promise<
  DetailedPatternResponse | ErrorResponse
> {
  const pattern = getDetailedPattern('compound-component');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
