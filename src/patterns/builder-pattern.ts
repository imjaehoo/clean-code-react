import type { PatternDefinition } from '../types/index.js';

export const builderPattern: PatternDefinition = {
  overview: {
    name: 'Builder Pattern',
    description:
      'Create complex objects or configurations step by step using a fluent interface. In React/TypeScript contexts, this pattern is useful for building component configurations, form schemas, API query builders, and complex state objects with optional properties and validation.',
    whenToUse:
      'Use when you need to construct complex objects with many optional parameters, when you want to provide a fluent API for configuring components or services, when building form schemas or validation rules, when creating API query builders or request configurations, when you need to ensure object construction follows specific rules or validation, or when you want to make complex object creation more readable and maintainable.',
  },
  detailed: {
    name: 'Builder Pattern',
    description:
      'Implement the Builder pattern to construct complex objects with a fluent, readable interface that guides users through the construction process.',
    problem:
      'Complex objects with many optional parameters lead to constructor functions with long parameter lists, unclear object construction, and difficulty ensuring all required properties are set correctly.',
    solution:
      'Use a builder class with a fluent interface that allows step-by-step construction of complex objects, providing clear validation and ensuring required properties are set.',
    benefits: [
      'Readable and intuitive object construction',
      'Prevents invalid object states',
      'Flexible construction with optional parameters',
      'Type-safe configuration building',
      'Chainable method calls for fluent APIs',
      'Clear separation of construction logic',
    ],
    drawbacks: [
      'Additional complexity for simple objects',
      'More code to maintain',
      'Can be overkill for straightforward cases',
      'Requires understanding of the builder pattern',
    ],
    examples: [
      {
        title: 'Bad: Complex Constructor Parameters',
        description: 'Hard-to-use constructors with many optional parameters',
        code: `// ❌ BAD: Complex constructors and configuration objects
interface FormFieldConfig {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  formatting?: {
    uppercase?: boolean;
    lowercase?: boolean;
    trim?: boolean;
  };
  styling?: {
    className?: string;
    width?: string;
    variant?: 'outlined' | 'filled';
  };
}

// Hard to use and error-prone
function createFormField(config: FormFieldConfig) {
  // Complex validation logic mixed with construction
  if (!config.name) {
    throw new Error('Name is required');
  }
  
  if (config.type === 'email' && !config.validation?.pattern) {
    config.validation = { 
      ...config.validation, 
      pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ 
    };
  }
  
  return config;
}

// Ugly usage - easy to make mistakes
const emailField = createFormField({
  name: 'email',
  label: 'Email Address',
  type: 'email',
  placeholder: 'Enter your email',
  required: true,
  validation: {
    minLength: 5,
    maxLength: 100,
    // Forgot to add email pattern - constructor adds it
  },
  styling: {
    className: 'form-field',
    width: '100%',
    variant: 'outlined',
  },
});

// API Query - complex parameter object
interface QueryConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  transform?: (data: any) => any;
}

// Hard to construct properly
const userQuery = {
  endpoint: '/api/users',
  method: 'GET' as const,
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json',
  },
  params: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
  },
  timeout: 5000,
  retries: 3,
  cache: true,
  transform: (data) => data.users,
};`,
      },
      {
        title: 'Good: Builder Pattern Implementation',
        description: 'Fluent builders for readable and type-safe object construction',
        code: `// ✅ GOOD: Builder pattern for complex configurations

// Form Field Builder
class FormFieldBuilder {
  private config: Partial<FormFieldConfig> = {};

  constructor(name: string) {
    this.config.name = name;
  }

  label(label: string): FormFieldBuilder {
    this.config.label = label;
    return this;
  }

  type(type: 'text' | 'email' | 'password' | 'number'): FormFieldBuilder {
    this.config.type = type;
    // Auto-add email validation for email type
    if (type === 'email') {
      this.config.validation = {
        ...this.config.validation,
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
      };
    }
    return this;
  }

  placeholder(placeholder: string): FormFieldBuilder {
    this.config.placeholder = placeholder;
    return this;
  }

  required(required: boolean = true): FormFieldBuilder {
    this.config.required = required;
    return this;
  }

  disabled(disabled: boolean = true): FormFieldBuilder {
    this.config.disabled = disabled;
    return this;
  }

  validation(validation: FormFieldConfig['validation']): FormFieldBuilder {
    this.config.validation = { ...this.config.validation, ...validation };
    return this;
  }

  minLength(minLength: number): FormFieldBuilder {
    this.config.validation = { ...this.config.validation, minLength };
    return this;
  }

  maxLength(maxLength: number): FormFieldBuilder {
    this.config.validation = { ...this.config.validation, maxLength };
    return this;
  }

  pattern(pattern: RegExp): FormFieldBuilder {
    this.config.validation = { ...this.config.validation, pattern };
    return this;
  }

  styling(styling: FormFieldConfig['styling']): FormFieldBuilder {
    this.config.styling = { ...this.config.styling, ...styling };
    return this;
  }

  className(className: string): FormFieldBuilder {
    this.config.styling = { ...this.config.styling, className };
    return this;
  }

  width(width: string): FormFieldBuilder {
    this.config.styling = { ...this.config.styling, width };
    return this;
  }

  build(): FormFieldConfig {
    if (!this.config.name) {
      throw new Error('Field name is required');
    }
    return this.config as FormFieldConfig;
  }
}

// API Query Builder
class QueryBuilder {
  private config: Partial<QueryConfig> = {};

  constructor(endpoint: string) {
    this.config.endpoint = endpoint;
  }

  method(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): QueryBuilder {
    this.config.method = method;
    return this;
  }

  headers(headers: Record<string, string>): QueryBuilder {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  header(key: string, value: string): QueryBuilder {
    this.config.headers = { ...this.config.headers, [key]: value };
    return this;
  }

  auth(token: string): QueryBuilder {
    return this.header('Authorization', \`Bearer \${token}\`);
  }

  params(params: Record<string, any>): QueryBuilder {
    this.config.params = { ...this.config.params, ...params };
    return this;
  }

  param(key: string, value: any): QueryBuilder {
    this.config.params = { ...this.config.params, [key]: value };
    return this;
  }

  pagination(page: number, limit: number): QueryBuilder {
    return this.params({ page, limit });
  }

  sort(field: string, order: 'asc' | 'desc' = 'asc'): QueryBuilder {
    return this.params({ sort: field, order });
  }

  body(body: any): QueryBuilder {
    this.config.body = body;
    return this;
  }

  timeout(timeout: number): QueryBuilder {
    this.config.timeout = timeout;
    return this;
  }

  retries(retries: number): QueryBuilder {
    this.config.retries = retries;
    return this;
  }

  cache(cache: boolean = true): QueryBuilder {
    this.config.cache = cache;
    return this;
  }

  transform<T, R>(transformer: (data: T) => R): QueryBuilder {
    this.config.transform = transformer;
    return this;
  }

  build(): QueryConfig {
    if (!this.config.endpoint) {
      throw new Error('Endpoint is required');
    }
    return {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
      retries: 1,
      cache: false,
      ...this.config,
    } as QueryConfig;
  }
}

// Clean, readable usage
const emailField = new FormFieldBuilder('email')
  .label('Email Address')
  .type('email')
  .placeholder('Enter your email')
  .required()
  .minLength(5)
  .maxLength(100)
  .className('form-field')
  .width('100%')
  .build();

const userQuery = new QueryBuilder('/api/users')
  .method('GET')
  .auth('your-token-here')
  .pagination(1, 10)
  .sort('createdAt', 'desc')
  .timeout(5000)
  .retries(3)
  .cache()
  .transform((data: any) => data.users)
  .build();

// React Hook for form builder
function useFormBuilder() {
  const createField = useCallback((name: string) => {
    return new FormFieldBuilder(name);
  }, []);

  return { createField };
}

// Usage in React component
function FormExample() {
  const { createField } = useFormBuilder();

  const fields = useMemo(() => [
    createField('username')
      .label('Username')
      .required()
      .minLength(3)
      .maxLength(20)
      .build(),
      
    createField('email')
      .label('Email')
      .type('email')
      .required()
      .build(),
      
    createField('password')
      .label('Password')
      .type('password')
      .required()
      .minLength(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
      .build(),
  ], [createField]);

  return (
    <form>
      {fields.map(field => (
        <FormField key={field.name} config={field} />
      ))}
    </form>
  );
}`,
      },
    ],
    bestPractices: [
      'Use TypeScript for type safety in builder methods',
      'Provide sensible defaults in the build() method',
      'Validate required properties in build() method',
      'Use method chaining for fluent interface',
      'Keep builder methods focused on single responsibility',
      'Consider using static factory methods for common configurations',
      'Make builders immutable by returning new instances if needed',
    ],
    commonMistakes: [
      'Not validating required properties in build() method',
      'Making builders too complex with too many methods',
      'Forgetting to return "this" for method chaining',
      'Not providing clear error messages for invalid configurations',
      "Using builders for simple objects that don't need them",
      'Not considering performance implications of method chaining',
    ],
    relatedPatterns: ['adapter-pattern', 'dependency-injection'],
  },
};
