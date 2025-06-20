/**
 * Creates a typed wrapper for MCP tool handlers that provides type safety
 * while maintaining compatibility with the MCP SDK's unknown boundary.
 */
export function createTypedHandler<TArgs, TResult>(
  handler: (args: TArgs) => Promise<TResult>,
): (args: unknown) => Promise<unknown> {
  return async (args: unknown): Promise<unknown> => {
    try {
      // Cast args at the boundary - runtime validation could be added here
      const typedArgs = args as TArgs;
      return await handler(typedArgs);
    } catch (error) {
      // Re-throw with better error context
      if (error instanceof Error) {
        throw new Error(`Handler execution failed: ${error.message}`);
      }
      throw new Error('Handler execution failed with unknown error');
    }
  };
}

/**
 * Validates that args is an object (not null, array, etc.)
 */
export function validateArgsObject(args: unknown): args is Record<string, unknown> {
  return typeof args === 'object' && args !== null && !Array.isArray(args);
}

/**
 * Creates a typed handler with basic args validation
 */
export function createValidatedHandler<TArgs extends Record<string, unknown>, TResult>(
  handler: (args: TArgs) => Promise<TResult>,
): (args: unknown) => Promise<unknown> {
  return async (args: unknown): Promise<unknown> => {
    if (!validateArgsObject(args)) {
      throw new Error('Invalid arguments: expected object');
    }

    try {
      const typedArgs = args as TArgs;
      return await handler(typedArgs);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Handler execution failed: ${error.message}`);
      }
      throw new Error('Handler execution failed with unknown error');
    }
  };
}
