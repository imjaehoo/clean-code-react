import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

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

export function handleGetServiceLayerPattern(): DetailedPatternResponse {
  const pattern = getDetailedPattern('service-layer');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
