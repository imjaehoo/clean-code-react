import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

export const getContainerPresentationalPatternTool: Tool = {
  name: 'get_container_presentational_pattern',
  description:
    'Get detailed information about the Container/Presentational pattern with comprehensive examples and implementation guidance.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export function handleGetContainerPresentationalPattern(): DetailedPatternResponse {
  const pattern = getDetailedPattern('container-presentational');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
