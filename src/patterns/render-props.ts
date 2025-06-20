import type { PatternDefinition } from '../types/index.js';

export const renderPropsPattern: PatternDefinition = {
  overview: {
    name: 'Render Props Pattern',
    description:
      'A powerful React pattern that enables code sharing between components by using a prop whose value is a function that returns React elements. This pattern provides maximum flexibility by allowing the consuming component to control what gets rendered while the render prop component handles all the stateful logic and behavior.',
    whenToUse:
      'Use when you need to share complex stateful logic (like data fetching, mouse tracking, or form handling) across multiple components but want consumers to have complete control over the UI, when building reusable library components that need to work with any UI design, when you have logic that needs to work with multiple different rendering strategies, or when you want to avoid the limitations of higher-order components while maintaining composability and avoiding prop drilling.',
  },
  detailed: {
    name: 'Render Props Pattern',
    description:
      'Share code between components using a prop whose value is a function that returns a React element.',
    problem:
      'Components need to share stateful logic but composition with traditional props is insufficient.',
    solution:
      'Use a prop whose value is a function that returns JSX, allowing the consuming component to control rendering.',
    benefits: [
      'Highly flexible and reusable',
      'Inversion of control over rendering',
      'Easy to compose multiple behaviors',
      'Clear data flow',
      'Framework agnostic pattern',
    ],
    drawbacks: [
      'Can be harder to understand for beginners',
      'Callback hell with multiple render props',
      'Performance considerations with inline functions',
      'More verbose than custom hooks',
    ],
    examples: [
      {
        title: 'Bad: Tight Coupling',
        description: 'Component tightly coupled to specific UI implementation',
        code: `// ❌ BAD: MouseTracker is tied to specific rendering
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Fixed UI - can't reuse logic for different rendering
  return <h1>Mouse position: {position.x}, {position.y}</h1>;
}

// ❌ BAD: Need separate component for different UI
function MouseFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Duplicated logic!
  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      🐭
    </div>
  );
}`,
      },
      {
        title: 'Good: Flexible with Render Props',
        description: 'Reusable logic with flexible rendering through render props',
        code: `// ✅ GOOD: Mouse component with render prop
function Mouse({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return children(position);
}

// ✅ GOOD: Same logic, different UIs
function App() {
  return (
    <div>
      {/* Text display */}
      <Mouse>
        {({ x, y }) => (
          <h1>Mouse position: {x}, {y}</h1>
        )}
      </Mouse>
      
      {/* Visual follower */}
      <Mouse>
        {({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
            }}
          >
            🐭
          </div>
        )}
      </Mouse>
      
      {/* Custom visualization */}
      <Mouse>
        {({ x, y }) => (
          <canvas
            width={400}
            height={300}
            style={{ border: '1px solid black' }}
            ref={(canvas) => {
              if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 400, 300);
                ctx.fillStyle = 'red';
                ctx.fillRect(x % 400, y % 300, 10, 10);
              }
            }}
          />
        )}
      </Mouse>
    </div>
  );
}`,
      },
    ],
    bestPractices: [
      'Consider custom hooks for simpler cases',
      'Use children as a function for common render prop patterns',
      'Memoize render prop functions to avoid unnecessary re-renders',
      'Provide good TypeScript types for render prop parameters',
      'Keep render prop components focused on single responsibility',
    ],
    commonMistakes: [
      'Creating new functions on every render (use useCallback)',
      'Making render prop components too complex',
      'Not handling loading and error states properly',
      'Overusing render props when simpler patterns would work',
      'Poor naming - render prop should describe what it provides',
    ],
    relatedPatterns: ['higher-order-component', 'compound-component'],
  },
};
