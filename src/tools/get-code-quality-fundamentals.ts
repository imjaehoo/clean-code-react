import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Code Quality Fundamentals Tool
 *
 * This tool provides comprehensive code quality guidance based on the "Four Principles of Writing Good Code"
 * from Frontend Fundamentals (https://frontend-fundamentals.com/code-quality/en/code/).
 *
 * The content has been adapted for React/TypeScript development with practical examples and best practices.
 *
 * Original principles and concepts from Frontend Fundamentals project:
 * Copyright (c) 2024 Viva Republica, Inc (Toss)
 * Licensed under MIT License
 * https://github.com/toss/frontend-fundamentals/blob/main/LICENSE.md
 */

interface CodeExample {
  title: string;
  bad: string;
  good: string;
  explanation: string;
}

interface Concept {
  name: string;
  description: string;
  examples: CodeExample[];
  bestPractices: string[];
}

interface Principle {
  name: string;
  description: string;
  concepts: Concept[];
  whenToPrioritize: string;
}

interface CodeQualityFundamentals {
  overview: string;
  corePhilosophy: string;
  principles: {
    readability: Principle;
    predictability: Principle;
    cohesion: Principle;
    coupling: Principle;
  };
  balancingPrinciples: string;
}

const codeQualityFundamentals: CodeQualityFundamentals = {
  overview:
    'The Four Principles of Writing Good Code - fundamental guidelines for creating maintainable, readable, and scalable React applications. Based on Frontend Fundamentals (https://frontend-fundamentals.com/code-quality/en/code/).',

  corePhilosophy:
    'Good code is **easily modifiable** code. These four principles help you write code that can be changed, extended, and maintained with confidence over time.',

  balancingPrinciples:
    "These principles may conflict with each other. The key is to prioritize based on your specific context and long-term maintenance needs. No single principle is absolute - balance them according to your project's requirements.",

  principles: {
    readability: {
      name: 'Readability',
      description:
        'Code should be easy to read and understand at first glance. Readable code reduces cognitive load and makes maintenance faster.',
      whenToPrioritize:
        'Prioritize when working with complex business logic, onboarding new team members, or maintaining legacy code.',
      concepts: [
        {
          name: 'Reducing Context',
          description:
            "Separate code that doesn't run together and abstract implementation details to reduce the mental context needed to understand a piece of code.",
          examples: [
            {
              title: 'Separate unrelated logic',
              bad: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  useEffect(() => {
    // Fetch user data
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser);
    
    // Track page view
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event: 'profile_view', userId })
    });
    
    // Update analytics
    fetch(\`/api/analytics/\${userId}\`)
      .then(res => res.json())
      .then(setAnalytics);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}`,
              good: `function UserProfile({ userId }: { userId: string }) {
  const user = useUser(userId);
  const analytics = useUserAnalytics(userId);
  
  useAnalyticsTracking('profile_view', { userId });
  
  return <div>{user?.name}</div>;
}

// Separate custom hooks handle their own concerns
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  return user;
}`,
              explanation:
                'Separating concerns into focused custom hooks makes each piece of code easier to understand and test in isolation.',
            },
            {
              title: 'Abstract implementation details',
              bad: `function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products', {
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const sortedProducts = data.products.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(sortedProducts);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}`,
              good: `function ProductList() {
  const products = useProducts();
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// Implementation details are abstracted away
function useProducts() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    productService.getProducts()
      .then(sortProductsByDate)
      .then(setProducts)
      .catch(handleError);
  }, []);
  
  return products;
}`,
              explanation:
                'The component focuses on rendering while the hook handles data fetching complexity. Implementation details are hidden behind clear abstractions.',
            },
          ],
          bestPractices: [
            'Use custom hooks to separate data fetching from UI rendering',
            'Abstract complex operations behind descriptively named functions',
            'Keep components focused on their primary responsibility',
            'Group related logic together, separate unrelated logic',
          ],
        },
        {
          name: 'Naming',
          description:
            'Use clear, descriptive names for complex conditions and magic numbers to make code self-documenting.',
          examples: [
            {
              title: 'Name complex conditions',
              bad: `function UserCard({ user }: { user: User }) {
  return (
    <div className={
      user.subscription?.status === 'active' && 
      user.subscription?.plan !== 'free' && 
      user.lastLoginAt && 
      Date.now() - new Date(user.lastLoginAt).getTime() < 30 * 24 * 60 * 60 * 1000
        ? 'premium-user' 
        : 'regular-user'
    }>
      {user.name}
    </div>
  );
}`,
              good: `function UserCard({ user }: { user: User }) {
  const isPremiumActiveUser = 
    user.subscription?.status === 'active' && 
    user.subscription?.plan !== 'free' && 
    isRecentlyActive(user.lastLoginAt);
  
  return (
    <div className={isPremiumActiveUser ? 'premium-user' : 'regular-user'}>
      {user.name}
    </div>
  );
}

function isRecentlyActive(lastLoginAt: string | null): boolean {
  if (!lastLoginAt) return false;
  
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastLoginAt).getTime() < THIRTY_DAYS_MS;
}`,
              explanation:
                'Named conditions and extracted functions make the logic immediately understandable without mental parsing.',
            },
            {
              title: 'Name magic numbers',
              bad: `function useProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (searchQuery.length < 3) return;
      
      const response = await fetch(\`/api/search?q=\${searchQuery}&limit=50\`);
      const data = await response.json();
      setResults(data.results);
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return { query, setQuery, results };
}`,
              good: `function useProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const MINIMUM_QUERY_LENGTH = 3;
  const SEARCH_RESULTS_LIMIT = 50;
  const DEBOUNCE_DELAY_MS = 300;
  
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (searchQuery.length < MINIMUM_QUERY_LENGTH) return;
      
      const response = await fetch(
        \`/api/search?q=\${searchQuery}&limit=\${SEARCH_RESULTS_LIMIT}\`
      );
      const data = await response.json();
      setResults(data.results);
    }, DEBOUNCE_DELAY_MS),
    []
  );
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return { query, setQuery, results };
}`,
              explanation:
                'Named constants make the code self-documenting and easier to modify. The intent behind each number is immediately clear.',
            },
          ],
          bestPractices: [
            'Name complex boolean conditions with descriptive variables',
            'Extract magic numbers into named constants',
            'Use intention-revealing names for functions and variables',
            'Prefer descriptive names over comments when possible',
          ],
        },
        {
          name: 'Reading Flow',
          description:
            'Structure code to minimize eye movement and cognitive jumps when reading from top to bottom.',
          examples: [
            {
              title: 'Reduce eye movement in conditionals',
              bad: `function OrderStatus({ order }: { order: Order }) {
  return (
    <div>
      {order.status === 'pending' ? (
        <div className="status-pending">
          <Icon name="clock" />
          <span>Processing your order...</span>
          <Button onClick={() => cancelOrder(order.id)}>Cancel</Button>
        </div>
      ) : order.status === 'shipped' ? (
        <div className="status-shipped">
          <Icon name="truck" />
          <span>Order shipped on {formatDate(order.shippedAt)}</span>
          <Button onClick={() => trackOrder(order.id)}>Track Package</Button>
        </div>
      ) : order.status === 'delivered' ? (
        <div className="status-delivered">
          <Icon name="check" />
          <span>Delivered on {formatDate(order.deliveredAt)}</span>
          <Button onClick={() => reorder(order.items)}>Reorder</Button>
        </div>
      ) : (
        <div className="status-unknown">
          <Icon name="question" />
          <span>Status unknown</span>
        </div>
      )}
    </div>
  );
}`,
              good: `function OrderStatus({ order }: { order: Order }) {
  const statusComponents = {
    pending: (
      <div className="status-pending">
        <Icon name="clock" />
        <span>Processing your order...</span>
        <Button onClick={() => cancelOrder(order.id)}>Cancel</Button>
      </div>
    ),
    shipped: (
      <div className="status-shipped">
        <Icon name="truck" />
        <span>Order shipped on {formatDate(order.shippedAt)}</span>
        <Button onClick={() => trackOrder(order.id)}>Track Package</Button>
      </div>
    ),
    delivered: (
      <div className="status-delivered">
        <Icon name="check" />
        <span>Delivered on {formatDate(order.deliveredAt)}</span>
        <Button onClick={() => reorder(order.items)}>Reorder</Button>
      </div>
    ),
  };
  
  return (
    <div>
      {statusComponents[order.status] || (
        <div className="status-unknown">
          <Icon name="question" />
          <span>Status unknown</span>
        </div>
      )}
    </div>
  );
}`,
              explanation:
                'Object lookup eliminates the nested ternary chain, making each status case easy to read and modify independently.',
            },
          ],
          bestPractices: [
            'Avoid deeply nested ternary operators',
            'Use early returns to reduce nesting levels',
            'Group related code blocks together',
            'Structure conditional logic for linear reading',
          ],
        },
      ],
    },

    predictability: {
      name: 'Predictability',
      description:
        'Code should behave consistently and predictably. Similar functions should work in similar ways, and hidden behaviors should be made explicit.',
      whenToPrioritize:
        'Prioritize when building reusable components, working with team APIs, or creating functions that will be used across multiple contexts.',
      concepts: [
        {
          name: 'Managing Unique Names',
          description:
            'Ensure that similar functions across your codebase follow consistent naming patterns and behaviors.',
          examples: [
            {
              title: 'Consistent function naming patterns',
              bad: `// Inconsistent naming across similar functions
function fetchUser(id: string) { return api.get(\`/users/\${id}\`); }
function getUserPosts(userId: string) { return api.get(\`/users/\${userId}/posts\`); }
function loadUserComments(id: string) { return api.get(\`/users/\${id}/comments\`); }
function retrieveUserSettings(userId: string) { return api.get(\`/users/\${userId}/settings\`); }`,
              good: `// Consistent naming pattern
function getUser(id: string) { return api.get(\`/users/\${id}\`); }
function getUserPosts(userId: string) { return api.get(\`/users/\${userId}/posts\`); }
function getUserComments(userId: string) { return api.get(\`/users/\${userId}/comments\`); }
function getUserSettings(userId: string) { return api.get(\`/users/\${userId}/settings\`); }`,
              explanation:
                'Consistent naming patterns make it easier to predict function names and understand their purpose across the codebase.',
            },
          ],
          bestPractices: [
            'Use consistent prefixes (get, set, update, delete) for similar operations',
            'Follow established naming conventions throughout the codebase',
            'Make function names predictable based on their behavior',
          ],
        },
        {
          name: 'Unifying Return Types',
          description:
            'Similar functions should return data in consistent formats to reduce cognitive overhead when using them.',
          examples: [
            {
              title: 'Consistent return types for similar functions',
              bad: `function getUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`).then(res => res.json());
}

function getUserPosts(userId: string): Promise<Post[]> {
  return fetch(\`/api/users/\${userId}/posts\`)
    .then(res => res.json())
    .then(data => data.posts); // Unwraps the posts array
}

function getUserComments(userId: string): Promise<{ comments: Comment[], total: number }> {
  return fetch(\`/api/users/\${userId}/comments\`).then(res => res.json()); // Returns full response
}`,
              good: `interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
}

function getUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .then(response => response.data);
}

function getUserPosts(userId: string): Promise<Post[]> {
  return fetch(\`/api/users/\${userId}/posts\`)
    .then(res => res.json())
    .then(response => response.data);
}

function getUserComments(userId: string): Promise<Comment[]> {
  return fetch(\`/api/users/\${userId}/comments\`)
    .then(res => res.json())
    .then(response => response.data);
}`,
              explanation:
                "Consistent return types mean developers can predict what they'll get from similar functions without checking documentation each time.",
            },
          ],
          bestPractices: [
            'Standardize response formats across similar API functions',
            'Use TypeScript interfaces to enforce consistent return types',
            'Document any deviations from standard patterns clearly',
          ],
        },
        {
          name: 'Revealing Hidden Logic',
          description:
            'Make implicit behaviors and side effects explicit so other developers can predict what your code will do.',
          examples: [
            {
              title: 'Make side effects explicit',
              bad: `function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(userData => {
        setUser(userData);
        // Hidden side effect - also updates analytics
        fetch('/api/analytics', {
          method: 'POST',
          body: JSON.stringify({ event: 'user_viewed', userId })
        });
        // Hidden side effect - stores in localStorage
        localStorage.setItem('lastViewedUser', userId);
      });
  }, [userId]);
  
  return user;
}`,
              good: `function useUserData(userId: string, options: { trackView?: boolean } = {}) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(userData => {
      setUser(userData);
      
      if (options.trackView) {
        trackUserView(userId);
      }
      
      updateLastViewedUser(userId);
    });
  }, [userId, options.trackView]);
  
  return user;
}

// Side effects are now explicit functions
function trackUserView(userId: string) {
  return fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event: 'user_viewed', userId })
  });
}

function updateLastViewedUser(userId: string) {
  localStorage.setItem('lastViewedUser', userId);
}`,
              explanation:
                'Explicit parameters and named functions make it clear what side effects occur, allowing developers to make informed decisions about usage.',
            },
          ],
          bestPractices: [
            'Make side effects explicit through function names or parameters',
            'Avoid hidden behaviors in seemingly simple functions',
            'Use function names that accurately describe all behaviors',
          ],
        },
      ],
    },

    cohesion: {
      name: 'Cohesion',
      description:
        'Related code should be grouped together. Files, functions, and components should have a single, well-defined purpose.',
      whenToPrioritize:
        'Prioritize when organizing large codebases, creating reusable modules, or when code is scattered across many files without clear relationships.',
      concepts: [
        {
          name: 'File Organization',
          description:
            'Keep related files close together and organize them by feature or domain rather than technical type.',
          examples: [
            {
              title: 'Organize by feature, not by type',
              bad: `src/
├── components/
│   ├── UserProfile.tsx
│   ├── UserSettings.tsx
│   ├── UserList.tsx
│   ├── PostCard.tsx
│   ├── PostForm.tsx
│   └── CommentList.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useUserSettings.ts
│   ├── usePosts.ts
│   └── useComments.ts
├── services/
│   ├── userService.ts
│   ├── postService.ts
│   └── commentService.ts
└── types/
    ├── user.ts
    ├── post.ts
    └── comment.ts`,
              good: `src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserSettings.tsx
│   │   │   └── UserList.tsx
│   │   ├── hooks/
│   │   │   ├── useUser.ts
│   │   │   └── useUserSettings.ts
│   │   ├── services/
│   │   │   └── userService.ts
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── index.ts
│   ├── posts/
│   │   ├── components/
│   │   │   ├── PostCard.tsx
│   │   │   └── PostForm.tsx
│   │   ├── hooks/
│   │   │   └── usePosts.ts
│   │   ├── services/
│   │   │   └── postService.ts
│   │   └── types/
│   │       └── post.ts
│   └── comments/
│       └── ... similar structure
└── shared/
    ├── components/
    ├── hooks/
    └── utils/`,
              explanation:
                'Feature-based organization keeps all related code together, making it easier to understand and modify complete features.',
            },
          ],
          bestPractices: [
            'Group files by feature or domain, not technical layer',
            'Keep related components, hooks, and utilities in the same directory',
            'Use index files to create clean import boundaries',
            'Place shared code in clearly marked shared directories',
          ],
        },
        {
          name: 'Eliminating Magic Numbers',
          description:
            'Replace scattered magic numbers with named constants grouped in logical locations.',
          examples: [
            {
              title: 'Group related constants',
              bad: `// Constants scattered throughout different files
function UserCard({ user }) {
  return (
    <div style={{ maxWidth: 320 }}>
      {user.name.length > 25 ? user.name.substring(0, 25) + '...' : user.name}
    </div>
  );
}

function UserList({ users }) {
  const displayUsers = users.slice(0, 10);
  return (
    <div style={{ gap: 16 }}>
      {displayUsers.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}

function UserSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce(onSearch, 300),
    [onSearch]
  );
  
  return (
    <input 
      minLength={3}
      onChange={(e) => {
        setQuery(e.target.value);
        if (e.target.value.length >= 3) {
          debouncedSearch(e.target.value);
        }
      }}
    />
  );
}`,
              good: `// Constants grouped by domain
const USER_DISPLAY_CONSTANTS = {
  CARD_MAX_WIDTH: 320,
  NAME_MAX_LENGTH: 25,
  LIST_DEFAULT_LIMIT: 10,
  LIST_ITEM_GAP: 16,
} as const;

const USER_SEARCH_CONSTANTS = {
  MIN_QUERY_LENGTH: 3,
  DEBOUNCE_DELAY_MS: 300,
} as const;

function UserCard({ user }) {
  const { CARD_MAX_WIDTH, NAME_MAX_LENGTH } = USER_DISPLAY_CONSTANTS;
  
  return (
    <div style={{ maxWidth: CARD_MAX_WIDTH }}>
      {user.name.length > NAME_MAX_LENGTH 
        ? user.name.substring(0, NAME_MAX_LENGTH) + '...' 
        : user.name
      }
    </div>
  );
}

function UserList({ users }) {
  const { LIST_DEFAULT_LIMIT, LIST_ITEM_GAP } = USER_DISPLAY_CONSTANTS;
  const displayUsers = users.slice(0, LIST_DEFAULT_LIMIT);
  
  return (
    <div style={{ gap: LIST_ITEM_GAP }}>
      {displayUsers.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}`,
              explanation:
                'Grouping related constants makes it easy to understand and modify related values together, improving maintainability.',
            },
          ],
          bestPractices: [
            'Group related constants in objects or enums',
            "Place constants close to where they're used",
            'Use descriptive names that explain the purpose of each value',
            "Consider using TypeScript's const assertions for immutable constants",
          ],
        },
        {
          name: 'Form Cohesion',
          description:
            'Group related form logic, validation, and state management together rather than scattering it throughout components.',
          examples: [
            {
              title: 'Cohesive form management',
              bad: `function UserRegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      setEmailError('Invalid email');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (password: string, confirmPassword: string) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePassword(password, confirmPassword)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName })
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validateEmail(email)}
      />
      {emailError && <span>{emailError}</span>}
      {/* More form fields... */}
    </form>
  );
}`,
              good: `interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

function useUserRegistrationForm() {
  const [formData, setFormData] = useState<UserRegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updateField = (field: keyof UserRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<UserRegistrationData> = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const submitForm = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await userService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    validateForm,
  };
}

function UserRegistrationForm() {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
  } = useUserRegistrationForm();
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
      <input 
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      {/* More form fields... */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}`,
              explanation:
                'All form-related logic is cohesively organized in a custom hook, making the component cleaner and the form logic reusable.',
            },
          ],
          bestPractices: [
            'Group related form state and logic in custom hooks',
            'Keep validation logic together with form state',
            'Use TypeScript interfaces to define form data structure',
            'Centralize form submission and error handling',
          ],
        },
      ],
    },

    coupling: {
      name: 'Coupling',
      description:
        'Components and functions should have minimal dependencies on each other. Reduce tight coupling to make code more flexible and testable.',
      whenToPrioritize:
        'Prioritize when building reusable components, creating testable code, or when changes in one part of the system frequently break other parts.',
      concepts: [
        {
          name: 'Managing Responsibilities',
          description:
            'Each component should have a single, well-defined responsibility. Avoid components that know too much about other parts of the system.',
          examples: [
            {
              title: 'Single responsibility components',
              bad: `// Component with too many responsibilities
function UserDashboard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // Fetch user data
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser);
    
    // Fetch user posts
    fetch(\`/api/users/\${userId}/posts\`)
      .then(res => res.json())
      .then(setPosts);
    
    // Fetch analytics
    fetch(\`/api/users/\${userId}/analytics\`)
      .then(res => res.json())
      .then(setAnalytics);
    
    // Fetch notifications
    fetch(\`/api/users/\${userId}/notifications\`)
      .then(res => res.json())
      .then(setNotifications);
  }, [userId]);
  
  const handlePostLike = async (postId: string) => {
    await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' });
    // Update posts state
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: true }
        : post
    ));
  };
  
  const handleNotificationRead = async (notificationId: string) => {
    await fetch(\`/api/notifications/\${notificationId}/read\`, { method: 'POST' });
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };
  
  return (
    <div className="dashboard">
      {/* User profile section */}
      <div className="profile-section">
        <img src={user?.avatar} alt={user?.name} />
        <h1>{user?.name}</h1>
        <p>{user?.bio}</p>
      </div>
      
      {/* Posts section */}
      <div className="posts-section">
        <h2>Recent Posts</h2>
        {posts.map(post => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handlePostLike(post.id)}>
              Like ({post.likes})
            </button>
          </div>
        ))}
      </div>
      
      {/* Analytics section */}
      <div className="analytics-section">
        <h2>Analytics</h2>
        <div>Page Views: {analytics?.pageViews}</div>
        <div>Post Engagement: {analytics?.engagement}%</div>
      </div>
      
      {/* Notifications section */}
      <div className="notifications-section">
        <h2>Notifications</h2>
        {notifications.map(notification => (
          <div key={notification.id} className="notification">
            <p>{notification.message}</p>
            <button onClick={() => handleNotificationRead(notification.id)}>
              Mark as Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
              good: `// Dashboard orchestrates multiple focused components
function UserDashboard({ userId }: { userId: string }) {
  return (
    <div className="dashboard">
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
      <UserAnalytics userId={userId} />
      <UserNotifications userId={userId} />
    </div>
  );
}

// Each component has a single responsibility
function UserProfile({ userId }: { userId: string }) {
  const user = useUser(userId);
  
  if (!user) return <UserProfileSkeleton />;
  
  return (
    <div className="profile-section">
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}

function UserPosts({ userId }: { userId: string }) {
  const { posts, likePost } = useUserPosts(userId);
  
  return (
    <div className="posts-section">
      <h2>Recent Posts</h2>
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={() => likePost(post.id)} 
        />
      ))}
    </div>
  );
}

function UserAnalytics({ userId }: { userId: string }) {
  const analytics = useUserAnalytics(userId);
  
  return (
    <div className="analytics-section">
      <h2>Analytics</h2>
      <AnalyticsChart data={analytics} />
    </div>
  );
}`,
              explanation:
                'Each component focuses on a single aspect of the dashboard, making them easier to test, reuse, and modify independently.',
            },
          ],
          bestPractices: [
            'Break large components into smaller, focused components',
            'Each component should have one primary responsibility',
            'Use composition to combine simple components into complex UIs',
            'Extract shared logic into custom hooks',
          ],
        },
        {
          name: 'Handling Duplicate Code',
          description:
            'Sometimes duplicate code is preferable to tight coupling. Know when to extract shared logic and when to keep code separate.',
          examples: [
            {
              title: 'When duplication is better than coupling',
              bad: `// Over-abstracted utility that couples different concerns
function createApiEndpoint(
  config: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    requiresAuth?: boolean;
    cacheable?: boolean;
    retries?: number;
    timeout?: number;
    transformRequest?: (data: any) => any;
    transformResponse?: (data: any) => any;
    validateResponse?: (data: any) => boolean;
    errorHandler?: (error: Error) => void;
  }
) {
  return async (data?: any) => {
    let url = config.path;
    let options: RequestInit = {
      method: config.method,
      headers: {},
    };
    
    if (config.requiresAuth) {
      options.headers = { 
        ...options.headers, 
        Authorization: \`Bearer \${getToken()}\` 
      };
    }
    
    if (config.transformRequest && data) {
      data = config.transformRequest(data);
    }
    
    if (data && config.method !== 'GET') {
      options.body = JSON.stringify(data);
      options.headers = { 
        ...options.headers, 
        'Content-Type': 'application/json' 
      };
    }
    
    // ... lots more configuration logic
    
    try {
      const response = await fetch(url, options);
      let result = await response.json();
      
      if (config.transformResponse) {
        result = config.transformResponse(result);
      }
      
      if (config.validateResponse && !config.validateResponse(result)) {
        throw new Error('Invalid response');
      }
      
      return result;
    } catch (error) {
      if (config.errorHandler) {
        config.errorHandler(error as Error);
      }
      throw error;
    }
  };
}

// Usage becomes complex and tightly coupled to the utility
const getUser = createApiEndpoint({
  path: '/api/users',
  method: 'GET',
  requiresAuth: true,
  cacheable: true,
  transformResponse: (data) => ({ ...data, fullName: \`\${data.firstName} \${data.lastName}\` }),
  validateResponse: (data) => data && data.id,
});`,
              good: `// Simple, focused functions that may have some duplication
async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`, {
    headers: {
      Authorization: \`Bearer \${getToken()}\`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  const data = await response.json();
  return {
    ...data,
    fullName: \`\${data.firstName} \${data.lastName}\`,
  };
}

async function createPost(postData: CreatePostData): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${getToken()}\`,
    },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  
  return response.json();
}

// Shared utilities for common patterns only
function withAuth(headers: Record<string, string> = {}) {
  return {
    ...headers,
    Authorization: \`Bearer \${getToken()}\`,
  };
}`,
              explanation:
                'Simple, focused functions are easier to understand and modify than a complex over-abstracted utility. Some duplication is acceptable when it keeps code decoupled.',
            },
          ],
          bestPractices: [
            'Prefer simple duplication over complex abstractions',
            'Extract shared logic only when patterns are truly identical',
            'Keep abstractions focused on single concerns',
            'Consider the maintenance cost of both duplication and abstraction',
          ],
        },
        {
          name: 'Eliminating Props Drilling',
          description:
            'Avoid passing props through multiple component layers. Use context, state management, or component composition to reduce coupling.',
          examples: [
            {
              title: 'Use context for deeply nested shared state',
              bad: `// Props drilling through multiple levels
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <Layout user={user} theme={theme} onThemeChange={setTheme}>
      <Dashboard user={user} theme={theme} />
    </Layout>
  );
}

function Layout({ 
  user, 
  theme, 
  onThemeChange, 
  children 
}: { 
  user: User | null; 
  theme: 'light' | 'dark'; 
  onThemeChange: (theme: 'light' | 'dark') => void;
  children: ReactNode;
}) {
  return (
    <div className={\`layout layout--\${theme}\`}>
      <Header user={user} theme={theme} onThemeChange={onThemeChange} />
      <main>{children}</main>
    </div>
  );
}

function Header({ user, theme, onThemeChange }: {
  user: User | null;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}) {
  return (
    <header>
      <UserMenu user={user} />
      <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
    </header>
  );
}`,
              good: `// Context eliminates props drilling
const AppContext = createContext<{
  user: User | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
} | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <AppContext.Provider value={{ user, theme, setTheme }}>
      <Layout>
        <Dashboard />
      </Layout>
    </AppContext.Provider>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const { theme } = useAppContext();
  
  return (
    <div className={\`layout layout--\${theme}\`}>
      <Header />
      <main>{children}</main>
    </div>
  );
}

function Header() {
  return (
    <header>
      <UserMenu />
      <ThemeToggle />
    </header>
  );
}

// Components access context directly
function ThemeToggle() {
  const { theme, setTheme } = useAppContext();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContext.Provider');
  }
  return context;
}`,
              explanation:
                "Context provides direct access to shared state without coupling intermediate components to data they don't use.",
            },
          ],
          bestPractices: [
            'Use React Context for data needed by many components',
            'Consider component composition patterns to avoid prop drilling',
            'Use state management libraries for complex global state',
            'Keep context focused on specific domains (user, theme, etc.)',
          ],
        },
      ],
    },
  },
};

export const getCodeQualityFundamentalsTool: Tool = {
  name: 'get_code_quality_fundamentals',
  description:
    'Get comprehensive code quality fundamentals based on the four principles: Readability, Predictability, Cohesion, and Coupling. These principles help you write maintainable React/TypeScript code.',
  inputSchema: {
    type: 'object',
  },
};

export function handleGetCodeQualityFundamentals(): CodeQualityFundamentals {
  return codeQualityFundamentals;
}
