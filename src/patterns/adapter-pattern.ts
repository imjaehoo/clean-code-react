import type { PatternDefinition } from '../types/index.js';

export const adapterPattern: PatternDefinition = {
  overview: {
    name: 'Adapter Pattern',
    description:
      'A structural design pattern that creates a unified interface for working with external systems, APIs, or legacy code that have incompatible interfaces. Adapters translate between different data formats, method signatures, and protocols, allowing your application to work seamlessly with external services without tight coupling.',
    whenToUse:
      'Use when integrating with third-party APIs that have different data structures than your application expects, when you need to support multiple payment providers, authentication systems, or data sources with different interfaces, when migrating from legacy systems while maintaining backward compatibility, when you want to insulate your application from changes in external APIs, or when building applications that need to work with multiple versions of the same external service.',
  },
  detailed: {
    name: 'Adapter Pattern',
    description:
      'Create adapters to transform external API responses or integrate with third-party services, providing a consistent interface.',
    problem:
      "External APIs return data in formats that don't match your application's needs, or you need to integrate multiple services with different interfaces.",
    solution:
      "Create adapter classes that transform external data formats into your application's expected format and provide a unified interface.",
    benefits: [
      'Consistent data format across the app',
      'Easy to switch between different services',
      'Isolates external API changes',
      'Simplifies testing with mock adapters',
      'Better type safety',
      'Can handle API versioning',
    ],
    drawbacks: [
      'Additional code to maintain',
      'Can hide API capabilities',
      'May need updates when APIs change',
      'Performance overhead for transformations',
    ],
    examples: [
      {
        title: 'Payment Provider Integration',
        description: 'Comparing direct API coupling vs unified adapter interface',
        comparison: {
          bad: {
            title: 'Direct External API Coupling',
            description:
              'Component directly handles different API formats leading to tight coupling',
            code: `// ❌ BAD: Component directly handles different API formats
function PaymentProcessor({ provider, amount, currency }: PaymentProps) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      if (provider === 'stripe') {
        // Stripe-specific implementation
        const stripe = new Stripe(process.env.STRIPE_KEY!);
        const charge = await stripe.charges.create({
          amount: amount * 100, // Stripe uses cents
          currency,
          source: 'tok_visa',
        });
        
        // Handle Stripe response format
        setResult({
          id: charge.id,
          status: charge.status === 'succeeded' ? 'success' : 'failed',
          amount: charge.amount / 100,
          currency: charge.currency,
        });
        
      } else if (provider === 'paypal') {
        // PayPal-specific implementation
        const paypal = new PayPalClient({
          clientId: process.env.PAYPAL_CLIENT_ID!,
          clientSecret: process.env.PAYPAL_SECRET!
        });
        
        const order = await paypal.orders.create({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: currency,
              value: amount.toString(), // PayPal uses strings
            },
          }],
        });
        
        const capture = await paypal.orders.capture(order.id);
        
        // Handle PayPal response format (completely different!)
        setResult({
          id: capture.id,
          status: capture.status === 'COMPLETED' ? 'success' : 'failed',
          amount: parseFloat(capture.purchase_units[0].amount.value),
          currency: capture.purchase_units[0].amount.currency_code,
        });
        
      } else if (provider === 'square') {
        // Square-specific implementation (yet another format!)
        const square = new SquareClient({
          accessToken: process.env.SQUARE_TOKEN!,
          environment: 'sandbox'
        });
        
        const payment = await square.payments.create({
          source_id: 'cnon:card-nonce-ok',
          amount_money: {
            amount: amount * 100, // Square also uses cents
            currency: currency.toUpperCase(),
          },
          idempotency_key: uuidv4(),
        });
        
        // Handle Square response format (different again!)
        setResult({
          id: payment.payment!.id,
          status: payment.payment!.status === 'COMPLETED' ? 'success' : 'failed',
          amount: payment.payment!.amount_money!.amount! / 100,
          currency: payment.payment!.amount_money!.currency!.toLowerCase(),
        });
      }
      
    } catch (error) {
      // Different providers throw different error formats too
      let errorMessage = 'Payment failed';
      
      if (provider === 'stripe' && error.type === 'StripeCardError') {
        errorMessage = error.message;
      } else if (provider === 'paypal' && error.details) {
        errorMessage = error.details[0].description;
      } else if (provider === 'square' && error.errors) {
        errorMessage = error.errors[0].detail;
      }
      
      setResult({ status: 'failed', error: errorMessage });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div>
      <button onClick={handlePayment} disabled={processing}>
        {processing ? 'Processing...' : \`Pay \${amount} \${currency.toUpperCase()}\`}
      </button>
      
      {result && (
        <div>
          Status: {result.status}
          {result.error && <p>Error: {result.error}</p>}
        </div>
      )}
    </div>
  );
}

// Problems:
// - Component is tightly coupled to all payment providers
// - Adding new providers requires modifying the component
// - Different APIs have different data formats and error handling
// - Business logic is mixed with integration details
// - Very difficult to test individual provider integrations
// - Code becomes unmanageable as more providers are added`,
          },
          good: {
            title: 'Adapter Pattern for Unified Interface',
            description: 'Adapters provide consistent interface across different payment providers',
            code: `// ✅ GOOD: Define consistent interface for all payment providers
interface PaymentProvider {
  charge(amount: number, currency: string, source: string): Promise<PaymentResult>;
  refund(chargeId: string, amount?: number): Promise<RefundResult>;
  getTransaction(id: string): Promise<Transaction>;
}

interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed' | 'pending';
  amount: number;
  currency: string;
  errorMessage?: string;
}

interface RefundResult {
  id: string;
  status: 'completed' | 'failed' | 'pending';
  amount: number;
}

// Stripe adapter - handles Stripe-specific format
class StripeAdapter implements PaymentProvider {
  private stripe: Stripe;
  
  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey);
  }
  
  async charge(amount: number, currency: string, source: string): Promise<PaymentResult> {
    try {
      const charge = await this.stripe.charges.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        source,
      });
      
      return {
        id: charge.id,
        status: this.mapStripeStatus(charge.status),
        amount: charge.amount / 100, // Convert back from cents
        currency: charge.currency.toUpperCase(),
      };
    } catch (error) {
      return {
        id: '',
        status: 'failed',
        amount,
        currency,
        errorMessage: this.extractStripeError(error),
      };
    }
  }
  
  async refund(chargeId: string, amount?: number): Promise<RefundResult> {
    const refund = await this.stripe.refunds.create({
      charge: chargeId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });
    
    return {
      id: refund.id,
      status: refund.status === 'succeeded' ? 'completed' : 'failed',
      amount: refund.amount / 100,
    };
  }
  
  async getTransaction(id: string): Promise<Transaction> {
    const charge = await this.stripe.charges.retrieve(id);
    return {
      id: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency.toUpperCase(),
      status: this.mapStripeStatus(charge.status),
      createdAt: new Date(charge.created * 1000),
      metadata: charge.metadata,
    };
  }
  
  private mapStripeStatus(status: string): PaymentResult['status'] {
    switch (status) {
      case 'succeeded': return 'succeeded';
      case 'pending': return 'pending';
      default: return 'failed';
    }
  }
  
  private extractStripeError(error: any): string {
    return error.message || 'Stripe payment failed';
  }
}

// PayPal adapter - handles PayPal-specific format
class PayPalAdapter implements PaymentProvider {
  private paypal: PayPalClient;
  
  constructor(clientId: string, clientSecret: string) {
    this.paypal = new PayPalClient({ clientId, clientSecret });
  }
  
  async charge(amount: number, currency: string, source: string): Promise<PaymentResult> {
    try {
      const order = await this.paypal.orders.create({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2), // PayPal wants string with 2 decimals
          },
        }],
      });
      
      const capture = await this.paypal.orders.capture(order.id);
      
      return {
        id: capture.id,
        status: this.mapPayPalStatus(capture.status),
        amount: parseFloat(capture.purchase_units[0].amount.value),
        currency: capture.purchase_units[0].amount.currency_code,
      };
    } catch (error) {
      return {
        id: '',
        status: 'failed',
        amount,
        currency,
        errorMessage: this.extractPayPalError(error),
      };
    }
  }
  
  async refund(chargeId: string, amount?: number): Promise<RefundResult> {
    const refund = await this.paypal.payments.refund(chargeId, {
      amount: amount ? { 
        value: amount.toFixed(2),
        currency_code: 'USD' 
      } : undefined,
    });
    
    return {
      id: refund.id,
      status: 'completed',
      amount: parseFloat(refund.amount.value),
    };
  }
  
  async getTransaction(id: string): Promise<Transaction> {
    const order = await this.paypal.orders.get(id);
    return {
      id: order.id,
      amount: parseFloat(order.purchase_units[0].amount.value),
      currency: order.purchase_units[0].amount.currency_code,
      status: this.mapPayPalStatus(order.status),
      createdAt: new Date(order.create_time),
      metadata: {},
    };
  }
  
  private mapPayPalStatus(status: string): PaymentResult['status'] {
    switch (status) {
      case 'COMPLETED': return 'succeeded';
      case 'APPROVED': return 'pending';
      default: return 'failed';
    }
  }
  
  private extractPayPalError(error: any): string {
    if (error.details && error.details.length > 0) {
      return error.details[0].description;
    }
    return 'PayPal payment failed';
  }
}

// Component now works with any payment provider through the adapter
function PaymentProcessor({ provider, amount, currency }: PaymentProps) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  
  // Factory creates appropriate adapter
  const getPaymentProvider = (): PaymentProvider => {
    switch (provider) {
      case 'stripe':
        return new StripeAdapter(process.env.STRIPE_KEY!);
      case 'paypal':
        return new PayPalAdapter(
          process.env.PAYPAL_CLIENT_ID!,
          process.env.PAYPAL_SECRET!
        );
      default:
        throw new Error(\`Unsupported payment provider: \${provider}\`);
    }
  };
  
  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const paymentProvider = getPaymentProvider();
      const paymentResult = await paymentProvider.charge(amount, currency, 'tok_visa');
      setResult(paymentResult);
      
      if (paymentResult.status === 'succeeded') {
        // Handle success - same logic for all providers
        await saveTransaction(paymentResult);
        showSuccessMessage(\`Payment of \${paymentResult.amount} \${paymentResult.currency} completed!\`);
      } else {
        // Handle failure - same logic for all providers
        showErrorMessage(paymentResult.errorMessage || 'Payment failed');
      }
      
    } catch (error) {
      setResult({
        id: '',
        status: 'failed',
        amount,
        currency,
        errorMessage: 'Unexpected error occurred'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div>
      <button onClick={handlePayment} disabled={processing}>
        {processing ? 'Processing...' : \`Pay \${amount} \${currency.toUpperCase()}\`}
      </button>
      
      {result && (
        <div>
          <p>Status: {result.status}</p>
          {result.status === 'succeeded' && (
            <p>Transaction ID: {result.id}</p>
          )}
          {result.errorMessage && (
            <p style={{ color: 'red' }}>Error: {result.errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Benefits:
// - Component doesn't know about provider-specific implementations
// - Easy to add new payment providers without changing component
// - Consistent error handling across all providers
// - Each adapter handles its provider's specific quirks
// - Much easier to test individual adapters in isolation`,
          },
        },
      },
      {
        title: 'API Response Transformation',
        description:
          'Comparing direct API usage vs adapter pattern for normalizing different external API formats',
        comparison: {
          bad: {
            title: 'Direct API Usage with Format Handling',
            description:
              'Components directly handle different API response formats causing code duplication and maintenance issues',
            code: `// ❌ BAD: Components directly handle different API formats
function UserProfile({ provider, username }: { 
  provider: 'github' | 'gitlab';
  username: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let userData;
        
        if (provider === 'github') {
          // Direct GitHub API call
          const response = await fetch(\`https://api.github.com/users/\${username}\`);
          const githubUser = await response.json();
          
          // Manual transformation inline
          userData = {
            id: \`github-\${githubUser.id}\`,
            username: githubUser.login,
            displayName: githubUser.name || githubUser.login,
            avatarUrl: githubUser.avatar_url,
            profileUrl: githubUser.html_url,
            email: githubUser.email,
            bio: githubUser.bio,
            location: githubUser.location,
            company: githubUser.company,
            website: githubUser.blog ? (githubUser.blog.startsWith('http') ? githubUser.blog : \`https://\${githubUser.blog}\`) : null,
            repositories: githubUser.public_repos,
            followers: githubUser.followers,
            following: githubUser.following,
            joinedAt: new Date(githubUser.created_at),
          };
          
        } else if (provider === 'gitlab') {
          // Direct GitLab API call
          const response = await fetch(\`https://gitlab.com/api/v4/users?username=\${username}\`);
          const users = await response.json();
          
          if (users.length === 0) {
            throw new Error('User not found');
          }
          
          const gitlabUser = users[0];
          
          // Manual transformation inline (different format!)
          userData = {
            id: \`gitlab-\${gitlabUser.id}\`,
            username: gitlabUser.username,
            displayName: gitlabUser.name,
            avatarUrl: gitlabUser.avatar_url,
            profileUrl: gitlabUser.web_url,
            email: gitlabUser.public_email || null,
            bio: gitlabUser.bio || null,
            location: gitlabUser.location || null,
            company: gitlabUser.organization || null,
            website: gitlabUser.website_url || null,
            repositories: 0, // GitLab doesn't provide this easily
            followers: gitlabUser.followers || 0,
            following: gitlabUser.following || 0,
            joinedAt: new Date(gitlabUser.created_at),
          };
        }
        
        setUser(userData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [provider, username]);
  
  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div className="user-profile">
      <img src={user.avatarUrl} alt={user.displayName} />
      <h1>{user.displayName}</h1>
      <p>@{user.username}</p>
      {user.bio && <p>{user.bio}</p>}
      {user.location && <p>📍 {user.location}</p>}
      {user.company && <p>🏢 {user.company}</p>}
      {user.website && (
        <p>🔗 <a href={user.website}>{user.website}</a></p>
      )}
      
      <div className="stats">
        <span>Repositories: {user.repositories}</span>
        <span>Followers: {user.followers}</span>
        <span>Following: {user.following}</span>
      </div>
      
      <p>Joined: {user.joinedAt.toLocaleDateString()}</p>
    </div>
  );
}

// Problems:
// - Transformation logic is scattered throughout components
// - Code duplication when multiple components need same API data
// - Hard to maintain when API formats change
// - No consistent error handling across different APIs
// - Difficult to test API integration separately from UI
// - Adding new APIs requires updating all consuming components`,
          },
          good: {
            title: 'API Response Transformation Adapter',
            description:
              'Adapters normalize different external API response formats into consistent internal format',
            code: `// ✅ GOOD: Different external APIs, unified internal format
interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
  email: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  website: string | null;
  stats: {
    repositories: number;
    followers: number;
    following: number;
  };
  joinedAt: Date;
}

// GitHub API returns this format
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

// GitLab API returns this completely different format
interface GitLabUser {
  username: string;
  id: number;
  avatar_url: string;
  web_url: string;
  name: string;
  organization: string;
  website_url: string;
  location: string;
  public_email: string;
  bio: string;
  created_at: string;
  followers: number;
  following: number;
}

// Common interface for user providers
interface UserProvider {
  getUser(username: string): Promise<User>;
  searchUsers(query: string): Promise<User[]>;
}

// GitHub adapter transforms GitHub API to our format
class GitHubUserAdapter implements UserProvider {
  private apiUrl = 'https://api.github.com';
  
  async getUser(username: string): Promise<User> {
    const response = await fetch(\`\${this.apiUrl}/users/\${username}\`);
    
    if (!response.ok) {
      throw new Error(\`GitHub user not found: \${username}\`);
    }
    
    const githubUser: GitHubUser = await response.json();
    return this.transformGitHubUser(githubUser);
  }
  
  async searchUsers(query: string): Promise<User[]> {
    const response = await fetch(\`\${this.apiUrl}/search/users?q=\${query}\`);
    const data = await response.json();
    
    return data.items.map((user: GitHubUser) => this.transformGitHubUser(user));
  }
  
  private transformGitHubUser(githubUser: GitHubUser): User {
    return {
      id: \`github-\${githubUser.id}\`,
      username: githubUser.login,
      displayName: githubUser.name || githubUser.login,
      avatarUrl: githubUser.avatar_url,
      profileUrl: githubUser.html_url,
      email: githubUser.email,
      bio: githubUser.bio,
      location: githubUser.location,
      company: githubUser.company,
      website: this.normalizeUrl(githubUser.blog),
      stats: {
        repositories: githubUser.public_repos,
        followers: githubUser.followers,
        following: githubUser.following,
      },
      joinedAt: new Date(githubUser.created_at),
    };
  }
  
  private normalizeUrl(url: string): string | null {
    if (!url) return null;
    return url.startsWith('http') ? url : \`https://\${url}\`;
  }
}

// GitLab adapter transforms GitLab API to our format
class GitLabUserAdapter implements UserProvider {
  private apiUrl = 'https://gitlab.com/api/v4';
  
  async getUser(username: string): Promise<User> {
    const response = await fetch(\`\${this.apiUrl}/users?username=\${username}\`);
    const users: GitLabUser[] = await response.json();
    
    if (users.length === 0) {
      throw new Error(\`GitLab user not found: \${username}\`);
    }
    
    return this.transformGitLabUser(users[0]);
  }
  
  async searchUsers(query: string): Promise<User[]> {
    const response = await fetch(\`\${this.apiUrl}/users?search=\${query}\`);
    const users: GitLabUser[] = await response.json();
    
    return users.map(user => this.transformGitLabUser(user));
  }
  
  private transformGitLabUser(gitlabUser: GitLabUser): User {
    return {
      id: \`gitlab-\${gitlabUser.id}\`,
      username: gitlabUser.username,
      displayName: gitlabUser.name,
      avatarUrl: gitlabUser.avatar_url,
      profileUrl: gitlabUser.web_url,
      email: gitlabUser.public_email || null,
      bio: gitlabUser.bio || null,
      location: gitlabUser.location || null,
      company: gitlabUser.organization || null,
      website: gitlabUser.website_url || null,
      stats: {
        repositories: 0, // GitLab doesn't provide this in user endpoint
        followers: gitlabUser.followers || 0,
        following: gitlabUser.following || 0,
      },
      joinedAt: new Date(gitlabUser.created_at),
    };
  }
}

// Factory to create appropriate adapter
class UserProviderFactory {
  static create(provider: 'github' | 'gitlab'): UserProvider {
    switch (provider) {
      case 'github':
        return new GitHubUserAdapter();
      case 'gitlab':
        return new GitLabUserAdapter();
      default:
        throw new Error(\`Unknown provider: \${provider}\`);
    }
  }
}

// Component works with any provider through adapters
function UserProfile({ provider, username }: { 
  provider: 'github' | 'gitlab';
  username: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userProvider = UserProviderFactory.create(provider);
        const userData = await userProvider.getUser(username);
        setUser(userData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [provider, username]);
  
  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;
  
  // Same JSX works for users from any provider!
  return (
    <div className="user-profile">
      <img src={user.avatarUrl} alt={user.displayName} />
      <h1>{user.displayName}</h1>
      <p>@{user.username}</p>
      {user.bio && <p>{user.bio}</p>}
      {user.location && <p>📍 {user.location}</p>}
      {user.company && <p>🏢 {user.company}</p>}
      {user.website && (
        <p>🔗 <a href={user.website}>{user.website}</a></p>
      )}
      
      <div className="stats">
        <span>Repositories: {user.stats.repositories}</span>
        <span>Followers: {user.stats.followers}</span>
        <span>Following: {user.stats.following}</span>
      </div>
      
      <p>Joined: {user.joinedAt.toLocaleDateString()}</p>
    </div>
  );
}

// Benefits:
// - Consistent data format across the app
// - Easy to switch between different services
// - Centralized transformation logic
// - Clean separation of concerns
// - Testable adapters in isolation
// - Component doesn't need to know about API specifics`,
          },
        },
      },
    ],
    bestPractices: [
      'Define clear interfaces for your domain models',
      'Keep adapters focused on data transformation',
      'Handle API errors gracefully',
      'Use TypeScript for better type safety',
      'Consider caching transformed data',
      'Document mapping decisions',
      'Test adapters thoroughly with mock data',
    ],
    commonMistakes: [
      'Leaking external API details through the adapter',
      'Not handling missing or null fields',
      'Over-complicating simple transformations',
      'Forgetting to handle API errors',
      'Tight coupling between adapter and UI',
      'Not versioning adapters when APIs change',
    ],
    relatedPatterns: ['service-layer', 'dependency-injection'],
  },
};
