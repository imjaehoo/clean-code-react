import type { PatternDefinition } from '../types/index.js';

export const compoundComponentPattern: PatternDefinition = {
  overview: {
    name: 'Compound Component Pattern',
    description:
      'A sophisticated React pattern that creates a family of components that work together to form a complete UI pattern, using React Context to implicitly share state and behavior. This pattern allows for highly flexible and intuitive APIs where child components can be composed in any order while maintaining their interconnected functionality.',
    whenToUse:
      'Use when building complex UI components like modals, accordions, tabs, or dropdowns that have multiple interconnected parts, when you want to provide maximum flexibility in how components are arranged and styled, when building reusable component libraries that need to work across different design systems, when you need to avoid prop drilling through multiple levels of components, or when you want to create APIs that feel natural and declarative like HTML elements.',
  },
  detailed: {
    name: 'Compound Component Pattern',
    description: 'Create a set of components that work together to form a complete UI pattern.',
    problem: 'Building flexible, composable APIs for complex components with multiple parts.',
    solution: 'Use React context to implicitly share state between parent and child components.',
    benefits: [
      'Flexible and expressive API',
      'Clear component relationships',
      'Extensible design',
      'Separation of concerns',
      'Easy to understand component structure',
    ],
    drawbacks: [
      'More complex to implement',
      'Can be overkill for simple components',
      'Requires understanding of React context',
      'Harder to enforce proper usage',
    ],
    examples: [
      {
        title: '❌ BAD: Tightly Coupled Accordion',
        description: 'Accordion with hardcoded structure and poor reusability',
        code: `// ❌ BAD: Monolithic component with hardcoded structure
function BadAccordion({ items }) {
  const [openItems, setOpenItems] = useState(new Set());
  
  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          {/* Header is hardcoded - no flexibility */}
          <button
            className="accordion-header"
            onClick={() => toggleItem(index)}
          >
            {item.title}
            <span>▼</span>
          </button>
          
          {/* Panel structure is fixed */}
          <div className={\`accordion-panel \${openItems.has(index) ? 'open' : 'closed'}\`}>
            <div className="accordion-content">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Usage - very limited, can only pass title and content strings
function App() {
  const items = [
    { title: 'Section 1', content: 'Content 1' },
    { title: 'Section 2', content: 'Content 2' }
  ];
  
  return <BadAccordion items={items} />;
}

// Problems:
// - Can't customize header appearance
// - Can't add custom content like icons, buttons
// - Can't control individual item behavior
// - Can't nest other components easily
// - Hard to extend with new features`,
      },
      {
        title: '✅ GOOD: Flexible Compound Component',
        description: 'Accordion using compound component pattern for maximum flexibility',
        code: `// ✅ GOOD: Flexible compound component pattern
const AccordionContext = createContext();

function Accordion({ children, defaultOpen = [], allowMultiple = true }) {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));
  
  const toggleItem = (id) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  return <div className="accordion-item">{children}</div>;
}

function AccordionHeader({ id, children, className = '' }) {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const isOpen = openItems.has(id);
  
  return (
    <button
      className={\`accordion-header \${className}\`}
      onClick={() => toggleItem(id)}
      aria-expanded={isOpen}
    >
      {children}
      <span className={isOpen ? 'expanded' : 'collapsed'}>▼</span>
    </button>
  );
}

function AccordionPanel({ id, children }) {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(id);
  
  return (
    <div className={\`accordion-panel \${isOpen ? 'open' : 'closed'}\`}>
      {isOpen && children}
    </div>
  );
}

// Attach compound components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

// Usage - Much more flexible!
function App() {
  return (
    <Accordion defaultOpen={['section1']} allowMultiple={false}>
      <Accordion.Item id="section1">
        <Accordion.Header id="section1" className="primary-header">
          <Icon name="user" />
          User Settings
          <Badge count={3} />
        </Accordion.Header>
        <Accordion.Panel id="section1">
          <UserSettingsForm />
          <div className="footer">
            <Button variant="primary">Save</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
      
      <Accordion.Item id="section2">
        <Accordion.Header id="section2">
          <Icon name="notification" />
          Notifications
        </Accordion.Header>
        <Accordion.Panel id="section2">
          <NotificationsList />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

// Benefits:
// - Complete control over content structure
// - Can add any components inside headers/panels
// - Easy to extend with new features
// - Flexible styling options
// - Clear component relationships`,
      },
    ],
    bestPractices: [
      'Use React context for implicit communication',
      'Provide good default behavior',
      'Include proper TypeScript types',
      'Consider using React.cloneElement for props injection',
      'Document the expected component structure',
    ],
    commonMistakes: [
      'Making the API too flexible and confusing',
      'Not validating component structure',
      'Forgetting to provide context',
      'Not handling edge cases gracefully',
      'Poor error messages for incorrect usage',
    ],
    relatedPatterns: ['render-props', 'higher-order-component'],
  },
};
