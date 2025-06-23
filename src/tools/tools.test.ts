import { describe, expect, it } from 'vitest';

import { handleGetPattern } from './get-pattern.js';
import { handleGetPatterns } from './get-patterns.js';

describe('Tool Handlers', () => {
  describe('handleGetPatterns', () => {
    it('should return patterns overview with correct structure', () => {
      const result = handleGetPatterns();

      expect(result).toBeDefined();
      expect(result.patterns).toBeInstanceOf(Array);
      expect(result.usage).toBeDefined();
      expect(result.usage.nextStep).toBeDefined();
      expect(result.usage.example).toBeDefined();
    });

    it('should return all patterns with required fields', () => {
      const result = handleGetPatterns();

      expect(result.patterns.length).toBeGreaterThan(0);

      result.patterns.forEach((pattern) => {
        expect(pattern.name).toBeDefined();
        expect(pattern.description).toBeDefined();
        expect(pattern.whenToUse).toBeDefined();
        expect(pattern.patternId).toBeDefined();
        expect(typeof pattern.name).toBe('string');
        expect(typeof pattern.description).toBe('string');
        expect(typeof pattern.whenToUse).toBe('string');
        expect(typeof pattern.patternId).toBe('string');
      });
    });

    it('should include expected pattern IDs', () => {
      const result = handleGetPatterns();
      const patternIds = result.patterns.map((p) => p.patternId);

      const expectedPatterns = [
        'strategy-pattern',
        'container-presentational',
        'render-props',
        'compound-component',
        'higher-order-component',
        'dependency-injection',
        'service-layer',
        'adapter-pattern',
        'declarative-programming',
        'prop-drilling-solutions',
        'builder-pattern',
        'factory-pattern',
      ];

      expectedPatterns.forEach((expectedId) => {
        expect(patternIds).toContain(expectedId);
      });
    });
  });

  describe('handleGetPattern', () => {
    it('should return detailed pattern for valid ID', () => {
      const result = handleGetPattern('strategy-pattern');

      expect(result).toBeDefined();
      expect(result.pattern).toBeDefined();
      expect(result.pattern!.id).toBe('strategy-pattern');
      expect(result.pattern!.name).toBe('Strategy Pattern');
      expect(result.pattern!.description).toBeDefined();
      expect(result.pattern!.problem).toBeDefined();
      expect(result.pattern!.solution).toBeDefined();
      expect(result.pattern!.benefits).toBeInstanceOf(Array);
      expect(result.pattern!.drawbacks).toBeInstanceOf(Array);
      expect(result.pattern!.examples).toBeInstanceOf(Array);
      expect(result.pattern!.bestPractices).toBeInstanceOf(Array);
      expect(result.pattern!.commonMistakes).toBeInstanceOf(Array);
      expect(result.pattern!.relatedPatterns).toBeInstanceOf(Array);
    });

    it('should throw error for invalid pattern ID', () => {
      expect(() => {
        handleGetPattern('invalid-pattern-id');
      }).toThrow();
    });

    it('should return pattern with examples having correct structure', () => {
      const result = handleGetPattern('strategy-pattern');

      expect(result.pattern!.examples.length).toBeGreaterThan(0);

      result.pattern!.examples.forEach((example) => {
        expect(example.title).toBeDefined();
        expect(example.description).toBeDefined();
        expect(example.comparison).toBeDefined();
        expect(example.comparison.bad).toBeDefined();
        expect(example.comparison.good).toBeDefined();
        expect(example.comparison.bad.title).toBeDefined();
        expect(example.comparison.bad.description).toBeDefined();
        expect(example.comparison.bad.code).toBeDefined();
        expect(example.comparison.good.title).toBeDefined();
        expect(example.comparison.good.description).toBeDefined();
        expect(example.comparison.good.code).toBeDefined();
      });
    });

    it('should work for all known pattern IDs', () => {
      const allPatternsResult = handleGetPatterns();
      const patternIds = allPatternsResult.patterns.map((p) => p.patternId);

      patternIds.forEach((patternId) => {
        expect(() => {
          const result = handleGetPattern(patternId);
          expect(result.pattern).toBeDefined();
          expect(result.pattern!.id).toBe(patternId);
        }).not.toThrow();
      });
    });
  });
});
