import assert from 'node:assert';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

import { getDetailedPattern } from '../patterns/index.js';
import type { DetailedPatternResponse } from '../types/index.js';

export const getRenderPropsPatternTool: Tool = {
  name: 'get_render_props_pattern',
  description:
    'Get detailed information about the Render Props pattern with comprehensive examples and implementation guidance.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export function handleGetRenderPropsPattern(): DetailedPatternResponse {
  const pattern = getDetailedPattern('render-props');
  assert(pattern, 'Pattern not found');
  return { pattern };
}
