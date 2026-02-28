/**
 * Property-Based Tests for Storage Service
 * Tests universal properties that should hold across all valid inputs
 */

import fc from 'fast-check';
import { StorageService } from '@/services/StorageService';
import { User, Plan, CompletedSession } from '@/types';

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
 * Generate valid difficulty values
 */
const difficultyArbitrary = (): fc.Arbitrary<'easy' | 'medium' | 'hard'> => {
  return fc.constantFrom<'easy' | 'medium' | 'hard'>('easy', 'medium', 'hard');
};

/**
 * Generate valid rating values (1-5)
 */
const ratingArbitrary = (): fc.Arbitrary<1 | 2 | 3 | 4 | 5> => {
  return fc.constantFrom<1 | 2 | 3 | 4 | 5>(1, 2, 3, 4, 5);
};

/**
 * Generate valid category values
 */
const categoryArbitrary = (): fc.Arbitrary<string> => {
  return fc.constantFrom(
    'arrays',
    'trees',
    'graphs',
    'dynamic-programming',
    'strings',
    'system-design',
    'behavioral'
  );
};

/**
 * Generate valid email addresses
 */
const emailArbitrary = (): fc.Arbitrary<string> => {
  return fc.emailAddress();
};

/**
 * Generate valid user IDs
 */
const userIdArbitrary = (): fc.Arbitrary<string> => {
  return fc.uuid();
};

/**
 * Generate valid dates (within reasonable range)
 */
const dateArbitrary = (): fc.Arbitrary<Date> => {
  return fc.date({
    min: new Date('2020-01-01'),
    max: new Date('2030-12-31'),
  });
};

/**
 * Generate valid User objects
 */
const userArbitrary = (): fc.Arbitrary<User> => {
  return fc.record({
    id: userIdArbitrary(),
    email: emailArbitrary(),
    plan: planArbitrary(),
    createdAt: dateArbitrary(),
    trialEndsAt: fc.option(dateArbitrary(), { nil: null }),
    streak: fc.nat({ max: 365 }), // Reasonable streak limit
    streakFreezeUsed: fc.boolean(),
    lastSessionDate: fc.option(dateArbitrary(), { nil: null }),
  });
};

/**
 * Generate valid CompletedSession objects
 */
const completedSessionArbitrary = (): fc.Arbitrary<import('@/types').CompletedSession> => {
  return fc.record({
    id: fc.uuid(),
    userId: userIdArbitrary(),
    questionId: fc.uuid(),
    questionTitle: fc.string({ minLength: 5, maxLength: 100 }),
    category: categoryArbitrary(),
    difficulty: difficultyArbitrary(),
    startTime: dateArbitrary(),
    endTime: dateArbitrary(),
    duration: fc.integer({ min: 60, max: 2700 }), // 1 minute to 45 minutes in seconds
    rating: ratingArbitrary(),
    perceivedDifficulty: difficultyArbitrary(),
    notes: fc.string({ maxLength: 500 }),
    pressureModeUsed: fc.boolean(),
  });
};

// ============================================================================
// Property Tests
// ============================================================================

