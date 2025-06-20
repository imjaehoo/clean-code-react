export interface PatternOverviewResponse {
  patterns: Array<{
    name: string;
    description: string;
    whenToUse: string;
    toolName: string;
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
      code: string;
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
      code: string;
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

export interface ErrorResponse {
  error: string;
}

export interface QualityChecklistItem {
  id: string;
  question: string;
  priority: 'high' | 'medium' | 'low';
  fixToolId: string;
}

export interface QualityChecklistCategory {
  name: string;
  description: string;
  items: QualityChecklistItem[];
}

export interface QualityChecklist {
  version: string;
  categories: QualityChecklistCategory[];
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx';
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  whenToUse: string;
  howToImplement: string;
  example: CodeExample;
  antiPattern?: CodeExample;
  relatedPatterns?: string[];
}

export interface ToolResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
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
  examples: {
    title: string;
    description: string;
    code: string;
  }[];
  bestPractices: string[];
  commonMistakes: string[];
  relatedPatterns: string[];
}

export interface PatternDefinition {
  overview: PatternOverview;
  detailed: DetailedPattern;
}
