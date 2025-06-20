import type { PatternDefinition } from '../types/index.js';

export const containerPresentationalPattern: PatternDefinition = {
  overview: {
    name: 'Container/Presentational Pattern',
    description:
      'A foundational React pattern that separates components into two distinct types: smart containers that handle data, state, and business logic, and dumb presentational components that focus purely on rendering UI. This separation creates cleaner, more maintainable, and testable code by establishing clear boundaries between data management and visual presentation.',
    whenToUse:
      'Use when you have components mixing data fetching with UI logic, need to reuse UI components with different data sources, want to improve testability by isolating pure UI components, are building complex forms or data-heavy interfaces, have components that are becoming too large and handling multiple responsibilities, or need to share the same UI component across different parts of your application with different data sources.',
  },
  detailed: {
    name: 'Container/Presentational Pattern',
    description:
      'Separate components that manage data and state (containers) from components that handle presentation (presentational).',
    problem:
      'Components become large and difficult to test when they mix data logic with presentation logic.',
    solution:
      'Split components into containers that handle logic and presentational components that handle UI.',
    benefits: [
      'Clear separation of concerns',
      'Easier testing of presentational components',
      'Reusable presentational components',
      'Better maintainability',
      'Cleaner component hierarchy',
    ],
    drawbacks: [
      'Can lead to over-engineering for simple components',
      'More files to maintain',
      'Additional complexity for small applications',
    ],
    examples: [
      {
        title: 'User List Implementation',
        description: 'Comparing mixed concerns vs separated container/presentational components',
        comparison: {
          bad: {
            title: 'Mixed Concerns',
            description: 'Component mixing data logic with presentation - hard to test and reuse',
            code: `// ❌ BAD: Everything mixed together
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = (userId) => {
    deleteUser(userId).then(() => {
      setUsers(users.filter(user => user.id !== userId));
    });
  };

  // Hard to test this UI logic separately
  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  
  return (
    <div className="user-list">
      <h2>Users ({users.length})</h2>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <img src={user.avatar} alt={user.name} />
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <button onClick={() => handleDeleteUser(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}`,
          },
          good: {
            title: 'Separated Concerns',
            description: 'Clear separation between data logic and presentation',
            code: `// ✅ GOOD: Container handles data
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = (userId) => {
    deleteUser(userId).then(() => {
      setUsers(users.filter(user => user.id !== userId));
    });
  };

  return (
    <UserList 
      users={users}
      loading={loading}
      error={error}
      onDeleteUser={handleDeleteUser}
    />
  );
}

// ✅ GOOD: Presentational component handles UI only
function UserList({ users, loading, error, onDeleteUser }) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="user-list">
      <h2>Users ({users.length})</h2>
      {users.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onDelete={() => onDeleteUser(user.id)}
        />
      ))}
    </div>
  );
}

// ✅ GOOD: Reusable presentational component
function UserCard({ user, onDelete }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}`,
          },
        },
      },
    ],
    bestPractices: [
      'Keep presentational components pure and predictable',
      'Use TypeScript interfaces to define props clearly',
      'Extract custom hooks for complex logic instead of container components when possible',
      'Presentational components should only handle UI concerns',
      'Container components should handle all side effects',
    ],
    commonMistakes: [
      'Putting UI logic in container components',
      'Adding side effects to presentational components',
      'Over-splitting simple components',
      'Not defining clear prop interfaces',
      'Mixing presentation and logic in the same component',
    ],
    relatedPatterns: ['compound-component'],
  },
};
