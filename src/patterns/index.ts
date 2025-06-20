import assert from 'node:assert';

import type { DetailedPattern, PatternDefinition, PatternOverview } from '../types/index.js';

import { adapterPattern } from './adapter-pattern.js';
import { builderPattern } from './builder-pattern.js';
import { compoundComponentPattern } from './compound-component.js';
import { containerPresentationalPattern } from './container-presentational.js';
import { declarativeProgrammingPattern } from './declarative-programming.js';
import { dependencyInjectionPattern } from './dependency-injection.js';
import { factoryPattern } from './factory-pattern.js';
import { higherOrderComponentPattern } from './higher-order-component.js';
import { propDrillingSolutionsPattern } from './prop-drilling-solutions.js';
import { renderPropsPattern } from './render-props.js';
import { serviceLayerPattern } from './service-layer.js';

/**
 * Central pattern registry - single source of truth
 */
export const PATTERN_REGISTRY: Record<string, PatternDefinition> = {
  'container-presentational': containerPresentationalPattern,
  'render-props': renderPropsPattern,
  'compound-component': compoundComponentPattern,
  'higher-order-component': higherOrderComponentPattern,
  'dependency-injection': dependencyInjectionPattern,
  'service-layer': serviceLayerPattern,
  'adapter-pattern': adapterPattern,
  'declarative-programming': declarativeProgrammingPattern,
  'prop-drilling-solutions': propDrillingSolutionsPattern,
  'builder-pattern': builderPattern,
  'factory-pattern': factoryPattern,
};

/**
 * Get all pattern overviews with dynamic ID and toolID
 */
export function getAllPatternOverviews(): Array<
  PatternOverview & { id: string; toolName: string }
> {
  return Object.entries(PATTERN_REGISTRY).map(([key, pattern]) => ({
    ...pattern.overview,
    id: key,
    toolName: `get_${key.replace(/-/g, '_')}_pattern`,
  }));
}

/**
 * Get pattern overview by ID
 */
export function getPatternOverview(id: string): PatternOverview {
  const pattern = PATTERN_REGISTRY[id];
  assert(pattern, `Pattern '${id}' not found in registry`);
  return pattern.overview;
}

/**
 * Get detailed pattern by ID with dynamic ID
 */
export function getDetailedPattern(id: string): DetailedPattern & { id: string } {
  const patternDef = PATTERN_REGISTRY[id];
  assert(patternDef, `Pattern '${id}' not found in registry`);

  return {
    ...patternDef.detailed,
    id,
  };
}

/**
 * Get all available pattern IDs
 */
export function getPatternIds(): string[] {
  return Object.keys(PATTERN_REGISTRY);
}
