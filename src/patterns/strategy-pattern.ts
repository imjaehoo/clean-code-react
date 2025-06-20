import type { PatternDefinition } from '../types/index.js';

export const strategyPattern: PatternDefinition = {
  overview: {
    name: 'Strategy Pattern',
    description:
      'Define a family of algorithms, encapsulate each one, and make them interchangeable to eliminate if-else chains',
    whenToUse:
      'When you have complex if-else chains (3+ branches), multiple algorithms for the same task, need runtime algorithm selection, want to avoid code duplication across similar behaviors, need to add new behaviors without modifying existing code, have conditional logic that violates Open-Closed Principle, or want to make algorithms independently testable and maintainable',
  },
  detailed: {
    name: 'Strategy Pattern',
    description:
      'The Strategy Pattern defines a family of algorithms, encapsulates each one behind a common interface, and makes them interchangeable. This allows the algorithm to vary independently from clients that use it, eliminating complex conditional logic.',
    problem:
      'Complex if-else chains or switch statements make code hard to maintain, test, and extend. Adding new behaviors requires modifying existing code, violating the Open-Closed Principle.',
    solution:
      'Create a common interface for all strategies, implement each algorithm as a separate strategy class, and use a context that delegates to the selected strategy.',
    benefits: [
      'Eliminates complex if-else chains and switch statements',
      'Easy to add new strategies without modifying existing code',
      'Each strategy can be tested independently',
      'Improves code organization and separation of concerns',
      'Runtime strategy selection based on conditions',
      'Follows Open-Closed Principle',
    ],
    drawbacks: [
      'Increases number of classes/objects',
      'Clients must be aware of different strategies',
      'May be overkill for simple conditional logic',
      'Additional abstraction layer',
    ],
    examples: [
      {
        title: 'Bad: Complex If-Else Chain',
        description: 'Payment processing with nested conditionals - hard to maintain and extend',
        code: `// ❌ BAD: Long if-else chain that's hard to maintain
const PaymentForm: React.FC<{ paymentType: string }> = ({ paymentType }) => {
  const [amount, setAmount] = useState(0);
  const [details, setDetails] = useState<PaymentDetails>({});

  const handlePayment = async () => {
    // Validation logic scattered throughout
    if (paymentType === 'credit-card') {
      if (!details.cardNumber || details.cardNumber.length !== 16) {
        alert('Invalid card number');
        return;
      }
      // Credit card processing
      const result = await fetch('/api/payments/credit-card', {
        method: 'POST',
        body: JSON.stringify({ amount, cardNumber: details.cardNumber })
      });
      console.log('CC Payment result:', await result.json());
      
    } else if (paymentType === 'paypal') {
      if (!details.email || !details.email.includes('@')) {
        alert('Invalid email');
        return;
      }
      // PayPal processing
      const result = await fetch('/api/payments/paypal', {
        method: 'POST', 
        body: JSON.stringify({ amount, email: details.email })
      });
      console.log('PayPal result:', await result.json());
      
    } else if (paymentType === 'crypto') {
      if (!details.walletAddress || details.walletAddress.length !== 42) {
        alert('Invalid wallet address');
        return;
      }
      // Crypto processing
      const result = await fetch('/api/payments/crypto', {
        method: 'POST',
        body: JSON.stringify({ amount, wallet: details.walletAddress })
      });
      console.log('Crypto result:', await result.json());
      
    } else if (paymentType === 'bank-transfer') {
      // Adding new payment method requires modifying this function
      if (!details.accountNumber || details.accountNumber.length < 8) {
        alert('Invalid account number');
        return;
      }
      const result = await fetch('/api/payments/bank', {
        method: 'POST',
        body: JSON.stringify({ amount, account: details.accountNumber })
      });
      console.log('Bank result:', await result.json());
    }
    // What happens when we need to add Apple Pay, Google Pay, etc?
  };

  return (
    <div>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(Number(e.target.value))} 
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};`,
      },
      {
        title: 'Good: Strategy Pattern',
        description:
          'Clean strategy pattern eliminates if-else chains and makes adding new payment methods easy',
        code: `// ✅ GOOD: Strategy interface
interface PaymentStrategy {
  processPayment(amount: number): Promise<PaymentResult>;
  validatePayment(details: PaymentDetails): boolean;
}

// ✅ GOOD: Each strategy encapsulates its own logic
class CreditCardStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    const result = await fetch('/api/payments/credit-card', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    return result.json();
  }
  
  validatePayment(details: PaymentDetails): boolean {
    return details.cardNumber?.length === 16;
  }
}

class PayPalStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    const result = await fetch('/api/payments/paypal', {
      method: 'POST', 
      body: JSON.stringify({ amount })
    });
    return result.json();
  }
  
  validatePayment(details: PaymentDetails): boolean {
    return !!details.email?.includes('@');
  }
}

class CryptoStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    const result = await fetch('/api/payments/crypto', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    return result.json();
  }
  
  validatePayment(details: PaymentDetails): boolean {
    return details.walletAddress?.length === 42;
  }
}

// ✅ GOOD: Easy to add new strategies without modifying existing code
class ApplePayStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    const result = await fetch('/api/payments/apple-pay', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    return result.json();
  }
  
  validatePayment(details: PaymentDetails): boolean {
    return !!details.applePayToken;
  }
}

// ✅ GOOD: Clean component with no conditional logic
const PaymentForm: React.FC<{ paymentType: string }> = ({ paymentType }) => {
  const [amount, setAmount] = useState(0);
  const [details, setDetails] = useState<PaymentDetails>({});

  const getPaymentStrategy = (): PaymentStrategy => {
    const strategies: Record<string, PaymentStrategy> = {
      'credit-card': new CreditCardStrategy(),
      'paypal': new PayPalStrategy(),
      'crypto': new CryptoStrategy(),
      'apple-pay': new ApplePayStrategy(), // Easy to add!
    };
    
    return strategies[paymentType] || strategies['credit-card'];
  };

  const handlePayment = async () => {
    const strategy = getPaymentStrategy();
    
    if (!strategy.validatePayment(details)) {
      alert('Invalid payment details');
      return;
    }
    
    const result = await strategy.processPayment(amount);
    console.log('Payment result:', result);
  };

  return (
    <div>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(Number(e.target.value))} 
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};`,
      },
    ],
    bestPractices: [
      'Use strategy pattern when you have 3+ conditional branches',
      'Keep strategy interface focused and cohesive',
      'Consider using factory pattern for strategy creation',
      'Cache strategy instances when possible for performance',
      'Use composition over inheritance for strategy implementation',
      'Provide default strategy to handle unknown cases',
      'Make strategies stateless when possible',
      'Use TypeScript for better strategy interface enforcement',
    ],
    commonMistakes: [
      'Overusing the pattern for simple two-branch conditionals',
      'Creating strategies that are too granular or too broad',
      'Not providing a default strategy for unknown cases',
      'Making strategies stateful when they should be stateless',
      'Coupling strategies too tightly to specific contexts',
      'Not considering performance implications of strategy creation',
      'Forgetting to validate strategy existence before use',
    ],
    relatedPatterns: [
      'factory-pattern',
      'dependency-injection',
      'adapter-pattern',
      'service-layer',
    ],
  },
};
