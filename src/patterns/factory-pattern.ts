import type { PatternDefinition } from '../types/index.js';

export const factoryPattern: PatternDefinition = {
  overview: {
    name: 'Factory Pattern',
    description:
      'Create objects or React components through factory functions/classes without specifying exact classes or types. This pattern provides a way to encapsulate object creation logic, handle complex instantiation scenarios, and create different variants of components or services based on runtime conditions.',
    whenToUse:
      'Use when you need to create different types of components based on runtime data, when object creation logic is complex or needs to be centralized, when you want to abstract the creation process from the consuming code, when building plugin systems or extensible architectures, when you need to create objects that require specific initialization or configuration, or when you want to provide a consistent interface for creating related objects.',
  },
  detailed: {
    name: 'Factory Pattern',
    description:
      'Implement factory functions or classes to encapsulate complex object creation logic and provide a clean interface for creating different types of objects or components.',
    problem:
      'Direct object instantiation spreads creation logic throughout the codebase, makes it hard to manage complex creation scenarios, and tightly couples code to specific implementations.',
    solution:
      'Use factory functions or classes to centralize creation logic, provide a consistent interface for object creation, and allow runtime determination of which objects to create.',
    benefits: [
      'Encapsulates complex creation logic',
      'Reduces coupling between code and concrete classes',
      'Provides consistent creation interface',
      'Enables runtime object type determination',
      'Easier to test with mock factories',
      'Supports plugin and extension patterns',
    ],
    drawbacks: [
      'Additional abstraction layer',
      'Can add complexity for simple cases',
      'May hide the actual types being created',
      'Requires understanding of factory pattern',
    ],
    examples: [
      {
        title: 'Bad: Direct Instantiation Everywhere',
        description: 'Creation logic scattered throughout components with tight coupling',
        code: `// ❌ BAD: Direct instantiation and scattered creation logic

// Different notification types created directly in components
function NotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type: string, message: string, data?: any) => {
    let notification;
    
    // Complex creation logic scattered in component
    if (type === 'success') {
      notification = {
        id: Date.now(),
        type: 'success',
        message,
        icon: '✅',
        duration: 3000,
        className: 'notification-success',
        actions: [{ label: 'Dismiss', onClick: () => removeNotification(notification.id) }],
      };
    } else if (type === 'error') {
      notification = {
        id: Date.now(),
        type: 'error',
        message,
        icon: '❌',
        duration: 5000,
        className: 'notification-error',
        actions: [
          { label: 'Dismiss', onClick: () => removeNotification(notification.id) },
          { label: 'Retry', onClick: data?.retryAction },
        ],
      };
    } else if (type === 'warning') {
      notification = {
        id: Date.now(),
        type: 'warning',
        message,
        icon: '⚠️',
        duration: 4000,
        className: 'notification-warning',
        actions: [{ label: 'Dismiss', onClick: () => removeNotification(notification.id) }],
      };
    } else if (type === 'info') {
      notification = {
        id: Date.now(),
        type: 'info',
        message,
        icon: 'ℹ️',
        duration: 3000,
        className: 'notification-info',
        actions: [{ label: 'Dismiss', onClick: () => removeNotification(notification.id) }],
      };
    }

    setNotifications(prev => [...prev, notification]);
  };

  // Similar creation logic duplicated in other components...
}

// API clients created directly with repetitive logic
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Direct instantiation with complex setup
    const apiClient = {
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 5000,
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      interceptors: {
        request: (config) => {
          console.log('Request:', config);
          return config;
        },
        response: (response) => {
          console.log('Response:', response);
          return response;
        },
      },
    };

    // This creation logic is repeated everywhere API calls are made
    fetch(\`\${apiClient.baseURL}/users/\${userId}\`, {
      method: 'GET',
      headers: apiClient.headers,
      signal: AbortSignal.timeout(apiClient.timeout),
    })
    .then(response => response.json())
    .then(setUser);
  }, [userId]);
}

// Form fields created with repetitive logic
function CreateUserForm() {
  const [formData, setFormData] = useState({});

  // Repetitive field creation logic
  const usernameField = {
    name: 'username',
    type: 'text',
    label: 'Username',
    validation: { required: true, minLength: 3 },
    placeholder: 'Enter username',
    className: 'form-field',
  };

  const emailField = {
    name: 'email',
    type: 'email',
    label: 'Email',
    validation: { required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ },
    placeholder: 'Enter email',
    className: 'form-field',
  };

  // This gets repeated for every form...
}`,
      },
      {
        title: 'Good: Factory Pattern Implementation',
        description: 'Centralized creation logic with factory functions and classes',
        code: `// ✅ GOOD: Factory pattern for clean object creation

// Notification Factory
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  icon: string;
  duration: number;
  className: string;
  actions: Array<{ label: string; onClick: () => void }>;
}

class NotificationFactory {
  private static generateId(): string {
    return \`notification-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }

  static createSuccess(
    message: string, 
    options: { duration?: number; onDismiss?: () => void } = {}
  ): Notification {
    const id = this.generateId();
    return {
      id,
      type: 'success',
      message,
      icon: '✅',
      duration: options.duration || 3000,
      className: 'notification-success',
      actions: [{ label: 'Dismiss', onClick: options.onDismiss || (() => {}) }],
    };
  }

  static createError(
    message: string,
    options: { 
      duration?: number; 
      onDismiss?: () => void; 
      onRetry?: () => void;
    } = {}
  ): Notification {
    const id = this.generateId();
    const actions = [{ label: 'Dismiss', onClick: options.onDismiss || (() => {}) }];
    
    if (options.onRetry) {
      actions.push({ label: 'Retry', onClick: options.onRetry });
    }

    return {
      id,
      type: 'error',
      message,
      icon: '❌',
      duration: options.duration || 5000,
      className: 'notification-error',
      actions,
    };
  }

  static createWarning(
    message: string,
    options: { duration?: number; onDismiss?: () => void } = {}
  ): Notification {
    const id = this.generateId();
    return {
      id,
      type: 'warning',
      message,
      icon: '⚠️',
      duration: options.duration || 4000,
      className: 'notification-warning',
      actions: [{ label: 'Dismiss', onClick: options.onDismiss || (() => {}) }],
    };
  }

  static createInfo(
    message: string,
    options: { duration?: number; onDismiss?: () => void } = {}
  ): Notification {
    const id = this.generateId();
    return {
      id,
      type: 'info',
      message,
      icon: 'ℹ️',
      duration: options.duration || 3000,
      className: 'notification-info',
      actions: [{ label: 'Dismiss', onClick: options.onDismiss || (() => {}) }],
    };
  }
}

// API Client Factory
interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  authToken?: string;
}

class ApiClientFactory {
  static createAuthenticated(config: ApiClientConfig = {}) {
    return {
      baseURL: config.baseURL || process.env.REACT_APP_API_URL,
      timeout: config.timeout || 5000,
      retries: config.retries || 1,
      headers: {
        'Authorization': \`Bearer \${config.authToken || localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      interceptors: {
        request: this.createRequestInterceptor(),
        response: this.createResponseInterceptor(),
      },
    };
  }

  static createPublic(config: ApiClientConfig = {}) {
    return {
      baseURL: config.baseURL || process.env.REACT_APP_API_URL,
      timeout: config.timeout || 5000,
      retries: config.retries || 1,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  static createMock() {
    return {
      baseURL: 'http://localhost:3001',
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' },
      isMock: true,
    };
  }

  private static createRequestInterceptor() {
    return (config: any) => {
      console.log('API Request:', config);
      return config;
    };
  }

  private static createResponseInterceptor() {
    return (response: any) => {
      console.log('API Response:', response);
      return response;
    };
  }
}

// Form Field Factory
interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  validation?: any;
  placeholder?: string;
  className?: string;
}

const FormFieldFactory = {
  createText(name: string, label: string, options: Partial<FormFieldConfig> = {}): FormFieldConfig {
    return {
      name,
      label,
      type: 'text',
      validation: { required: false },
      placeholder: \`Enter \${label.toLowerCase()}\`,
      className: 'form-field',
      ...options,
    };
  },

  createEmail(name: string, label: string = 'Email', options: Partial<FormFieldConfig> = {}): FormFieldConfig {
    return {
      name,
      label,
      type: 'email',
      validation: { 
        required: true, 
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ 
      },
      placeholder: 'Enter email address',
      className: 'form-field',
      ...options,
    };
  },

  createPassword(name: string, label: string = 'Password', options: Partial<FormFieldConfig> = {}): FormFieldConfig {
    return {
      name,
      label,
      type: 'password',
      validation: { required: true, minLength: 8 },
      placeholder: 'Enter password',
      className: 'form-field',
      ...options,
    };
  },

  createRequired(name: string, label: string, type: string = 'text'): FormFieldConfig {
    return this.createText(name, label, { 
      type, 
      validation: { required: true } 
    });
  },
};

// Clean usage in components
function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    const notification = NotificationFactory.createSuccess(message, {
      onDismiss: () => removeNotification(notification.id),
    });
    addNotification(notification);
  }, [addNotification, removeNotification]);

  const showError = useCallback((message: string, onRetry?: () => void) => {
    const notification = NotificationFactory.createError(message, {
      onDismiss: () => removeNotification(notification.id),
      onRetry,
    });
    addNotification(notification);
  }, [addNotification, removeNotification]);

  return { notifications, showSuccess, showError };
}

// Clean API usage
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const apiClient = useMemo(() => ApiClientFactory.createAuthenticated(), []);

  useEffect(() => {
    fetch(\`\${apiClient.baseURL}/users/\${userId}\`, {
      headers: apiClient.headers,
      signal: AbortSignal.timeout(apiClient.timeout),
    })
    .then(response => response.json())
    .then(setUser);
  }, [userId, apiClient]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}

// Clean form field creation
function CreateUserForm() {
  const fields = useMemo(() => [
    FormFieldFactory.createRequired('username', 'Username'),
    FormFieldFactory.createEmail('email'),
    FormFieldFactory.createPassword('password'),
    FormFieldFactory.createText('firstName', 'First Name', { required: true }),
    FormFieldFactory.createText('lastName', 'Last Name', { required: true }),
  ], []);

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
      'Use static factory methods for simple cases',
      'Encapsulate complex creation logic in factory classes',
      'Provide clear factory method names that describe what they create',
      'Use TypeScript interfaces to define what factories create',
      'Consider using Abstract Factory pattern for families of related objects',
      'Make factories testable by allowing dependency injection',
      'Keep factory methods focused on creation, not business logic',
    ],
    commonMistakes: [
      'Making factories too complex with business logic',
      'Not providing clear method names for different creation scenarios',
      'Creating factories for overly simple objects',
      'Not using TypeScript to type the created objects',
      'Making factories stateful when they should be stateless',
      'Not considering the Abstract Factory pattern for related object families',
    ],
    relatedPatterns: ['builder-pattern', 'dependency-injection', 'adapter-pattern'],
  },
};
