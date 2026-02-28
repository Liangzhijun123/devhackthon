/**
 * Property-Based Tests for Authentication Service
 * Tests universal properties that should hold for authentication operations
 */

import fc from 'fast-check';
import { AuthService, AuthError } from '@/services/AuthService';
import { StorageService } from '@/services/StorageService';
import { Plan } from '@/types';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Setup localStorage mock before tests
beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

// Clear storage before each test
beforeEach(() => {
  localStorageMock.clear();
  AuthService.clearAll();
  StorageService.clearAll();
});

// Clear storage after each test
afterEach(() => {
  localStorageMock.clear();
  AuthService.clearAll();
  StorageService.clearAll();
});

// ============================================================================
// Arbitraries (Generators) for Property-Based Testing
// ============================================================================

/**
 * Generate valid Plan values
 */
const planArbitrary = (): fc.Arbitrary<Plan> => {
  return fc.constantFrom<Plan>('basic', 'premium', 'pro');
};

/**
 * Generate valid email addresses
 */
const emailArbitrary = (): fc.Arbitrary<string> => {
  return fc.emailAddress();
};

/**
 * Generate valid passwords (minimum 8 characters with actual content)
 */
const validPasswordArbitrary = (): fc.Arbitrary<string> => {
  return fc.string({ minLength: 8, maxLength: 50 }).filter(s => s.trim().length >= 8);
};

/**
 * Generate invalid passwords (less than 8 characters)
 */
const invalidPasswordArbitrary = (): fc.Arbitrary<string> => {
  return fc.string({ minLength: 0, maxLength: 7 });
};

/**
 * Generate invalid email addresses
 */
const invalidEmailArbitrary = (): fc.Arbitrary<string> => {
  return fc.oneof(
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('@')),
    fc.constant('invalid-email'),
    fc.constant('test@'),
    fc.constant('@example.com'),
    fc.constant('test..test@example.com')
  );
};

// ============================================================================
// Property Tests
// ============================================================================