describe('Storage Service Property Tests', () => {
  describe('Property 4: Plan persistence round trip', () => {
    /**
     * **Validates: Requirements 1.4**
     * 
     * For any user created with a specific plan, retrieving that user's
     * profile should return the same plan value.
     * 
     * This property ensures that the plan field is correctly persisted
     * and retrieved from storage without corruption or transformation.
     */
    it('should preserve plan value through save and retrieve cycle', () => {
      fc.assert(
        fc.property(userArbitrary(), (user) => {
          // Save the user to storage
          StorageService.saveUser(user);
          
          // Retrieve the user from storage
          const retrievedUser = StorageService.getUser(user.id);
          
          // The retrieved user should exist
          expect(retrievedUser).not.toBeNull();
          
          // The plan should match exactly
          expect(retrievedUser?.plan).toBe(user.plan);
          
          // Additional verification: the plan should be one of the valid values
          expect(['basic', 'premium', 'pro']).toContain(retrievedUser?.plan);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve plan value for multiple users independently', () => {
      fc.assert(
        fc.property(
          fc.array(userArbitrary(), { minLength: 2, maxLength: 10 }),
          (users) => {
            // Ensure unique user IDs
            const uniqueUsers = users.filter(
              (user, index, self) =>
                self.findIndex((u) => u.id === user.id) === index
            );

            // Skip if we don't have at least 2 unique users
            if (uniqueUsers.length < 2) return true;

            // Save all users
            uniqueUsers.forEach((user) => {
              StorageService.saveUser(user);
            });

            // Retrieve and verify each user's plan
            uniqueUsers.forEach((originalUser) => {
              const retrievedUser = StorageService.getUser(originalUser.id);
              expect(retrievedUser).not.toBeNull();
              expect(retrievedUser?.plan).toBe(originalUser.plan);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve plan value after multiple updates', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          emailArbitrary(),
          fc.array(planArbitrary(), { minLength: 1, maxLength: 5 }),
          (userId, email, plans) => {
            let currentUser: User = {
              id: userId,
              email: email,
              plan: plans[0],
              createdAt: new Date(),
              trialEndsAt: null,
              streak: 0,
              streakFreezeUsed: false,
              lastSessionDate: null,
            };

            // Update the user's plan multiple times
            for (const plan of plans) {
              currentUser = { ...currentUser, plan };
              StorageService.saveUser(currentUser);

              // Verify the plan is correctly stored after each update
              const retrievedUser = StorageService.getUser(userId);
              expect(retrievedUser).not.toBeNull();
              expect(retrievedUser?.plan).toBe(plan);
            }

            // Final verification: the last plan should be persisted
            const finalUser = StorageService.getUser(userId);
            expect(finalUser?.plan).toBe(plans[plans.length - 1]);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 16: Completed session storage includes all required fields', () => {
    /**
     * **Validates: Requirements 4.5, 13.1**
     * 
     * For any completed session with submitted feedback, retrieving that
     * session should return all required fields: timestamp, question, rating,
     * difficulty, and notes.
     * 
     * This property ensures that session data is completely persisted and
     * retrieved without any field loss or corruption.
     */
    it('should preserve all required fields through save and retrieve cycle', () => {
      fc.assert(
        fc.property(completedSessionArbitrary(), (session) => {
          // Save the session to storage
          StorageService.saveSession(session);
          
          // Retrieve all sessions for this user
          const retrievedSessions = StorageService.getSessions(session.userId);
          
          // The session should be in the retrieved list
          expect(retrievedSessions.length).toBeGreaterThan(0);
          
          // Find the specific session we saved
          const retrievedSession = retrievedSessions.find(s => s.id === session.id);
          
          // The session should exist
          expect(retrievedSession).toBeDefined();
          
          // Verify all required fields are present and match
          // Requirement 4.5: timestamp, rating, difficulty, and notes
          // Requirement 13.1: timestamp, question, rating, difficulty, and notes
          
          // Timestamp fields (startTime and endTime)
          expect(retrievedSession?.startTime).toBeInstanceOf(Date);
          expect(retrievedSession?.endTime).toBeInstanceOf(Date);
          expect(retrievedSession?.startTime.getTime()).toBe(session.startTime.getTime());
          expect(retrievedSession?.endTime.getTime()).toBe(session.endTime.getTime());
          
          // Question fields
          expect(retrievedSession?.questionId).toBe(session.questionId);
          expect(retrievedSession?.questionTitle).toBe(session.questionTitle);
          expect(typeof retrievedSession?.questionTitle).toBe('string');
          expect(retrievedSession?.questionTitle.length).toBeGreaterThan(0);
          
          // Rating (1-5)
          expect(retrievedSession?.rating).toBe(session.rating);
          expect(retrievedSession?.rating).toBeGreaterThanOrEqual(1);
          expect(retrievedSession?.rating).toBeLessThanOrEqual(5);
          
          // Difficulty
          expect(retrievedSession?.difficulty).toBe(session.difficulty);
          expect(['easy', 'medium', 'hard']).toContain(retrievedSession?.difficulty);
          
          // Notes (can be empty string but must be present)
          expect(retrievedSession?.notes).toBe(session.notes);
          expect(typeof retrievedSession?.notes).toBe('string');
          
          // Additional fields that should be preserved
          expect(retrievedSession?.userId).toBe(session.userId);
          expect(retrievedSession?.category).toBe(session.category);
          expect(retrievedSession?.duration).toBe(session.duration);
          expect(retrievedSession?.perceivedDifficulty).toBe(session.perceivedDifficulty);
          expect(retrievedSession?.pressureModeUsed).toBe(session.pressureModeUsed);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve all required fields for multiple sessions', () => {
      fc.assert(
        fc.property(
          fc.array(completedSessionArbitrary(), { minLength: 1, maxLength: 10 }),
          (sessions) => {
            // Ensure all sessions have the same userId for this test
            const userId = sessions[0].userId;
            const normalizedSessions = sessions.map(s => ({ ...s, userId }));
            
            // Ensure unique session IDs
            const uniqueSessions = normalizedSessions.filter(
              (session, index, self) =>
                self.findIndex((s) => s.id === session.id) === index
            );

            // Save all sessions
            uniqueSessions.forEach((session) => {
              StorageService.saveSession(session);
            });

            // Retrieve all sessions for this user
            const retrievedSessions = StorageService.getSessions(userId);

            // Should have all sessions
            expect(retrievedSessions.length).toBe(uniqueSessions.length);

            // Verify each session has all required fields
            uniqueSessions.forEach((originalSession) => {
              const retrieved = retrievedSessions.find(s => s.id === originalSession.id);
              
              expect(retrieved).toBeDefined();
              
              // Verify all required fields
              expect(retrieved?.startTime).toBeInstanceOf(Date);
              expect(retrieved?.endTime).toBeInstanceOf(Date);
              expect(retrieved?.questionTitle).toBe(originalSession.questionTitle);
              expect(retrieved?.rating).toBe(originalSession.rating);
              expect(retrieved?.difficulty).toBe(originalSession.difficulty);
              expect(retrieved?.notes).toBe(originalSession.notes);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve required fields even with edge case values', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.uuid(),
          fc.uuid(),
          dateArbitrary(),
          dateArbitrary(),
          ratingArbitrary(),
          difficultyArbitrary(),
          (userId, sessionId, questionId, startTime, endTime, rating, difficulty) => {
            // Create session with edge case values
            const session: import('@/types').CompletedSession = {
              id: sessionId,
              userId: userId,
              questionId: questionId,
              questionTitle: 'Q', // Minimal title
              category: 'arrays',
              difficulty: difficulty,
              startTime: startTime,
              endTime: endTime,
              duration: 60,
              rating: rating,
              perceivedDifficulty: difficulty,
              notes: '', // Empty notes (edge case)
              pressureModeUsed: false,
            };

            // Save and retrieve
            StorageService.saveSession(session);
            const retrieved = StorageService.getSessions(userId);

            // Find the session
            const found = retrieved.find(s => s.id === sessionId);

            // Verify all required fields are present even with edge case values
            expect(found).toBeDefined();
            expect(found?.questionTitle).toBe('Q');
            expect(found?.notes).toBe(''); // Empty string should be preserved
            expect(found?.rating).toBe(rating);
            expect(found?.difficulty).toBe(difficulty);
            expect(found?.startTime).toBeInstanceOf(Date);
            expect(found?.endTime).toBeInstanceOf(Date);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
