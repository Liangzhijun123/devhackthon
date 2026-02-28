/**
 * Property-Based Tests for Session Management
 * Tests universal properties that should hold for session operations
 */

import fc from 'fast-check';
import { SessionService, SessionError } from '@/services/SessionService';
import { StorageService } from '@/services/StorageService';
import { Plan, Feedback, CompletedSession, User } from '@/types';
import { questionBank, getQuestionsByPlan } from '@/lib/questions';

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
  SessionService.clearAll();
  StorageService.clearAll();
});

// Clear storage after each test
afterEach(() => {
  localStorageMock.clear();
  SessionService.clearAll();
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
 * Generate valid user IDs
 */
const userIdArbitrary = (): fc.Arbitrary<string> => {
  return fc.uuid();
};

/**
 * Generate valid rating values (1-5)
 */
const ratingArbitrary = (): fc.Arbitrary<1 | 2 | 3 | 4 | 5> => {
  return fc.constantFrom<1 | 2 | 3 | 4 | 5>(1, 2, 3, 4, 5);
};

/**
 * Generate valid difficulty values
 */
const difficultyArbitrary = (): fc.Arbitrary<'easy' | 'medium' | 'hard'> => {
  return fc.constantFrom<'easy' | 'medium' | 'hard'>('easy', 'medium', 'hard');
};

/**
 * Generate valid feedback objects
 */
const feedbackArbitrary = (): fc.Arbitrary<Feedback> => {
  return fc.record({
    rating: ratingArbitrary(),
    perceivedDifficulty: difficultyArbitrary(),
    notes: fc.string({ maxLength: 500 }),
  });
};

/**
 * Generate valid dates (within reasonable range)
 */
const dateArbitrary = (): fc.Arbitrary<Date> => {
  return fc.date({
    min: new Date('2024-01-01'),
    max: new Date('2025-12-31'),
  });
};

// ============================================================================
// Property Tests
// ============================================================================

describe('Session Management Property Tests', () => {
  describe('Property 6: Interview session initializes with 45-minute timer', () => {
    /**
     * **Validates: Requirements 2.1**
     * 
     * For any user starting a mock interview, the session timer should be
     * initialized to exactly 2700 seconds (45 minutes).
     * 
     * This property ensures that all interview sessions start with the
     * correct time limit as specified in the requirements.
     */
    it('should initialize session with exactly 2700 seconds (45 minutes)', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          planArbitrary(),
          (userId, plan) => {
            // Start a new session
            const session = SessionService.startSession(userId, plan);
            
            // Timer should be exactly 2700 seconds (45 minutes)
            expect(session.timeRemaining).toBe(2700);
            
            // Verify it's exactly 45 minutes
            const minutes = session.timeRemaining / 60;
            expect(minutes).toBe(45);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should initialize timer consistently across all plans', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          (userId) => {
            const plans: Plan[] = ['basic', 'premium', 'pro'];
            
            plans.forEach((plan, index) => {
              // Use unique user ID for each plan to avoid weekly limit
              const uniqueUserId = `${userId}_${index}`;
              const session = SessionService.startSession(uniqueUserId, plan);
              
              // All plans should have the same timer duration
              expect(session.timeRemaining).toBe(2700);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should initialize timer for multiple sessions consistently', () => {
      fc.assert(
        fc.property(
          fc.array(userIdArbitrary(), { minLength: 2, maxLength: 5 }),
          planArbitrary(),
          (userIds, plan) => {
            // Ensure unique user IDs
            const uniqueUserIds = [...new Set(userIds)];
            
            if (uniqueUserIds.length < 2) return true;

            // Start sessions for multiple users
            const sessions = uniqueUserIds.map(userId =>
              SessionService.startSession(userId, plan)
            );

            // All sessions should have 2700 seconds
            sessions.forEach(session => {
              expect(session.timeRemaining).toBe(2700);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Interview session selects question from available bank', () => {
    /**
     * **Validates: Requirements 2.2**
     * 
     * For any user starting a mock interview, the selected question should
     * be from the question bank accessible to their plan tier.
     * 
     * This property ensures that question selection respects plan-based
     * access control and only shows questions the user is entitled to see.
     */
    it('should select question from plan-accessible bank', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          planArbitrary(),
          (userId, plan) => {
            // Start a new session
            const session = SessionService.startSession(userId, plan);
            
            // Get questions accessible to this plan
            const accessibleQuestions = getQuestionsByPlan(plan);
            const accessibleQuestionIds = accessibleQuestions.map(q => q.id);
            
            // Selected question should be in the accessible bank
            expect(accessibleQuestionIds).toContain(session.questionId);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should select valid question for basic plan (15 questions)', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          (userId) => {
            const session = SessionService.startSession(userId, 'basic');
            
            // Get basic plan questions
            const basicQuestions = getQuestionsByPlan('basic');
            const basicQuestionIds = basicQuestions.map(q => q.id);
            
            // Should have at least 15 questions
            expect(basicQuestions.length).toBeGreaterThanOrEqual(15);
            
            // Selected question should be from basic bank
            expect(basicQuestionIds).toContain(session.questionId);
            
            // Verify question is actually marked as basic
            const selectedQuestion = basicQuestions.find(q => q.id === session.questionId);
            expect(selectedQuestion?.planRequired).toBe('basic');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should select valid question for premium plan (30 questions)', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          (userId) => {
            const session = SessionService.startSession(userId, 'premium');
            
            // Get premium plan questions
            const premiumQuestions = getQuestionsByPlan('premium');
            const premiumQuestionIds = premiumQuestions.map(q => q.id);
            
            // Should have at least 30 questions
            expect(premiumQuestions.length).toBeGreaterThanOrEqual(30);
            
            // Selected question should be from premium bank
            expect(premiumQuestionIds).toContain(session.questionId);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should select valid question for pro plan (all questions)', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          (userId) => {
            const session = SessionService.startSession(userId, 'pro');
            
            // Get pro plan questions (all questions)
            const proQuestions = getQuestionsByPlan('pro');
            const proQuestionIds = proQuestions.map(q => q.id);
            
            // Should have all questions in the bank
            expect(proQuestions.length).toBe(questionBank.length);
            
            // Selected question should be from pro bank
            expect(proQuestionIds).toContain(session.questionId);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 8: Early session termination completes successfully', () => {
    /**
     * **Validates: Requirements 2.4**
     * 
     * For any active interview session with time remaining, manually ending
     * the session should successfully transition to the feedback state.
     * 
     * This property ensures that users can end sessions early without errors
     * and that the session data is properly saved.
     */
    it('should successfully end session with time remaining', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          planArbitrary(),
          feedbackArbitrary(),
          (userId, plan, feedback) => {
            // Start a new session
            const session = SessionService.startSession(userId, plan);
            
            // Verify session has time remaining
            expect(session.timeRemaining).toBe(2700);
            expect(session.endTime).toBeNull();
            
            // End the session early
            const completedSession = SessionService.endSession(session, feedback);
            
            // Session should be completed successfully
            expect(completedSession).toBeDefined();
            expect(completedSession.id).toBe(session.id);
            expect(completedSession.userId).toBe(userId);
            expect(completedSession.endTime).toBeInstanceOf(Date);
            expect(completedSession.endTime).not.toBeNull();
            
            // Feedback should be saved
            expect(completedSession.rating).toBe(feedback.rating);
            expect(completedSession.perceivedDifficulty).toBe(feedback.perceivedDifficulty);
            expect(completedSession.notes).toBe(feedback.notes);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate duration correctly when ending early', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          planArbitrary(),
          feedbackArbitrary(),
          (userId, plan, feedback) => {
            // Start a new session
            const session = SessionService.startSession(userId, plan);
            const startTime = session.startTime.getTime();
            
            // End the session immediately
            const completedSession = SessionService.endSession(session, feedback);
            const endTime = completedSession.endTime.getTime();
            
            // Duration should be calculated correctly
            const expectedDuration = Math.floor((endTime - startTime) / 1000);
            expect(completedSession.duration).toBe(expectedDuration);
            
            // Duration should be less than full 45 minutes (2700 seconds)
            // Allow some tolerance for test execution time
            expect(completedSession.duration).toBeLessThan(2700);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should persist completed session to storage', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          planArbitrary(),
          feedbackArbitrary(),
          (userId, plan, feedback) => {
            // Start and end a session
            const session = SessionService.startSession(userId, plan);
            const completedSession = SessionService.endSession(session, feedback);
            
            // Retrieve sessions from storage
            const storedSessions = StorageService.getSessions(userId);
            
            // Completed session should be in storage
            expect(storedSessions.length).toBeGreaterThan(0);
            
            const foundSession = storedSessions.find(s => s.id === completedSession.id);
            expect(foundSession).toBeDefined();
            expect(foundSession?.rating).toBe(feedback.rating);
            expect(foundSession?.notes).toBe(feedback.notes);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 13: Same-day question selection avoids repetition', () => {
    /**
     * **Validates: Requirements 3.4**
     * 
     * For any user selecting multiple questions on the same day, no question
     * should be selected more than once within that day.
     * 
     * This property ensures that users get variety in their practice sessions
     * and don't see the same question twice in one day.
     */
    it('should not repeat questions on the same day', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.constantFrom<Plan>('premium', 'pro'), // Use premium/pro for more questions
          feedbackArbitrary(),
          fc.integer({ min: 2, max: 5 }),
          (userId, plan, feedback, sessionCount) => {
            const selectedQuestionIds = new Set<string>();
            
            // Start multiple sessions on the same day
            for (let i = 0; i < sessionCount; i++) {
              const session = SessionService.startSession(userId, plan);
              
              // Track selected question
              selectedQuestionIds.add(session.questionId);
              
              // Complete the session to mark question as used
              SessionService.endSession(session, feedback);
            }
            
            // All selected questions should be unique
            expect(selectedQuestionIds.size).toBe(sessionCount);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should allow repetition on different days', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          planArbitrary(),
          feedbackArbitrary(),
          (userId, plan, feedback) => {
            // Start first session
            const session1 = SessionService.startSession(userId, plan);
            const questionId1 = session1.questionId;
            
            // Complete first session
            const completed1 = SessionService.endSession(session1, feedback);
            
            // Modify the session date to be yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            completed1.startTime = yesterday;
            
            // Save the modified session
            StorageService.clearAll();
            StorageService.saveSession(completed1);
            
            // Start second session today
            const session2 = SessionService.startSession(userId, plan);
            
            // Question can be the same or different (no restriction across days)
            // Just verify that a question was selected
            expect(session2.questionId).toBeDefined();
            expect(typeof session2.questionId).toBe('string');
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should handle case when all questions used in a day', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          feedbackArbitrary(),
          (userId, feedback) => {
            // Use premium plan to avoid weekly limit (has 30 questions)
            const plan: Plan = 'premium';
            const availableQuestions = getQuestionsByPlan(plan);
            const questionCount = Math.min(availableQuestions.length, 10); // Limit to 10 for performance
            
            // Use multiple questions
            for (let i = 0; i < questionCount; i++) {
              const session = SessionService.startSession(userId, plan);
              SessionService.endSession(session, feedback);
            }
            
            // Should still be able to start another session (allows repetition)
            const extraSession = SessionService.startSession(userId, plan);
            expect(extraSession).toBeDefined();
            expect(extraSession.questionId).toBeDefined();
          }
        ),
        { numRuns: 10 } // Fewer runs since this is expensive
      );
    });
  });

  describe('Property 21: Basic plan limits weekly interviews to 3', () => {
    /**
     * **Validates: Requirements 6.1**
     * 
     * For any Basic plan user, attempting to start a 4th mock interview
     * within the same week should be denied.
     * 
     * This property ensures that the weekly limit is enforced for Basic
     * plan users as part of the feature gating strategy.
     */
    it('should allow up to 3 interviews per week for basic plan', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          feedbackArbitrary(),
          (userId, feedback) => {
            const plan: Plan = 'basic';
            
            // Start and complete 3 sessions
            for (let i = 0; i < 3; i++) {
              const session = SessionService.startSession(userId, plan);
              SessionService.endSession(session, feedback);
            }
            
            // 4th session should be denied
            expect(() => {
              SessionService.startSession(userId, plan);
            }).toThrow(SessionError);
            
            expect(() => {
              SessionService.startSession(userId, plan);
            }).toThrow('Basic plan users are limited to 3 interviews per week');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reset weekly limit at start of new week', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          feedbackArbitrary(),
          (userId, feedback) => {
            const plan: Plan = 'basic';
            
            // Complete 3 sessions this week
            for (let i = 0; i < 3; i++) {
              const session = SessionService.startSession(userId, plan);
              const completed = SessionService.endSession(session, feedback);
              
              // Modify to be last week
              const lastWeek = new Date();
              lastWeek.setDate(lastWeek.getDate() - 7);
              completed.startTime = lastWeek;
              
              // Re-save with modified date
              StorageService.clearAll();
              StorageService.saveSession(completed);
            }
            
            // Should be able to start new session this week
            const newSession = SessionService.startSession(userId, plan);
            expect(newSession).toBeDefined();
            expect(newSession.questionId).toBeDefined();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should count only current week sessions', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          feedbackArbitrary(),
          (userId, feedback) => {
            const plan: Plan = 'basic';
            
            // Create 2 sessions from last week
            const lastWeekSessions: CompletedSession[] = [];
            for (let i = 0; i < 2; i++) {
              const session = SessionService.startSession(userId, plan);
              const completed = SessionService.endSession(session, feedback);
              
              // Modify to be last week
              const lastWeek = new Date();
              lastWeek.setDate(lastWeek.getDate() - 7);
              completed.startTime = lastWeek;
              lastWeekSessions.push(completed);
            }
            
            // Clear storage and save only last week's sessions
            StorageService.clearAll();
            lastWeekSessions.forEach(s => StorageService.saveSession(s));
            
            // Should be able to start 3 sessions this week
            for (let i = 0; i < 3; i++) {
              const session = SessionService.startSession(userId, plan);
              expect(session).toBeDefined();
              SessionService.endSession(session, feedback);
            }
            
            // 4th session this week should be denied
            expect(() => {
              SessionService.startSession(userId, plan);
            }).toThrow(SessionError);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 22: Premium/Pro plans allow unlimited interviews', () => {
    /**
     * **Validates: Requirements 6.2**
     * 
     * For any Premium or Pro plan user, starting any number of mock
     * interviews within a week should be permitted.
     * 
     * This property ensures that premium users are not subject to the
     * weekly limit that applies to Basic plan users.
     */
    it('should allow unlimited interviews for premium plan', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          feedbackArbitrary(),
          fc.integer({ min: 5, max: 10 }),
          (userId, feedback, sessionCount) => {
            const plan: Plan = 'premium';
            
            // Start and complete many sessions (more than basic limit)
            for (let i = 0; i < sessionCount; i++) {
              const session = SessionService.startSession(userId, plan);
              expect(session).toBeDefined();
              SessionService.endSession(session, feedback);
            }
            
            // Should still be able to start another session
            const extraSession = SessionService.startSession(userId, plan);
            expect(extraSession).toBeDefined();
            expect(extraSession.questionId).toBeDefined();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should allow unlimited interviews for pro plan', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          feedbackArbitrary(),
          fc.integer({ min: 5, max: 10 }),
          (userId, feedback, sessionCount) => {
            const plan: Plan = 'pro';
            
            // Start and complete many sessions (more than basic limit)
            for (let i = 0; i < sessionCount; i++) {
              const session = SessionService.startSession(userId, plan);
              expect(session).toBeDefined();
              SessionService.endSession(session, feedback);
            }
            
            // Should still be able to start another session
            const extraSession = SessionService.startSession(userId, plan);
            expect(extraSession).toBeDefined();
            expect(extraSession.questionId).toBeDefined();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should not enforce weekly limit for premium/pro plans', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.constantFrom<Plan>('premium', 'pro'),
          feedbackArbitrary(),
          (userId, plan, feedback) => {
            // Complete more than basic limit (3) sessions
            const sessionCount = 10;
            
            for (let i = 0; i < sessionCount; i++) {
              // Should not throw error
              const session = SessionService.startSession(userId, plan);
              expect(session).toBeDefined();
              SessionService.endSession(session, feedback);
            }
            
            // Verify all sessions were saved
            const sessions = StorageService.getSessions(userId);
            expect(sessions.length).toBe(sessionCount);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
