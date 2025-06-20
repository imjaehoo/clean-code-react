import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse, ErrorResponse } from '../types/index.js';

export const getServiceLayerPatternTool: Tool = {
  name: 'get_service_layer_pattern',
  description:
    'Get detailed information about the Service Layer pattern for abstracting API calls and business logic.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleGetServiceLayerPattern(): Promise<
  DetailedPatternResponse | ErrorResponse
> {
  const pattern = getDetailedPattern('service-layer');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
