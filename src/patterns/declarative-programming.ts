import type { PatternDefinition } from '../types/index.js';

export const declarativeProgrammingPattern: PatternDefinition = {
  overview: {
    name: 'Declarative Programming Pattern',
    description:
      'Transform imperative code into declarative React patterns by describing what the UI should look like rather than how to achieve it. This includes conditional rendering with Suspense and ErrorBoundary, state transformations with derived values, event handling with declarative patterns, and data flow that emphasizes intent over implementation details.',
    whenToUse:
      "Use when you have complex imperative logic scattered throughout components, when you want to standardize loading/error/success states, when building reusable UI patterns, when you need to reduce cognitive load by making component intentions explicit, when you want to leverage React's built-in optimizations, or when you need to make code more testable and predictable by removing side effects and manual DOM manipulation.",
  },
  detailed: {
    name: 'Declarative Programming Pattern',
    description:
      'Transform imperative code into declarative React patterns that express what the UI should look like rather than how to achieve it, covering conditional rendering, state management, event handling, and data transformations.',
    problem:
      'Components become cluttered with imperative logic like manual DOM manipulation, complex conditional chains, procedural event handling, and step-by-step state updates that obscure the intended behavior and make code harder to understand and maintain.',
    solution:
      "Use React's declarative patterns: Suspense/ErrorBoundary for conditional rendering, derived state for transformations, declarative event handlers, and functional programming principles to express intent clearly.",
    benefits: [
      'More readable and self-documenting code',
      'Consistent handling of common UI states',
      'Better separation of concerns',
      'Easier testing of UI states',
      "Leverages React's built-in optimizations",
      'Reduces boilerplate code',
    ],
    drawbacks: [
      "Requires understanding of React's declarative patterns",
      'May need additional wrapper components',
      'Can be overkill for simple conditions',
      'Learning curve for team members',
    ],
    examples: [
      {
        title: 'Conditional Rendering Patterns',
        description: 'Comparing imperative conditional logic with declarative component patterns',
        comparison: {
          bad: {
            title: 'Imperative Conditional Logic',
            description: 'Complex nested conditions making component logic hard to follow',
            code: `// ❌ BAD: Imperative conditional rendering
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
      
    fetchPermissions(userId)
      .then(setPermissions)
      .catch(setError)
      .finally(() => setPermissionsLoading(false));
  }, [userId]);

  // Complex imperative logic
  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error Loading Profile</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h3 className="text-gray-500">User not found</h3>
      </div>
    );
  }

  if (!permissions?.canViewProfile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-yellow-800">Access Denied</h3>
        <p className="text-yellow-600 text-sm">You don't have permission to view this profile.</p>
      </div>
    );
  }

  // Actual component logic buried at the bottom
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <UserDetails user={user} />
    </div>
  );
}`,
          },
          good: {
            title: 'Declarative with Components',
            description:
              'Clean declarative approach using Suspense, ErrorBoundary, and conditional components',
            code: `// ✅ GOOD: Declarative conditional rendering
function UserProfile({ userId }) {
  return (
    <ErrorBoundary fallback={<ErrorDisplay />}>
      <Suspense fallback={<LoadingSpinner message="Loading user data..." />}>
        <PermissionGuard 
          userId={userId} 
          permission="canViewProfile"
          fallback={<AccessDenied />}
        >
          <UserProfileContent userId={userId} />
        </PermissionGuard>
      </Suspense>
    </ErrorBoundary>
  );
}

// Clean, focused component with single responsibility
function UserProfileContent({ userId }) {
  const user = useSuspenseQuery(['user', userId], () => fetchUser(userId));

  return (
    <ConditionalRender
      condition={user}
      fallback={<NotFound message="User not found" />}
    >
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <UserDetails user={user} />
      </div>
    </ConditionalRender>
  );
}

// Reusable declarative components
function ConditionalRender({ condition, fallback, children }) {
  return condition ? children : fallback;
}

function PermissionGuard({ userId, permission, fallback, children }) {
  const permissions = useSuspenseQuery(
    ['permissions', userId], 
    () => fetchPermissions(userId)
  );
  
  return permissions?.[permission] ? children : fallback;
}

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">{message}</span>
    </div>
  );
}

function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <h3 className="text-red-800 font-medium">Something went wrong</h3>
      <p className="text-red-600 text-sm mt-1">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button 
        onClick={onRetry || (() => window.location.reload())}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
      >
        Try Again
      </button>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <h3 className="text-yellow-800">Access Denied</h3>
      <p className="text-yellow-600 text-sm">
        You don't have permission to view this content.
      </p>
    </div>
  );
}`,
          },
        },
      },
      {
        title: 'Event Handling and State Management',
        description: 'Comparing imperative event handling with declarative state flow patterns',
        comparison: {
          bad: {
            title: 'Imperative Event Handling & State',
            description: 'Manual event handling and imperative state updates',
            code: `// ❌ BAD: Imperative approach to form handling
function SearchForm() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Imperative event handling
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Manual validation
    if (!query.trim()) {
      inputRef.current.focus();
      inputRef.current.style.borderColor = 'red';
      return;
    }
    
    // Manual loading state management
    setLoading(true);
    setResults([]);
    
    // Imperative API call with manual error handling
    fetch(\`/api/search?q=\${query}&filters=\${JSON.stringify(filters)}\`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Search failed');
        }
        return response.json();
      })
      .then(data => {
        setResults(data.results);
        setLoading(false);
        // Manual scroll to results
        document.getElementById('results').scrollIntoView();
      })
      .catch(error => {
        setLoading(false);
        // Manual error display
        alert('Search failed: ' + error.message);
      });
  };

  // Imperative filter handling
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    
    // Manual dependent state update
    if (query) {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          // Manual style reset
          e.target.style.borderColor = '';
        }}
        placeholder="Search..."
      />
      
      {/* Manual filter rendering */}
      <select onChange={(e) => handleFilterChange('category', e.target.value)}>
        <option value="">All Categories</option>
        <option value="tech">Technology</option>
        <option value="business">Business</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      <div id="results">
        {loading && <div>Loading...</div>}
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </form>
  );
}`,
          },
          good: {
            title: 'Declarative State & Event Flow',
            description: 'Declarative approach using derived state and clean data flow',
            code: `// ✅ GOOD: Declarative approach with clear data flow
function SearchForm() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  // Declarative derived state
  const searchParams = useMemo(() => ({
    query: query.trim(),
    filters,
    isValid: query.trim().length > 0
  }), [query, filters]);
  
  // Declarative data fetching
  const { 
    data: results, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: () => searchAPI(searchParams),
    enabled: searchParams.isValid,
  });

  // Declarative form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchParams.isValid) {
      refetch();
    }
  }, [searchParams.isValid, refetch]);

  // Declarative filter updates
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  }, []);

  return (
    <SearchFormLayout onSubmit={handleSubmit}>
      <SearchInput
        value={query}
        onChange={setQuery}
        isValid={searchParams.isValid}
        placeholder="Search..."
      />
      
      <FilterSelect
        value={filters.category || ''}
        onChange={(value) => updateFilter('category', value)}
        options={[
          { value: '', label: 'All Categories' },
          { value: 'tech', label: 'Technology' },
          { value: 'business', label: 'Business' },
        ]}
      />
      
      <SubmitButton 
        isLoading={isLoading}
        disabled={!searchParams.isValid}
      >
        Search
      </SubmitButton>
      
      <SearchResults
        results={results}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </SearchFormLayout>
  );
}

// Declarative components that express intent
function SearchInput({ value, onChange, isValid, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={\`border rounded px-3 py-2 \${
        value && !isValid ? 'border-red-500' : 'border-gray-300'
      }\`}
    />
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function SubmitButton({ isLoading, disabled, children }) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {isLoading ? 'Searching...' : children}
    </button>
  );
}

function SearchResults({ results, isLoading, error, onRetry }) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} />;
  if (!results?.length) return <EmptyState />;

  return (
    <div className="mt-4 space-y-2">
      {results.map(result => (
        <SearchResultItem key={result.id} result={result} />
      ))}
    </div>
  );
}`,
          },
        },
      },
    ],
    bestPractices: [
      'Express "what" should happen, not "how" it should happen',
      'Use data transformations instead of step-by-step mutations',
      'Prefer pure functions that return new values over procedures that modify state',
      'Model state as immutable data structures that represent current reality',
      'Use functional composition to build complex logic from simple pieces',
      'Express business rules as declarative predicates and transformations',
      'Design APIs that describe desired outcomes rather than implementation steps',
      'Use descriptive names that communicate intent rather than implementation details',
    ],
    commonMistakes: [
      'Writing step-by-step procedures instead of describing desired end states',
      'Mutating existing data structures instead of creating new ones',
      'Using imperative loops (for, while) when functional methods would be clearer',
      'Mixing declarative and imperative approaches in the same abstraction level',
      'Creating APIs that expose implementation details rather than intent',
      'Building complex logic with nested conditions instead of composable functions',
      'Manually orchestrating sequences of operations instead of describing dependencies',
      'Focusing on "how to change" rather than "what the result should be"',
    ],
    relatedPatterns: ['container-presentational', 'compound-component'],
  },
};
