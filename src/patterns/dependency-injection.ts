import type { PatternDefinition } from '../types/index.js';

export const dependencyInjectionPattern: PatternDefinition = {
  overview: {
    name: 'Dependency Injection Pattern',
    description:
      'A fundamental design pattern that provides dependencies to components from external sources rather than having components create or import them directly. This pattern promotes loose coupling, enhances testability, and enables flexible configuration by allowing dependencies to be swapped out without modifying component code.',
    whenToUse:
      'Use when components depend on external services, APIs, or utilities that need to be mocked during testing, when building applications that need to work in different environments (development, staging, production) with different configurations, when you want to make components more reusable by removing hard dependencies, when implementing feature flags or A/B testing that requires swapping implementations, or when building modular applications where different parts might use different service implementations.',
  },
  detailed: {
    name: 'Dependency Injection Pattern',
    description:
      'Inject dependencies into components rather than hardcoding them, improving testability and flexibility.',
    problem:
      'Components have hard dependencies on specific services, making them difficult to test and reuse.',
    solution:
      'Pass dependencies as props or through context, allowing different implementations for different environments.',
    benefits: [
      'Improved testability',
      'Better separation of concerns',
      'Easier to mock dependencies',
      'More flexible and reusable components',
      'Better abstraction',
    ],
    drawbacks: [
      'Additional complexity',
      'More verbose component signatures',
      'Requires discipline to maintain',
      'Can be overkill for simple applications',
    ],
    examples: [
      {
        title: '❌ BAD: Hard-Coded Dependencies',
        description: 'Components tightly coupled to specific implementations',
        code: `// ❌ BAD: Component directly imports and uses fetch
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Hard-coded fetch implementation
    fetch('/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  const handleDelete = async (id: string) => {
    try {
      // Hard-coded delete implementation
      const response = await fetch(\`/api/users/\${id}\`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setUsers(users => users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleCreate = async (userData: Partial<User>) => {
    try {
      // Hard-coded create implementation
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const newUser = await response.json();
      setUsers(users => [...users, newUser]);
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
      <CreateUserForm onSubmit={handleCreate} />
    </div>
  );
}

// Problems:
// - Impossible to test without making real HTTP requests
// - Can't switch API implementations (REST vs GraphQL)
// - Component knows too much about API details
// - No way to mock or stub external dependencies
// - Tight coupling makes component hard to reuse`,
      },
      {
        title: '✅ GOOD: Dependency Injection with Interfaces',
        description: 'Flexible, testable components using dependency injection',
        code: `// ✅ GOOD: Define clear interfaces for dependencies
interface UserService {
  getUsers(): Promise<User[]>;
  createUser(user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

interface NotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
}

// Real HTTP implementation
class HttpUserService implements UserService {
  constructor(private baseUrl: string = '/api') {}
  
  async getUsers(): Promise<User[]> {
    const response = await fetch(\`\${this.baseUrl}/users\`);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: Failed to fetch users\`);
    }
    return response.json();
  }
  
  async createUser(user: Partial<User>): Promise<User> {
    const response = await fetch(\`\${this.baseUrl}/users\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: Failed to create user\`);
    }
    
    return response.json();
  }
  
  async deleteUser(id: string): Promise<void> {
    const response = await fetch(\`\${this.baseUrl}/users/\${id}\`, { 
      method: 'DELETE' 
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: Failed to delete user\`);
    }
  }
}

// Toast notification implementation
class ToastNotificationService implements NotificationService {
  showSuccess(message: string): void {
    toast.success(message);
  }
  
  showError(message: string): void {
    toast.error(message);
  }
}

// Component receives dependencies as props
interface UserListProps {
  userService: UserService;
  notificationService: NotificationService;
}

function UserList({ userService, notificationService }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    userService.getUsers()
      .then(setUsers)
      .catch(err => {
        notificationService.showError(\`Failed to load users: \${err.message}\`);
      })
      .finally(() => setLoading(false));
  }, [userService, notificationService]);
  
  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users => users.filter(u => u.id !== id));
      notificationService.showSuccess('User deleted successfully');
    } catch (err) {
      notificationService.showError(\`Failed to delete user: \${err.message}\`);
    }
  };
  
  const handleCreate = async (userData: Partial<User>) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers(users => [...users, newUser]);
      notificationService.showSuccess('User created successfully');
    } catch (err) {
      notificationService.showError(\`Failed to create user: \${err.message}\`);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
      <CreateUserForm onSubmit={handleCreate} />
    </div>
  );
}

// Production usage
function App() {
  const userService = new HttpUserService('/api/v1');
  const notificationService = new ToastNotificationService();
  
  return (
    <UserList 
      userService={userService}
      notificationService={notificationService}
    />
  );
}

// Test usage with mocks
function TestApp() {
  const mockUserService: UserService = {
    getUsers: jest.fn().mockResolvedValue([
      { id: '1', name: 'Test User 1' },
      { id: '2', name: 'Test User 2' }
    ]),
    createUser: jest.fn().mockResolvedValue({ id: '3', name: 'New User' }),
    deleteUser: jest.fn().mockResolvedValue(undefined)
  };
  
  const mockNotificationService: NotificationService = {
    showSuccess: jest.fn(),
    showError: jest.fn()
  };
  
  return (
    <UserList 
      userService={mockUserService}
      notificationService={mockNotificationService}
    />
  );
}

// Benefits:
// - Easy to test with mock implementations
// - Can switch between different API implementations
// - Component focused on UI logic, not API details
// - Flexible and reusable across different environments`,
      },
      {
        title: '✅ GOOD: Context-Based Dependency Injection',
        description: 'Using React Context for app-wide dependency injection',
        code: `// ✅ GOOD: Context-based DI for app-wide services
interface AppServices {
  userService: UserService;
  notificationService: NotificationService;
  analyticsService: AnalyticsService;
}

const ServicesContext = createContext<AppServices | null>(null);

// Custom hook to access services
function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return services;
}

// Provider component
function ServicesProvider({ children }: { children: React.ReactNode }) {
  const services: AppServices = useMemo(() => ({
    userService: new HttpUserService(),
    notificationService: new ToastNotificationService(),
    analyticsService: new GoogleAnalyticsService()
  }), []);
  
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

// Components can now access services via hook
function UserList() {
  const { userService, notificationService } = useServices();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    userService.getUsers()
      .then(setUsers)
      .catch(err => {
        notificationService.showError(\`Failed to load users: \${err.message}\`);
      })
      .finally(() => setLoading(false));
  }, [userService, notificationService]);
  
  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users => users.filter(u => u.id !== id));
      notificationService.showSuccess('User deleted successfully');
    } catch (err) {
      notificationService.showError(\`Failed to delete user: \${err.message}\`);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// App setup
function App() {
  return (
    <ServicesProvider>
      <Router>
        <Routes>
          <Route path="/users" element={<UserList />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </ServicesProvider>
  );
}

// Test setup with mock services
function TestServicesProvider({ children }: { children: React.ReactNode }) {
  const mockServices: AppServices = useMemo(() => ({
    userService: {
      getUsers: jest.fn().mockResolvedValue([]),
      createUser: jest.fn(),
      deleteUser: jest.fn()
    },
    notificationService: {
      showSuccess: jest.fn(),
      showError: jest.fn()
    },
    analyticsService: {
      track: jest.fn()
    }
  }), []);
  
  return (
    <ServicesContext.Provider value={mockServices}>
      {children}
    </ServicesContext.Provider>
  );
}`,
      },
    ],
    bestPractices: [
      'Define clear interfaces for dependencies',
      'Use TypeScript for better type safety',
      'Consider using React context for app-wide dependencies',
      'Keep interfaces focused and minimal',
      'Provide good default implementations',
    ],
    commonMistakes: [
      'Over-abstracting simple dependencies',
      'Not defining clear interfaces',
      'Passing too many dependencies as props',
      'Making interfaces too broad',
      'Not considering the testing implications',
    ],
    relatedPatterns: ['service-layer', 'adapter-pattern'],
  },
};
