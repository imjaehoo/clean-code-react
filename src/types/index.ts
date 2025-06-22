export interface PatternOverviewResponse {
  patterns: Array<{
    name: string;
    description: string;
    whenToUse: string;
    patternId: string;
  }>;
  usage: {
    nextStep: string;
    example: string;
  };
}

export interface DetailedPatternResponse {
  pattern?: {
    id: string;
    name: string;
    description: string;
    problem: string;
    solution: string;
    benefits: string[];
    drawbacks: string[];
    examples: Array<{
      title: string;
      description: string;
      comparison: {
        bad: {
          title: string;
          description: string;
          code: string;
        };
        good: {
          title: string;
          description: string;
          code: string;
        };
      };
    }>;
    bestPractices: string[];
    commonMistakes: string[];
    relatedPatterns: string[];
  };
  patterns?: Array<{
    id: string;
    name: string;
    description: string;
    problem: string;
    solution: string;
    benefits: string[];
    drawbacks: string[];
    examples: Array<{
      title: string;
      description: string;
      comparison: {
        bad: {
          title: string;
          description: string;
          code: string;
        };
        good: {
          title: string;
          description: string;
          code: string;
        };
      };
    }>;
    bestPractices: string[];
    commonMistakes: string[];
    relatedPatterns: string[];
  }>;
  summary?: {
    totalPatterns: number;
    categories: string[];
    description: string;
    guidance?: string;
  };
}

export interface PatternOverview {
  name: string;
  description: string;
  whenToUse: string;
}

export interface DetailedPattern {
  name: string;
  description: string;
  problem: string;
  solution: string;
  benefits: string[];
  drawbacks: string[];
  examples: Array<{
    title: string;
    description: string;
    comparison: {
      bad: {
        title: string;
        description: string;
        code: string;
      };
      good: {
        title: string;
        description: string;
        code: string;
      };
    };
  }>;
  bestPractices: string[];
  commonMistakes: string[];
  relatedPatterns: string[];
}

export interface PatternDefinition {
  overview: PatternOverview;
  detailed: DetailedPattern;
}
