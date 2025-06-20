import type { PatternDefinition } from '../types/index.js';

export const higherOrderComponentPattern: PatternDefinition = {
  overview: {
    name: 'Higher-Order Component (HOC)',
    description:
      'A classic React pattern that uses functions to take a component as input and return a new enhanced component with additional props, state, or behavior. HOCs enable code reuse and separation of cross-cutting concerns by wrapping components with shared functionality, creating a powerful composition pattern for extending component capabilities.',
    whenToUse:
      'Use when you need to add cross-cutting concerns like authentication, authorization, logging, or error boundaries to multiple components, when building component libraries that need consistent behavior across many components, when you need to conditionally render components based on external state, when working with legacy codebases that do not use hooks, or when you need to enhance third-party components that you cannot modify directly.',
  },
  detailed: {
    name: 'Higher-Order Component (HOC) Pattern',
    description:
      'A function that takes a component and returns a new component with additional functionality.',
    problem:
      'Multiple components need the same behavior (like authentication, logging, or data fetching) but copy-pasting code leads to duplication.',
    solution:
      'Create a function that wraps components and adds the shared behavior, returning an enhanced component.',
    benefits: [
      'Code reuse across multiple components',
      'Separation of cross-cutting concerns',
      'Can compose multiple HOCs together',
      'Works well with class and function components',
      'Can manipulate props before passing them down',
    ],
    drawbacks: [
      'Can create prop naming collisions',
      'Harder to debug with React DevTools',
      'Can lead to wrapper hell',
      'Static typing can be challenging',
      'Custom hooks are often a better modern solution',
    ],
    examples: [
      {
        title: '❌ BAD: Duplicated Logic Across Components',
        description: 'Components with repeated authentication and loading logic',
        code: `// ❌ BAD: Every component handles auth and loading separately
function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Duplicate auth logic
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  // Duplicate loading handling
  useEffect(() => {
    if (user) {
      fetchDashboardData()
        .then(setDashboardData)
        .finally(() => setDataLoading(false));
    }
  }, [user]);
  
  if (loading || dataLoading) return <LoadingSpinner />;
  if (!user) return null;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <DashboardContent data={dashboardData} />
    </div>
  );
}

function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Same auth logic repeated!
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  // Same loading pattern repeated!
  useEffect(() => {
    if (user) {
      fetchProfileData()
        .then(setProfileData)
        .finally(() => setDataLoading(false));
    }
  }, [user]);
  
  if (loading || dataLoading) return <LoadingSpinner />;
  if (!user) return null;
  
  return (
    <div>
      <h1>Profile: {user.name}</h1>
      <ProfileDetails data={profileData} />
    </div>
  );
}

// Problems:
// - Duplicated authentication logic
// - Repeated loading state handling
// - Hard to maintain and update
// - Easy to forget auth checks in new components
// - Inconsistent behavior across components`,
      },
      {
        title: '✅ GOOD: HOC for Shared Cross-Cutting Concerns',
        description: 'HOC that provides authentication and loading logic to multiple components',
        code: `// ✅ GOOD: HOC handles auth and loading logic once
function withAuth(WrappedComponent) {
  // Set display name for debugging
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!loading && !user) {
        navigate('/login', { 
          state: { from: window.location.pathname } 
        });
      }
    }, [user, loading, navigate]);
    
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (!user) {
      return null;
    }
    
    // Forward ref if the wrapped component uses refs
    return <WrappedComponent {...props} user={user} />;
  }
  
  AuthenticatedComponent.displayName = \`withAuth(\${componentName})\`;
  return AuthenticatedComponent;
}

// Components focus on their core responsibility
function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData()
      .then(setDashboardData)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <DashboardContent data={dashboardData} />
    </div>
  );
}

function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProfileData()
      .then(setProfileData)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1>Profile: {user.name}</h1>
      <ProfileDetails data={profileData} />
    </div>
  );
}

// Apply HOC to components that need authentication
const AuthenticatedDashboard = withAuth(Dashboard);
const AuthenticatedProfile = withAuth(Profile);

// Benefits:
// - Authentication logic centralized in one place
// - Easy to update auth behavior across all components
// - Components focus on their primary responsibility
// - Consistent behavior across the application
// - Easy to add new authenticated routes`,
      },
      {
        title: '✅ GOOD: Composable HOCs with TypeScript',
        description: 'Type-safe HOCs that can be composed together',
        code: `// ✅ GOOD: Well-typed composable HOCs
interface WithLoadingProps {
  loading?: boolean;
}

interface WithErrorProps {
  error?: Error | null;
}

interface WithAnalyticsProps {
  trackingId?: string;
}

// Loading HOC
function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { loading, ...restProps } = props;
    
    if (loading) {
      return (
        <div className="loading-container">
          <Spinner size="large" />
          <p>Loading...</p>
        </div>
      );
    }
    
    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Error boundary HOC
function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & WithErrorProps> {
  return function WithErrorBoundaryComponent(props: P & WithErrorProps) {
    const { error, ...restProps } = props;
    
    if (error) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      );
    }
    
    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Analytics HOC
function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & WithAnalyticsProps> {
  return function WithAnalyticsComponent(props: P & WithAnalyticsProps) {
    const { trackingId, ...restProps } = props;
    
    useEffect(() => {
      if (trackingId) {
        analytics.track('component_mounted', {
          component: WrappedComponent.name,
          trackingId,
          timestamp: Date.now()
        });
      }
      
      return () => {
        if (trackingId) {
          analytics.track('component_unmounted', {
            component: WrappedComponent.name,
            trackingId,
            timestamp: Date.now()
          });
        }
      };
    }, [trackingId]);
    
    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Base component
interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

function UserList({ users, onSelectUser }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onSelectUser(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Compose multiple HOCs
const EnhancedUserList = withAnalytics(
  withErrorBoundary(
    withLoading(UserList)
  )
);

// Usage with all enhanced features
function App() {
  const { users, loading, error } = useUsers();
  
  return (
    <EnhancedUserList
      users={users}
      loading={loading}
      error={error}
      trackingId="user-list-main"
      onSelectUser={handleUserSelect}
    />
  );
}`,
      },
    ],
    bestPractices: [
      'Use descriptive names (withAuth, withAnalytics, etc.)',
      'Pass through all props using spread operator',
      'Handle component display names for debugging',
      'Copy over static methods when needed',
      'Consider using custom hooks instead for new code',
      'Document which props the HOC injects',
    ],
    commonMistakes: [
      'Not forwarding refs properly',
      'Creating new components on every render',
      'Mutating the wrapped component',
      'Poor prop naming leading to collisions',
      'Not handling TypeScript types properly',
      'Using HOCs when hooks would be simpler',
    ],
    relatedPatterns: ['render-props', 'compound-component'],
  },
};
