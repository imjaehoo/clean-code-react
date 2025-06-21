import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
  getAdapterPatternTool,
  getBuilderPatternTool,
  getCodeQualityFundamentalsTool,
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
  handleGetCodeQualityFundamentals,
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
          get_code_quality_fundamentals: getCodeQualityFundamentalsTool,
        },
      },
    },
  );

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
        getCodeQualityFundamentalsTool,
      ],
    };
  });

  const toolHandlers = new Map<string, () => unknown>([
    ['get_patterns', handleGetPatterns],
    ['get_container_presentational_pattern', handleGetContainerPresentationalPattern],
    ['get_render_props_pattern', handleGetRenderPropsPattern],
    ['get_compound_component_pattern', handleGetCompoundComponentPattern],
    ['get_higher_order_component_pattern', handleGetHigherOrderComponentPattern],
    ['get_dependency_injection_pattern', handleGetDependencyInjectionPattern],
    ['get_service_layer_pattern', handleGetServiceLayerPattern],
    ['get_adapter_pattern', handleGetAdapterPattern],
    ['get_declarative_programming_pattern', handleGetDeclarativeProgrammingPattern],
    ['get_prop_drilling_solutions_pattern', handleGetPropDrillingSolutionsPattern],
    ['get_builder_pattern', handleGetBuilderPattern],
    ['get_factory_pattern', handleGetFactoryPattern],
    ['get_code_quality_fundamentals', handleGetCodeQualityFundamentals],
  ]);

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name } = request.params;

    const handler = toolHandlers.get(name);
    if (!handler) {
      throw new Error(`Tool '${name}' not found`);
    }

    try {
      const result = handler();
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
