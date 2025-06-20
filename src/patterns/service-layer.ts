import type { PatternDefinition } from '../types/index.js';

export const serviceLayerPattern: PatternDefinition = {
  overview: {
    name: 'Service Layer Pattern',
    description:
      'An architectural pattern that encapsulates business logic, API communications, and data transformations into dedicated service modules, creating a clean separation between the presentation layer and business logic. This pattern centralizes complex operations, provides consistent interfaces, and makes applications more maintainable and testable.',
    whenToUse:
      'Use when your application has complex business logic that should not live in components, when you need to interact with multiple APIs or data sources, when you want to centralize error handling and caching strategies, when building applications that need to work offline or sync data, when you have data transformation logic that is reused across multiple components, or when you need to implement complex validation, authentication, or authorization logic.',
  },
  detailed: {
    name: 'Service Layer Pattern',
    description:
      'Abstracts API calls and business logic into separate service modules, keeping components focused on UI.',
    problem:
      'Components become cluttered with API calls, data transformation logic, and business rules, making them hard to test and maintain.',
    solution:
      'Extract all API interactions and business logic into dedicated service classes or modules that components can consume.',
    benefits: [
      'Clear separation of concerns',
      'Easier to test business logic in isolation',
      'Reusable across multiple components',
      'Centralized error handling',
      'Easier to mock for testing',
      'Can switch API implementations easily',
    ],
    drawbacks: [
      'Additional abstraction layer',
      'Can lead to over-engineering',
      'May duplicate some logic from backend',
      'Need to maintain service interfaces',
    ],
    examples: [
      {
        title: '❌ BAD: Business Logic Mixed with UI',
        description: 'Components handling API calls and business logic directly',
        code: `// ❌ BAD: Component doing everything - API calls, data transformation, business logic
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // API calls directly in component
  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then(users => {
        // Business logic mixed in component
        const activeUsers = users.filter(user => user.status === 'active');
        const sortedUsers = activeUsers.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  // Complex business logic in component
  const handleInvite = async (email: string) => {
    try {
      // Validation logic in component
      if (!email || !email.includes('@')) {
        toast.error('Invalid email address');
        return;
      }
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        toast.error('User already exists');
        return;
      }
      
      // API call with complex payload construction
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: 'user',
          invitedBy: getCurrentUser().id,
          invitedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      // More business logic after API call
      const result = await response.json();
      toast.success(\`Invitation sent to \${email}\`);
      
      // Manually update state
      setUsers(prev => [...prev, { ...result.user, status: 'pending' }]);
      
      // Analytics tracking mixed in
      analytics.track('user_invited', { email, invitedBy: getCurrentUser().id });
      
    } catch (error) {
      toast.error(\`Failed to invite user: \${error.message}\`);
    }
  };
  
  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate') => {
    try {
      // More business logic in component
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = action === 'activate' ? 'active' : 'inactive';
      const updateData = {
        status: newStatus,
        [\`\${newStatus}At\`]: new Date().toISOString(),
        updatedBy: getCurrentUser().id
      };
      
      // API call
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      // Manual state updates
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, ...updateData } : u)
      );
      
      toast.success(\`User \${action}d successfully\`);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.status}
          <button onClick={() => handleUserAction(user.id, 'activate')}>
            Activate
          </button>
          <button onClick={() => handleUserAction(user.id, 'deactivate')}>
            Deactivate
          </button>
        </div>
      ))}
      <InviteForm onInvite={handleInvite} />
    </div>
  );
}

// Problems:
// - Component is huge and complex
// - Business logic is scattered and hard to test
// - API calls are hardcoded and not reusable
// - Error handling is inconsistent
// - No caching or optimization
// - Hard to maintain and debug`,
      },
      {
        title: '✅ GOOD: Clean Service Layer Separation',
        description: 'Business logic and API calls abstracted into service layer',
        code: `// ✅ GOOD: Service layer handles all business logic and API calls
class UserService {
  private baseUrl = '/api/users';
  private cache = new Map<string, any>();

  async getUsers(filters?: { status?: string; role?: string }): Promise<User[]> {
    const cacheKey = \`users-\${JSON.stringify(filters || {})}\`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const query = this.buildQueryString(filters);
      const response = await fetch(\`\${this.baseUrl}\${query}\`);
      
      if (!response.ok) {
        throw new ApiError('Failed to fetch users', response.status);
      }
      
      const users = await response.json();
      const processedUsers = this.processUsersData(users);
      
      this.cache.set(cacheKey, processedUsers);
      return processedUsers;
    } catch (error) {
      this.handleError('getUsers', error);
      throw error;
    }
  }

  async inviteUser(email: string): Promise<InviteResult> {
    // Business logic centralized in service
    this.validateEmail(email);
    await this.checkUserExists(email);
    
    const inviteData = this.buildInvitePayload(email);
    
    try {
      const response = await fetch(\`\${this.baseUrl}/invite\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new ValidationError(error.message, error.fields);
      }
      
      const result = await response.json();
      
      // Post-processing business logic
      this.trackUserInvitation(email);
      this.invalidateUserCache();
      
      return {
        success: true,
        user: result.user,
        message: \`Invitation sent to \${email}\`
      };
    } catch (error) {
      this.handleError('inviteUser', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<User> {
    try {
      const updateData = this.buildStatusUpdatePayload(status);
      
      const response = await fetch(\`\${this.baseUrl}/\${userId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new ApiError('Failed to update user status', response.status);
      }
      
      const updatedUser = await response.json();
      
      // Business rules after update
      this.invalidateUserCache();
      this.trackUserStatusChange(userId, status);
      
      return updatedUser;
    } catch (error) {
      this.handleError('updateUserStatus', error);
      throw error;
    }
  }

  // Business logic methods
  private validateEmail(email: string): void {
    if (!email || !email.includes('@')) {
      throw new ValidationError('Invalid email address');
    }
  }

  private async checkUserExists(email: string): Promise<void> {
    const users = await this.getUsers();
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      throw new ValidationError('User already exists');
    }
  }

  private buildInvitePayload(email: string) {
    return {
      email,
      role: 'user',
      invitedBy: this.getCurrentUserId(),
      invitedAt: new Date().toISOString(),
      expiresAt: this.getInviteExpirationDate().toISOString()
    };
  }

  private buildStatusUpdatePayload(status: string) {
    return {
      status,
      [\`\${status}At\`]: new Date().toISOString(),
      updatedBy: this.getCurrentUserId()
    };
  }

  private processUsersData(users: User[]): User[] {
    return users
      .filter(user => user.status === 'active')
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  private buildQueryString(filters?: any): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    return params.toString() ? \`?\${params.toString()}\` : '';
  }

  private invalidateUserCache(): void {
    Array.from(this.cache.keys())
      .filter(key => key.startsWith('users-'))
      .forEach(key => this.cache.delete(key));
  }

  private trackUserInvitation(email: string): void {
    analytics.track('user_invited', { 
      email, 
      invitedBy: this.getCurrentUserId() 
    });
  }

  private trackUserStatusChange(userId: string, status: string): void {
    analytics.track('user_status_changed', { userId, status });
  }

  private getCurrentUserId(): string {
    return getCurrentUser().id;
  }

  private getInviteExpirationDate(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  private handleError(method: string, error: unknown): void {
    console.error(\`UserService.\${method} error:\`, error);
    // Could send to error tracking service
  }
}

// Export singleton instance
export const userService = new UserService();

// Component is now clean and focused on UI
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    userService.getUsers({ status: 'active' })
      .then(setUsers)
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);
  
  const handleInvite = async (email: string) => {
    try {
      const result = await userService.inviteUser(email);
      toast.success(result.message);
      
      // Simple state update
      setUsers(prev => [...prev, result.user]);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate') => {
    try {
      const updatedUser = await userService.updateUserStatus(userId, action);
      
      setUsers(prev => 
        prev.map(u => u.id === userId ? updatedUser : u)
      );
      
      toast.success(\`User \${action}d successfully\`);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          onStatusChange={(status) => handleUserAction(user.id, status)}
        />
      ))}
      <InviteForm onInvite={handleInvite} />
    </div>
  );
}

// Benefits:
// - Component is focused only on UI logic
// - Business logic is centralized and testable
// - API calls are abstracted and reusable
// - Consistent error handling
// - Built-in caching and optimization
// - Easy to maintain and extend`,
      },
    ],
    bestPractices: [
      'Keep services focused on a single domain',
      'Use TypeScript for better type safety',
      'Implement proper error handling',
      'Consider caching strategies',
      'Make services stateless when possible',
      'Use dependency injection for testability',
      'Document service methods clearly',
    ],
    commonMistakes: [
      'Putting UI logic in services',
      'Making services too granular or too broad',
      'Not handling errors consistently',
      'Tight coupling between services',
      'Not considering loading and error states',
      'Forgetting to clean up subscriptions',
    ],
    relatedPatterns: ['dependency-injection', 'adapter-pattern'],
  },
};
