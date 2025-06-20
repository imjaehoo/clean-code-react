import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { createValidatedHandler } from './adapters/mcp.js';
import {
  getAdapterPatternTool,
  getBuilderPatternTool,
  getCompoundComponentPatternTool,
  getContainerPresentationalPatternTool,
  getDeclarativeProgrammingPatternTool,
  getDependencyInjectionPatternTool,
  getFactoryPatternTool,
  getHigherOrderComponentPatternTool,
  getPatternsTool,
  getPropDrillingSolutionsPatternTool,
  getRenderPropsPatternTool,
  getServiceLayerPatternTool,
  handleGetAdapterPattern,
  handleGetBuilderPattern,
  handleGetCompoundComponentPattern,
  handleGetContainerPresentationalPattern,
  handleGetDeclarativeProgrammingPattern,
  handleGetDependencyInjectionPattern,
  handleGetFactoryPattern,
  handleGetHigherOrderComponentPattern,
  handleGetPatterns,
  handleGetPropDrillingSolutionsPattern,
  handleGetRenderPropsPattern,
  handleGetServiceLayerPattern,
} from './tools/index.js';

export function createServer() {
  const server = new Server(
    {
      name: 'clean-code-react',
      version: '0.1.2',
    },
    {
      capabilities: {
        tools: {
          get_patterns: getPatternsTool,
          get_container_presentational_pattern: getContainerPresentationalPatternTool,
          get_render_props_pattern: getRenderPropsPatternTool,
          get_compound_component_pattern: getCompoundComponentPatternTool,
          get_higher_order_component_pattern: getHigherOrderComponentPatternTool,
          get_dependency_injection_pattern: getDependencyInjectionPatternTool,
          get_service_layer_pattern: getServiceLayerPatternTool,
          get_adapter_pattern: getAdapterPatternTool,
          get_declarative_programming_pattern: getDeclarativeProgrammingPatternTool,
          get_prop_drilling_solutions_pattern: getPropDrillingSolutionsPatternTool,
          get_builder_pattern: getBuilderPatternTool,
          get_factory_pattern: getFactoryPatternTool,
        },
      },
    },
  );

  const toolHandlers = new Map<string, (args: unknown) => Promise<unknown>>([
    ['get_patterns', createValidatedHandler(handleGetPatterns)],
    [
      'get_container_presentational_pattern',
      createValidatedHandler(handleGetContainerPresentationalPattern),
    ],
    ['get_render_props_pattern', createValidatedHandler(handleGetRenderPropsPattern)],
    ['get_compound_component_pattern', createValidatedHandler(handleGetCompoundComponentPattern)],
    [
      'get_higher_order_component_pattern',
      createValidatedHandler(handleGetHigherOrderComponentPattern),
    ],
    [
      'get_dependency_injection_pattern',
      createValidatedHandler(handleGetDependencyInjectionPattern),
    ],
    ['get_service_layer_pattern', createValidatedHandler(handleGetServiceLayerPattern)],
    ['get_adapter_pattern', createValidatedHandler(handleGetAdapterPattern)],
    [
      'get_declarative_programming_pattern',
      createValidatedHandler(handleGetDeclarativeProgrammingPattern),
    ],
    [
      'get_prop_drilling_solutions_pattern',
      createValidatedHandler(handleGetPropDrillingSolutionsPattern),
    ],
    ['get_builder_pattern', createValidatedHandler(handleGetBuilderPattern)],
    ['get_factory_pattern', createValidatedHandler(handleGetFactoryPattern)],
  ]);

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        getPatternsTool,
        getContainerPresentationalPatternTool,
        getRenderPropsPatternTool,
        getCompoundComponentPatternTool,
        getHigherOrderComponentPatternTool,
        getDependencyInjectionPatternTool,
        getServiceLayerPatternTool,
        getAdapterPatternTool,
        getDeclarativeProgrammingPatternTool,
        getPropDrillingSolutionsPatternTool,
        getBuilderPatternTool,
        getFactoryPatternTool,
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const handler = toolHandlers.get(name);
    if (!handler) {
      throw new Error(`Tool '${name}' not found`);
    }

    try {
      const result = await handler(args ?? {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: errorMessage }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
