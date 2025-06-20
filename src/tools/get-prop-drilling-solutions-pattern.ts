import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse, ErrorResponse } from '../types/index.js';

export const getPropDrillingSolutionsPatternTool: Tool = {
  name: 'get_prop_drilling_solutions_pattern',
  description:
    'Get detailed information about the Prop Drilling Solutions pattern for avoiding props being passed through multiple component layers.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleGetPropDrillingSolutionsPattern(): Promise<
  DetailedPatternResponse | ErrorResponse
> {
  const pattern = getDetailedPattern('prop-drilling-solutions');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
