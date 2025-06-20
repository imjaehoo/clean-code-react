import type { PatternDefinition } from '../types/index.js';

export const propDrillingSolutionsPattern: PatternDefinition = {
  overview: {
    name: 'Prop Drilling Solutions Pattern',
    description:
      'Address the problem of prop drilling (passing props through multiple component layers) using various React patterns including Context, component composition, state co-location, custom hooks, and render props. Choose the right solution based on your specific use case to maintain clean, maintainable component hierarchies.',
    whenToUse:
      "Use when you find yourself passing props through multiple component layers that don't use those props themselves, when you have deeply nested component trees with shared state, when building reusable component libraries that need flexible data access, when you want to avoid tightly coupling components to specific prop shapes, or when you need to share stateful logic across components without complex prop threading.",
  },
  detailed: {
    name: 'Prop Drilling Solutions Pattern',
    description:
      'Solve prop drilling using the most appropriate React pattern for your use case, from simple component composition to Context API for complex shared state.',
    problem:
      "Props need to be passed through multiple component layers where intermediate components don't use those props, creating unnecessary coupling, verbose component signatures, and maintenance burden when prop shapes change.",
    solution:
      'Apply the right solution based on the scenario: component composition for layout, Context for truly global state, custom hooks for shared logic, state co-location for localized needs, or render props for flexible data sharing.',
    benefits: [
      'Eliminates unnecessary prop passing through components',
      'Reduces coupling between components',
      'Cleaner component interfaces and signatures',
      'Easier maintenance when data shapes change',
      'Better component reusability',
      'More explicit data dependencies',
    ],
    drawbacks: [
      'Context can cause unnecessary re-renders if not used carefully',
      'Over-abstraction can make data flow harder to follow',
      'Multiple solutions to choose from can be overwhelming',
      'Some patterns require more initial setup',
    ],
    examples: [
      {
        title: 'Prop Drilling vs Context Solutions',
        description:
          'Comparing prop drilling problems with appropriate solutions like Context, composition, and state co-location',
        comparison: {
          bad: {
            title: 'Deep Prop Drilling',
            description: "Props passed through components that don't need them",
            code: `// ❌ BAD: Props drilled through multiple levels
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <Layout 
      user={user}
      theme={theme}
      notifications={notifications}
      onThemeChange={setTheme}
      onNotificationDismiss={(id) => 
        setNotifications(prev => prev.filter(n => n.id !== id))
      }
    />
  );
}

// Layout doesn't need these props but has to pass them down
function Layout({ user, theme, notifications, onThemeChange, onNotificationDismiss }) {
  return (
    <div className={\`layout layout--\${theme}\`}>
      <Header 
        user={user}
        theme={theme}
        onThemeChange={onThemeChange}
      />
      <Main 
        user={user}
        notifications={notifications}
        onNotificationDismiss={onNotificationDismiss}
      />
    </div>
  );
}

// Header only needs user and theme
function Header({ user, theme, onThemeChange }) {
  return (
    <header className="header">
      <Navigation user={user} />
      <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
    </header>
  );
}

// Main only needs notifications
function Main({ user, notifications, onNotificationDismiss }) {
  return (
    <main className="main">
      <Sidebar user={user} />
      <Content 
        notifications={notifications}
        onNotificationDismiss={onNotificationDismiss}
      />
    </main>
  );
}

// Navigation finally uses user
function Navigation({ user }) {
  return (
    <nav>
      {user ? (
        <span>Welcome, {user.name}</span>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
}

// Content finally uses notifications
function Content({ notifications, onNotificationDismiss }) {
  return (
    <div className="content">
      <NotificationList 
        notifications={notifications}
        onDismiss={onNotificationDismiss}
      />
      <MainContent />
    </div>
  );
}`,
          },
          good: {
            title: 'Multiple Solutions Applied',
            description: 'Using the right pattern for each data sharing need',
            code: `// ✅ GOOD: Multiple solutions based on use case

// 1. Context for truly global/app-wide state
const UserContext = createContext(null);
const ThemeContext = createContext('light');

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 2. Component composition to avoid prop drilling
function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Layout>
          <Header>
            <Navigation />
            <ThemeToggle />
          </Header>
          <Main>
            <Sidebar />
            <Content />
          </Main>
        </Layout>
      </ThemeProvider>
    </UserProvider>
  );
}

// 3. Clean Layout that just provides structure
function Layout({ children }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={\`layout layout--\${theme}\`}>
      {children}
    </div>
  );
}

function Header({ children }) {
  return <header className="header">{children}</header>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

// 4. Components consume what they need directly
function Navigation() {
  const { user } = useContext(UserContext);
  return (
    <nav>
      {user ? (
        <span>Welcome, {user.name}</span>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function Sidebar() {
  const { user } = useContext(UserContext);
  return (
    <aside className="sidebar">
      {user && <UserProfile user={user} />}
    </aside>
  );
}

// 5. State co-location for local needs
function Content() {
  // Notifications are local to Content - no need to drill from App
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Load notifications specific to this component
    loadNotifications().then(setNotifications);
  }, []);

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="content">
      <NotificationList 
        notifications={notifications}
        onDismiss={handleDismiss}
      />
      <MainContent />
    </div>
  );
}

// 6. Custom hook for shared stateful logic
function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  }, []);
  
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  return { notifications, addNotification, dismissNotification };
}

// Usage of custom hook where needed
function AnotherComponent() {
  const { notifications, addNotification, dismissNotification } = useNotifications();
  
  return (
    <div>
      <button onClick={() => addNotification({ message: 'Hello!' })}>
        Add Notification
      </button>
      <NotificationList notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}`,
          },
        },
      },
    ],
    bestPractices: [
      'Use component composition (children prop) before reaching for Context',
      "Co-locate state as close as possible to where it's used",
      'Use Context sparingly - only for truly global state',
      'Split contexts by concern to avoid unnecessary re-renders',
      'Consider custom hooks for shared stateful logic',
      'Use render props or compound components for flexible APIs',
      'Memoize context values to prevent unnecessary re-renders',
    ],
    commonMistakes: [
      'Using Context for all shared state instead of composition',
      'Creating monolithic contexts that cause widespread re-renders',
      "Not co-locating state close to where it's actually needed",
      'Over-engineering simple prop passing with complex patterns',
      'Forgetting to memoize context values',
      'Using prop drilling for truly global state like user authentication',
      'Not considering component composition as a solution',
    ],
    relatedPatterns: ['compound-component', 'render-props', 'container-presentational'],
  },
};