describe('Authentication Property Tests', () => {
  describe('Property 1: Authentication validates credentials', () => {
    /**
     * **Validates: Requirements 1.1**
     * 
     * For any email and password combination, authentication should succeed
     * if credentials are valid and fail if credentials are invalid.
     * 
     * This property ensures that the authentication system correctly validates
     * user credentials and only grants access to users with correct passwords.
     */
    it('should succeed with correct credentials after signup', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          planArbitrary(),
          async (email, password, plan) => {
            // Sign up a user
            const signupUser = await AuthService.signup(email, password, plan);
            
            // Logout to clear current session
            AuthService.logout();
            
            // Login should succeed with correct credentials
            const loginUser = await AuthService.login(email, password);
            
            // Should return the same user
            expect(loginUser).toBeDefined();
            expect(loginUser.id).toBe(signupUser.id);
            expect(loginUser.email).toBe(email);
            expect(loginUser.plan).toBe(plan);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fail with incorrect password', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          validPasswordArbitrary(),
          planArbitrary(),
          async (email, correctPassword, wrongPassword, plan) => {
            // Skip if passwords are the same
            fc.pre(correctPassword !== wrongPassword);
            
            // Sign up a user
            await AuthService.signup(email, correctPassword, plan);
            
            // Logout to clear current session
            AuthService.logout();
            
            // Login should fail with wrong password
            await expect(
              AuthService.login(email, wrongPassword)
            ).rejects.toThrow(AuthError);
            
            await expect(
              AuthService.login(email, wrongPassword)
            ).rejects.toThrow('Invalid email or password');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fail with non-existent email', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          async (email, password) => {
            // Attempt to login without signing up first
            await expect(
              AuthService.login(email, password)
            ).rejects.toThrow(AuthError);
            
            await expect(
              AuthService.login(email, password)
            ).rejects.toThrow('Invalid email or password');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fail with invalid email format', async () => {
      await fc.assert(
        fc.asyncProperty(
          invalidEmailArbitrary(),
          validPasswordArbitrary(),
          async (invalidEmail, password) => {
            // Login should fail with invalid email format
            await expect(
              AuthService.login(invalidEmail, password)
            ).rejects.toThrow(AuthError);
            
            await expect(
              AuthService.login(invalidEmail, password)
            ).rejects.toThrow('Invalid email or password');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Account creation requires plan selection', () => {
    /**
     * **Validates: Requirements 1.2**
     * 
     * For any account creation attempt, the operation should fail if no plan
     * is specified and succeed if a valid plan (Basic, Premium, or Pro) is
     * provided.
     * 
     * This property ensures that all users must select a subscription plan
     * during account creation, enforcing the business requirement.
     */
    it('should succeed with valid plan selection', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          planArbitrary(),
          async (email, password, plan) => {
            // Signup should succeed with valid plan
            const user = await AuthService.signup(email, password, plan);
            
            // User should be created with the selected plan
            expect(user).toBeDefined();
            expect(user.plan).toBe(plan);
            expect(['basic', 'premium', 'pro']).toContain(user.plan);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fail with invalid plan selection', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          fc.string().filter(s => !['basic', 'premium', 'pro'].includes(s)),
          async (email, password, invalidPlan) => {
            // Signup should fail with invalid plan
            await expect(
              AuthService.signup(email, password, invalidPlan as Plan)
            ).rejects.toThrow(AuthError);
            
            await expect(
              AuthService.signup(email, password, invalidPlan as Plan)
            ).rejects.toThrow('Invalid plan selection');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should require plan for all valid email and password combinations', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          async (email, password) => {
            // Test that each valid plan works
            const plans: Plan[] = ['basic', 'premium', 'pro'];
            
            for (let i = 0; i < plans.length; i++) {
              const plan = plans[i];
              const testEmail = `${i}_${email}`;
              
              // Should succeed with valid plan
              const user = await AuthService.signup(testEmail, password, plan);
              expect(user.plan).toBe(plan);
            }
            
            // Test that invalid plan fails
            const invalidEmail = `invalid_${email}`;
            await expect(
              AuthService.signup(invalidEmail, password, 'invalid' as Plan)
            ).rejects.toThrow('Invalid plan selection');
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 3: Basic plan activates 30-day trial', () => {
    /**
     * **Validates: Requirements 1.3**
     * 
     * For any user who selects Basic plan during signup, the trial end date
     * should be set to exactly 30 days from the account creation date.
     * 
     * This property ensures that Basic plan users receive the correct trial
     * period as specified in the business requirements.
     */
    it('should set trial end date to 30 days for basic plan', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          fc.integer({ min: 0, max: 999999 }), // Add unique suffix
          async (email, password, uniqueId) => {
            // Make email unique for this test run
            const uniqueEmail = `${uniqueId}_${email}`;
            
            const beforeSignup = new Date();
            
            // Sign up with basic plan
            const user = await AuthService.signup(uniqueEmail, password, 'basic');
            
            const afterSignup = new Date();
            
            // Trial end date should be set
            expect(user.trialEndsAt).toBeDefined();
            expect(user.trialEndsAt).not.toBeNull();
            expect(user.trialEndsAt).toBeInstanceOf(Date);
            
            // Calculate expected trial end date (30 days from now)
            const expectedMinEnd = new Date(beforeSignup);
            expectedMinEnd.setDate(expectedMinEnd.getDate() + 30);
            
            const expectedMaxEnd = new Date(afterSignup);
            expectedMaxEnd.setDate(expectedMaxEnd.getDate() + 30);
            
            // Trial end date should be approximately 30 days from now
            // Allow some tolerance for test execution time
            expect(user.trialEndsAt!.getTime()).toBeGreaterThanOrEqual(expectedMinEnd.getTime() - 1000);
            expect(user.trialEndsAt!.getTime()).toBeLessThanOrEqual(expectedMaxEnd.getTime() + 1000);
            
            // Verify it's exactly 30 days (within reasonable tolerance)
            const daysDifference = (user.trialEndsAt!.getTime() - beforeSignup.getTime()) / (1000 * 60 * 60 * 24);
            expect(daysDifference).toBeGreaterThanOrEqual(29.95);
            expect(daysDifference).toBeLessThanOrEqual(30.05);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not set trial end date for premium plan', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          async (email, password) => {
            // Sign up with premium plan
            const user = await AuthService.signup(email, password, 'premium');
            
            // Trial end date should be null
            expect(user.trialEndsAt).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not set trial end date for pro plan', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          async (email, password) => {
            // Sign up with pro plan
            const user = await AuthService.signup(email, password, 'pro');
            
            // Trial end date should be null
            expect(user.trialEndsAt).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should set trial only for basic plan across all valid inputs', async () => {
      await fc.assert(
        fc.asyncProperty(
          emailArbitrary(),
          validPasswordArbitrary(),
          planArbitrary(),
          async (email, password, plan) => {
            // Sign up with the given plan
            const user = await AuthService.signup(email, password, plan);
            
            // Check trial based on plan
            if (plan === 'basic') {
              // Basic plan should have trial
              expect(user.trialEndsAt).not.toBeNull();
              expect(user.trialEndsAt).toBeInstanceOf(Date);
              
              // Should be approximately 30 days from now
              const now = new Date();
              const daysDiff = (user.trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              expect(daysDiff).toBeGreaterThanOrEqual(29.9);
              expect(daysDiff).toBeLessThanOrEqual(30.1);
            } else {
              // Premium and Pro plans should not have trial
              expect(user.trialEndsAt).toBeNull();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain 30-day trial across multiple basic signups', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              email: emailArbitrary(),
              password: validPasswordArbitrary(),
            }),
            { minLength: 2, maxLength: 5 }
          ),
          async (credentials) => {
            // Ensure unique emails
            const uniqueCredentials = credentials.filter(
              (cred, index, self) =>
                self.findIndex((c) => c.email === cred.email) === index
            );

            if (uniqueCredentials.length < 2) return true;

            const beforeSignups = new Date();

            // Sign up multiple users with basic plan
            const users = await Promise.all(
              uniqueCredentials.map(({ email, password }) =>
                AuthService.signup(email, password, 'basic')
              )
            );

            const afterSignups = new Date();

            // All users should have 30-day trial
            users.forEach((user) => {
              expect(user.trialEndsAt).not.toBeNull();
              expect(user.trialEndsAt).toBeInstanceOf(Date);

              // Calculate expected range
              const expectedMinEnd = new Date(beforeSignups);
              expectedMinEnd.setDate(expectedMinEnd.getDate() + 30);

              const expectedMaxEnd = new Date(afterSignups);
              expectedMaxEnd.setDate(expectedMaxEnd.getDate() + 30);

              // Verify 30-day trial
              expect(user.trialEndsAt!.getTime()).toBeGreaterThanOrEqual(expectedMinEnd.getTime() - 1000);
              expect(user.trialEndsAt!.getTime()).toBeLessThanOrEqual(expectedMaxEnd.getTime() + 1000);
            });

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
