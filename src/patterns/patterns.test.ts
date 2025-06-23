import { describe, expect, it } from 'vitest';

import {
  PATTERN_REGISTRY,
  getAllPatternOverviews,
  getDetailedPattern,
  getPatternIds,
} from './index.js';

describe('Pattern Data Validation', () => {
  const patternIds = getPatternIds();

  describe('Pattern Registry', () => {
    it('should have all expected patterns', () => {
      const expectedPatterns = [
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
        'strategy-pattern',
      ];

      expectedPatterns.forEach((patternId) => {
        expect(PATTERN_REGISTRY[patternId]).toBeDefined();
      });

      expect(patternIds).toHaveLength(expectedPatterns.length);
    });

    it('should have consistent pattern structure', () => {
      patternIds.forEach((patternId) => {
        const pattern = PATTERN_REGISTRY[patternId];
        expect(pattern).toBeDefined();
        expect(pattern.overview).toBeDefined();
        expect(pattern.detailed).toBeDefined();
      });
    });
  });

  describe('Pattern Overview Validation', () => {
    it('should have all required overview fields', () => {
      patternIds.forEach((patternId) => {
        const pattern = PATTERN_REGISTRY[patternId];
        const { overview } = pattern;

        expect(overview.name, `Pattern ${patternId} missing name`).toBeDefined();
        expect(overview.description, `Pattern ${patternId} missing description`).toBeDefined();
        expect(overview.whenToUse, `Pattern ${patternId} missing whenToUse`).toBeDefined();

        expect(typeof overview.name).toBe('string');
        expect(typeof overview.description).toBe('string');
        expect(typeof overview.whenToUse).toBe('string');

        expect(overview.name.length).toBeGreaterThan(0);
        expect(overview.description.length).toBeGreaterThan(0);
        expect(overview.whenToUse.length).toBeGreaterThan(0);
      });
    });

    it('should return overview with ID through getAllPatternOverviews', () => {
      const overviews = getAllPatternOverviews();

      expect(overviews.length).toBe(patternIds.length);

      overviews.forEach((overview) => {
        expect(overview.id).toBeDefined();
        expect(overview.name).toBeDefined();
        expect(overview.description).toBeDefined();
        expect(overview.whenToUse).toBeDefined();
        expect(patternIds).toContain(overview.id);
      });
    });
  });

  describe('Detailed Pattern Validation', () => {
    it('should have all required detailed fields', () => {
      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        expect(detailedPattern.id, `Pattern ${patternId} missing id`).toBe(patternId);
        expect(detailedPattern.name, `Pattern ${patternId} missing name`).toBeDefined();
        expect(
          detailedPattern.description,
          `Pattern ${patternId} missing description`,
        ).toBeDefined();
        expect(detailedPattern.problem, `Pattern ${patternId} missing problem`).toBeDefined();
        expect(detailedPattern.solution, `Pattern ${patternId} missing solution`).toBeDefined();
        expect(detailedPattern.benefits, `Pattern ${patternId} missing benefits`).toBeInstanceOf(
          Array,
        );
        expect(detailedPattern.drawbacks, `Pattern ${patternId} missing drawbacks`).toBeInstanceOf(
          Array,
        );
        expect(detailedPattern.examples, `Pattern ${patternId} missing examples`).toBeInstanceOf(
          Array,
        );
        expect(
          detailedPattern.bestPractices,
          `Pattern ${patternId} missing bestPractices`,
        ).toBeInstanceOf(Array);
        expect(
          detailedPattern.commonMistakes,
          `Pattern ${patternId} missing commonMistakes`,
        ).toBeInstanceOf(Array);
        expect(
          detailedPattern.relatedPatterns,
          `Pattern ${patternId} missing relatedPatterns`,
        ).toBeInstanceOf(Array);
      });
    });

    it('should have non-empty required arrays', () => {
      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        expect(
          detailedPattern.benefits.length,
          `Pattern ${patternId} has no benefits`,
        ).toBeGreaterThan(0);
        expect(
          detailedPattern.examples.length,
          `Pattern ${patternId} has no examples`,
        ).toBeGreaterThan(0);
        expect(
          detailedPattern.bestPractices.length,
          `Pattern ${patternId} has no best practices`,
        ).toBeGreaterThan(0);
        expect(
          detailedPattern.commonMistakes.length,
          `Pattern ${patternId} has no common mistakes`,
        ).toBeGreaterThan(0);

        // Drawbacks and relatedPatterns can be empty, but should be arrays
        expect(detailedPattern.drawbacks).toBeInstanceOf(Array);
        expect(detailedPattern.relatedPatterns).toBeInstanceOf(Array);
      });
    });

    it('should have valid example structure', () => {
      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        detailedPattern.examples.forEach((example, index) => {
          expect(
            example.title,
            `Pattern ${patternId} example ${index} missing title`,
          ).toBeDefined();
          expect(
            example.description,
            `Pattern ${patternId} example ${index} missing description`,
          ).toBeDefined();
          expect(
            example.comparison,
            `Pattern ${patternId} example ${index} missing comparison`,
          ).toBeDefined();

          const { comparison } = example;
          expect(
            comparison.bad,
            `Pattern ${patternId} example ${index} missing bad comparison`,
          ).toBeDefined();
          expect(
            comparison.good,
            `Pattern ${patternId} example ${index} missing good comparison`,
          ).toBeDefined();

          expect(comparison.bad.title).toBeDefined();
          expect(comparison.bad.description).toBeDefined();
          expect(comparison.bad.code).toBeDefined();
          expect(comparison.bad.code.length).toBeGreaterThan(0);

          expect(comparison.good.title).toBeDefined();
          expect(comparison.good.description).toBeDefined();
          expect(comparison.good.code).toBeDefined();
          expect(comparison.good.code.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Cross-Pattern Validation', () => {
    it('should have valid relatedPatterns references', () => {
      const allPatternIds = getPatternIds();
      let invalidReferencesFound = false;
      const invalidReferences: string[] = [];

      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        detailedPattern.relatedPatterns.forEach((relatedPatternId) => {
          if (!allPatternIds.includes(relatedPatternId)) {
            invalidReferencesFound = true;
            invalidReferences.push(`${patternId} -> ${relatedPatternId}`);
          }
        });
      });

      if (invalidReferencesFound) {
        throw new Error(`Invalid pattern references found: ${invalidReferences.join(', ')}`);
      }

      // Also test with a deliberately invalid reference to ensure test can fail
      expect(() => {
        const fakePattern = {
          relatedPatterns: ['non-existent-pattern'],
        };
        fakePattern.relatedPatterns.forEach((relatedPatternId) => {
          expect(
            allPatternIds.includes(relatedPatternId),
            `Test pattern references unknown pattern ${relatedPatternId}`,
          ).toBe(true);
        });
      }).toThrow();
    });

    it('should not have self-references in relatedPatterns', () => {
      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        expect(
          detailedPattern.relatedPatterns.includes(patternId),
          `Pattern ${patternId} references itself in relatedPatterns`,
        ).toBe(false);
      });
    });
  });

  describe('Pattern Quality Checks', () => {
    it('should have meaningful content lengths', () => {
      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        expect(
          detailedPattern.description.length,
          `Pattern ${patternId} description too short`,
        ).toBeGreaterThan(50);
        expect(
          detailedPattern.problem.length,
          `Pattern ${patternId} problem too short`,
        ).toBeGreaterThan(30);
        expect(
          detailedPattern.solution.length,
          `Pattern ${patternId} solution too short`,
        ).toBeGreaterThan(30);

        detailedPattern.benefits.forEach((benefit) => {
          expect(benefit.length, `Pattern ${patternId} has very short benefit`).toBeGreaterThan(10);
        });

        detailedPattern.bestPractices.forEach((practice) => {
          expect(
            practice.length,
            `Pattern ${patternId} has very short best practice`,
          ).toBeGreaterThan(15);
        });
      });
    });

    it('should have code examples with sufficient content', () => {
      patternIds.forEach((patternId) => {
        const detailedPattern = getDetailedPattern(patternId);

        detailedPattern.examples.forEach((example, index) => {
          expect(
            example.comparison.bad.code.length,
            `Pattern ${patternId} example ${index} bad code too short`,
          ).toBeGreaterThan(100);

          expect(
            example.comparison.good.code.length,
            `Pattern ${patternId} example ${index} good code too short`,
          ).toBeGreaterThan(100);
        });
      });
    });
  });
});
