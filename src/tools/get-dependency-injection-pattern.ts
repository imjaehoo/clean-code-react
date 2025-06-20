import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse, ErrorResponse } from '../types/index.js';

export const getDependencyInjectionPatternTool: Tool = {
  name: 'get_dependency_injection_pattern',
  description:
    'Get detailed information about the Dependency Injection pattern with comprehensive examples and implementation guidance.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleGetDependencyInjectionPattern(): Promise<
  DetailedPatternResponse | ErrorResponse
> {
  const pattern = getDetailedPattern('dependency-injection');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
