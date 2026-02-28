/**
 * Property-Based Tests for Analytics Service
 * Tests universal properties that should hold for analytics calculations
 */

import fc from 'fast-check';
import { AnalyticsService, AnalyticsError } from '@/services/AnalyticsService';
import { CompletedSession, Plan } from '@/types';

// ============================================================================
// Arbitraries (Generators) for Property-Based Testing
// ============================================================================

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
 * Generate a completed session
 */
const completedSessionArbitrary = (
  userId?: string,
  date?: Date,
  category?: string
): fc.Arbitrary<CompletedSession> => {
  return fc.record({
    id: fc.uuid(),
    userId: userId ? fc.constant(userId) : userIdArbitrary(),
    questionId: fc.uuid(),
    questionTitle: fc.string({ minLength: 5, maxLength: 50 }),
    category: category ? fc.constant(category) : categoryArbitrary(),
    difficulty: difficultyArbitrary(),
    startTime: date ? fc.constant(date) : fc.date({
      min: new Date('2024-01-01'),
      max: new Date('2025-12-31'),
    }),
    endTime: fc.date({
      min: new Date('2024-01-01'),
      max: new Date('2025-12-31'),
    }),
    duration: fc.integer({ min: 60, max: 2700 }),
    rating: ratingArbitrary(),
    perceivedDifficulty: difficultyArbitrary(),
    notes: fc.string({ maxLength: 500 }),
    pressureModeUsed: fc.boolean(),
  });
};

// ============================================================================
// Property Tests
// ============================================================================

describe('Analytics Property Tests', () => {
  describe('Property 17: New users initialize with zero streak', () => {
    /**
     * **Validates: Requirements 5.1**
     * 
     * For any newly created user account, the initial streak count should
     * be exactly 0.
     * 
     * This property ensures that all users start with a clean slate and
     * must complete sessions to build their streak.
     */
    it('should return zero streak for user with no sessions', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          (userId) => {
            // Calculate streak with empty session array
            const streak = AnalyticsService.calculateStreak(userId, []);
            
            // Streak should be exactly 0
            expect(streak).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return zero streak for user with no matching sessions', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          userIdArbitrary(),
          fc.array(completedSessionArbitrary(), { minLength: 1, maxLength: 10 }),
          (userId, otherUserId, sessions) => {
            // Ensure user IDs are different
            fc.pre(userId !== otherUserId);
            
            // Assign all sessions to other user
            const otherUserSessions = sessions.map(s => ({
              ...s,
              userId: otherUserId,
            }));
            
            // Calculate streak for user with no sessions
            const streak = AnalyticsService.calculateStreak(userId, otherUserSessions);
            
            // Streak should be 0
            expect(streak).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should initialize to zero regardless of other users streaks', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.array(
            fc.record({
              userId: userIdArbitrary(),
              sessions: fc.array(completedSessionArbitrary(), { minLength: 1, maxLength: 5 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (newUserId, otherUsersData) => {
            // Ensure new user ID is different from all others
            const allSessions = otherUsersData.flatMap(data =>
              data.sessions.map(s => ({ ...s, userId: data.userId }))
            );
            
            // Calculate streak for new user
            const streak = AnalyticsService.calculateStreak(newUserId, allSessions);
            
            // New user should have zero streak
            expect(streak).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 18: First daily session increments streak', () => {
    /**
     * **Validates: Requirements 5.2**
     * 
     * For any user completing their first session on a new day (with an
     * active streak from the previous day), the streak count should
     * increase by exactly 1.
     * 
     * This property ensures that the streak increments correctly when
     * users maintain their daily practice habit.
     */
    it('should increment streak by 1 when completing session on consecutive day', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.integer({ min: 1, max: 10 }),
          (userId, initialStreakDays) => {
            const sessions: CompletedSession[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Create sessions for consecutive days leading up to today
            for (let i = initialStreakDays - 1; i >= 0; i--) {
              const sessionDate = new Date(today);
              sessionDate.setDate(today.getDate() - i);
              sessionDate.setHours(12, 0, 0, 0);
              
              sessions.push({
                id: `session-${i}`,
                userId,
                questionId: `q-${i}`,
                questionTitle: `Question ${i}`,
                category: 'arrays',
                difficulty: 'medium',
                startTime: sessionDate,
                endTime: new Date(sessionDate.getTime() + 1800000),
                duration: 1800,
                rating: 3,
                perceivedDifficulty: 'medium',
                notes: '',
                pressureModeUsed: false,
              });
            }
            
            // Calculate streak
            const streak = AnalyticsService.calculateStreak(userId, sessions);
            
            // Streak should equal the number of consecutive days
            expect(streak).toBe(initialStreakDays);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should count first session of each day for streak', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.integer({ min: 1, max: 5 }),
          fc.integer({ min: 1, max: 3 }),
          (userId, streakDays, sessionsPerDay) => {
            const sessions: CompletedSession[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Create multiple sessions per day for consecutive days
            for (let day = streakDays - 1; day >= 0; day--) {
              for (let session = 0; session < sessionsPerDay; session++) {
                const sessionDate = new Date(today);
                sessionDate.setDate(today.getDate() - day);
                sessionDate.setHours(10 + session * 2, 0, 0, 0);
                
                sessions.push({
                  id: `session-${day}-${session}`,
                  userId,
                  questionId: `q-${day}-${session}`,
                  questionTitle: `Question ${day}-${session}`,
                  category: 'arrays',
                  difficulty: 'medium',
                  startTime: sessionDate,
                  endTime: new Date(sessionDate.getTime() + 1800000),
                  duration: 1800,
                  rating: 3,
                  perceivedDifficulty: 'medium',
                  notes: '',
                  pressureModeUsed: false,
                });
              }
            }
            
            // Calculate streak
            const streak = AnalyticsService.calculateStreak(userId, sessions);
            
            // Streak should equal number of days (not total sessions)
            expect(streak).toBe(streakDays);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain streak when session completed yesterday', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          (userId) => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(12, 0, 0, 0);
            
            const sessions: CompletedSession[] = [{
              id: 'session-1',
              userId,
              questionId: 'q-1',
              questionTitle: 'Question 1',
              category: 'arrays',
              difficulty: 'medium',
              startTime: yesterday,
              endTime: new Date(yesterday.getTime() + 1800000),
              duration: 1800,
              rating: 3,
              perceivedDifficulty: 'medium',
              notes: '',
              pressureModeUsed: false,
            }];
            
            // Calculate streak
            const streak = AnalyticsService.calculateStreak(userId, sessions);
            
            // Streak should be 1 (yesterday's session is still valid)
            expect(streak).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 19: Missed day resets streak to zero', () => {
    /**
     * **Validates: Requirements 5.3**
     * 
     * For any user who completes zero sessions in a 24-hour period
     * following their last session, the streak count should reset to 0.
     * 
     * This property ensures that streaks are properly reset when users
     * miss a day of practice.
     */
    it('should reset streak to zero when last session was more than 1 day ago', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.integer({ min: 2, max: 10 }),
          (userId, daysAgo) => {
            const lastSession = new Date();
            lastSession.setDate(lastSession.getDate() - daysAgo);
            lastSession.setHours(12, 0, 0, 0);
            
            const sessions: CompletedSession[] = [{
              id: 'session-1',
              userId,
              questionId: 'q-1',
              questionTitle: 'Question 1',
              category: 'arrays',
              difficulty: 'medium',
              startTime: lastSession,
              endTime: new Date(lastSession.getTime() + 1800000),
              duration: 1800,
              rating: 3,
              perceivedDifficulty: 'medium',
              notes: '',
              pressureModeUsed: false,
            }];
            
            // Calculate streak
            const streak = AnalyticsService.calculateStreak(userId, sessions);
            
            // Streak should be 0 (missed more than 1 day)
            expect(streak).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reset streak when there is a gap in consecutive days', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.integer({ min: 2, max: 5 }),
          fc.integer({ min: 2, max: 5 }),
          (userId, daysBeforeGap, daysAfterGap) => {
            const sessions: CompletedSession[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Create recent consecutive sessions
            for (let i = daysAfterGap - 1; i >= 0; i--) {
              const sessionDate = new Date(today);
              sessionDate.setDate(today.getDate() - i);
              sessionDate.setHours(12, 0, 0, 0);
              
              sessions.push({
                id: `recent-${i}`,
                userId,
                questionId: `q-recent-${i}`,
                questionTitle: `Recent Question ${i}`,
                category: 'arrays',
                difficulty: 'medium',
                startTime: sessionDate,
                endTime: new Date(sessionDate.getTime() + 1800000),
                duration: 1800,
                rating: 3,
                perceivedDifficulty: 'medium',
                notes: '',
                pressureModeUsed: false,
              });
            }
            
            // Create old sessions with a gap (more than 1 day before recent sessions)
            const gapStart = new Date(today);
            gapStart.setDate(today.getDate() - daysAfterGap - 2); // 2+ day gap
            
            for (let i = daysBeforeGap - 1; i >= 0; i--) {
              const sessionDate = new Date(gapStart);
              sessionDate.setDate(gapStart.getDate() - i);
              sessionDate.setHours(12, 0, 0, 0);
              
              sessions.push({
                id: `old-${i}`,
                userId,
                questionId: `q-old-${i}`,
                questionTitle: `Old Question ${i}`,
                category: 'arrays',
                difficulty: 'medium',
                startTime: sessionDate,
                endTime: new Date(sessionDate.getTime() + 1800000),
                duration: 1800,
                rating: 3,
                perceivedDifficulty: 'medium',
                notes: '',
                pressureModeUsed: false,
              });
            }
            
            // Calculate streak
            const streak = AnalyticsService.calculateStreak(userId, sessions);
            
            // Streak should only count recent consecutive days (not old sessions)
            expect(streak).toBe(daysAfterGap);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return zero for any user with sessions older than yesterday', () => {
      fc.assert(
        fc.property(
          userIdArbitrary(),
          fc.integer({ min: 2, max: 30 }),
          fc.array(ratingArbitrary(), { minLength: 1, maxLength: 10 }),
          (userId, daysAgo, ratings) => {
            const sessions: CompletedSession[] = ratings.map((rating, index) => {
              const sessionDate = new Date();
              sessionDate.setDate(sessionDate.getDate() - daysAgo - index);
              sessionDate.setHours(12, 0, 0, 0);
              
              return {
                id: `session-${index}`,
                userId,
                questionId: `q-${index}`,
                questionTitle: `Question ${index}`,
                category: 'arrays',
                difficulty: 'medium',
                startTime: sessionDate,
                endTime: new Date(sessionDate.getTime() + 1800000),
                duration: 1800,
                rating,
                perceivedDifficulty: 'medium',
                notes: '',
                pressureModeUsed: false,
              };
            });
            
            // Calculate streak
            const streak = AnalyticsService.calculateStreak(userId, sessions);
            
            // Streak should be 0 (all sessions are too old)
            expect(streak).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 31: Category performance calculation is accurate', () => {
    /**
     * **Validates: Requirements 9.2**
     * 
     * For any set of completed sessions, the average rating per category
     * should equal the sum of ratings for that category divided by the
     * count of sessions in that category.
     * 
     * This property ensures that category performance calculations are
     * mathematically correct.
     */
    it('should calculate accurate average rating per category', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              category: categoryArbitrary(),
              rating: ratingArbitrary(),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (sessionData) => {
            // Create sessions from the data
            const sessions: CompletedSession[] = sessionData.map((data, index) => ({
              id: `session-${index}`,
              userId: 'test-user',
              questionId: `q-${index}`,
              questionTitle: `Question ${index}`,
              category: data.category,
              difficulty: 'medium',
              startTime: new Date(),
              endTime: new Date(),
              duration: 1800,
              rating: data.rating,
              perceivedDifficulty: 'medium',
              notes: '',
              pressureModeUsed: false,
            }));
            
            // Calculate performance by category
            const performances = AnalyticsService.getPerformanceByCategory(sessions);
            
            // Verify each category's average is correct
            performances.forEach(perf => {
              const categorySessions = sessions.filter(s => s.category === perf.category);
              const expectedAverage =
                categorySessions.reduce((sum, s) => sum + s.rating, 0) / categorySessions.length;
              
              // Average should match expected value
              expect(perf.averageRating).toBeCloseTo(expectedAverage, 10);
              expect(perf.sessionsCount).toBe(categorySessions.length);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle single session per category correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              category: categoryArbitrary(),
              rating: ratingArbitrary(),
            }),
            { minLength: 1, maxLength: 7 }
          ),
          (sessionData) => {
            // Ensure unique categories (one session per category)
            const uniqueData = sessionData.filter(
              (data, index, self) =>
                self.findIndex(d => d.category === data.category) === index
            );
            
            if (uniqueData.length === 0) return true;
            
            // Create sessions
            const sessions: CompletedSession[] = uniqueData.map((data, index) => ({
              id: `session-${index}`,
              userId: 'test-user',
              questionId: `q-${index}`,
              questionTitle: `Question ${index}`,
              category: data.category,
              difficulty: 'medium',
              startTime: new Date(),
              endTime: new Date(),
              duration: 1800,
              rating: data.rating,
              perceivedDifficulty: 'medium',
              notes: '',
              pressureModeUsed: false,
            }));
            
            // Calculate performance
            const performances = AnalyticsService.getPerformanceByCategory(sessions);
            
            // Each category should have average equal to its single rating
            performances.forEach(perf => {
              const session = sessions.find(s => s.category === perf.category);
              expect(perf.averageRating).toBe(session!.rating);
              expect(perf.sessionsCount).toBe(1);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate correct averages for multiple sessions per category', () => {
      fc.assert(
        fc.property(
          categoryArbitrary(),
          fc.array(ratingArbitrary(), { minLength: 2, maxLength: 10 }),
          (category, ratings) => {
            // Create multiple sessions for the same category
            const sessions: CompletedSession[] = ratings.map((rating, index) => ({
              id: `session-${index}`,
              userId: 'test-user',
              questionId: `q-${index}`,
              questionTitle: `Question ${index}`,
              category,
              difficulty: 'medium',
              startTime: new Date(),
              endTime: new Date(),
              duration: 1800,
              rating,
              perceivedDifficulty: 'medium',
              notes: '',
              pressureModeUsed: false,
            }));
            
            // Calculate performance
            const performances = AnalyticsService.getPerformanceByCategory(sessions);
            
            // Should have exactly one category
            expect(performances.length).toBe(1);
            
            const perf = performances[0];
            const expectedAverage = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            
            expect(perf.category).toBe(category);
            expect(perf.sessionsCount).toBe(ratings.length);
            expect(perf.averageRating).toBeCloseTo(expectedAverage, 10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 32: Weakest category is correctly identified', () => {
    /**
     * **Validates: Requirements 9.4**
     * 
     * For any set of category performance data, the category marked as
     * "weakest" should be the one with the lowest average rating.
     * 
     * This property ensures that the weakest category identification is
     * correct and helps users focus on areas needing improvement.
     */
    it('should identify category with lowest average rating as weakest', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              category: categoryArbitrary(),
              ratings: fc.array(ratingArbitrary(), { minLength: 1, maxLength: 5 }),
            }),
            { minLength: 2, maxLength: 7 }
          ),
          (categoryData) => {
            // Ensure unique categories
            const uniqueData = categoryData.filter(
              (data, index, self) =>
                self.findIndex(d => d.category === data.category) === index
            );
            
            if (uniqueData.length < 2) return true;
            
            // Create sessions
            const sessions: CompletedSession[] = uniqueData.flatMap((data, catIndex) =>
              data.ratings.map((rating, ratingIndex) => ({
                id: `session-${catIndex}-${ratingIndex}`,
                userId: 'test-user',
                questionId: `q-${catIndex}-${ratingIndex}`,
                questionTitle: `Question ${catIndex}-${ratingIndex}`,
                category: data.category,
                difficulty: 'medium',
                startTime: new Date(),
                endTime: new Date(),
                duration: 1800,
                rating,
                perceivedDifficulty: 'medium',
                notes: '',
                pressureModeUsed: false,
              }))
            );
            
            // Calculate performance
            const performances = AnalyticsService.getPerformanceByCategory(sessions);
            
            // Find the weakest category
            const weakest = performances.find(p => p.isWeakest);
            expect(weakest).toBeDefined();
            
            // Verify it has the lowest average rating
            const minAverage = Math.min(...performances.map(p => p.averageRating));
            expect(weakest!.averageRating).toBe(minAverage);
            
            // Only one category should be marked as weakest
            const weakestCount = performances.filter(p => p.isWeakest).length;
            expect(weakestCount).toBe(1);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify weakest when all categories have different averages', () => {
      fc.assert(
        fc.property(
          fc.array(categoryArbitrary(), { minLength: 2, maxLength: 5 }),
          (categories) => {
            // Ensure unique categories
            const uniqueCategories = [...new Set(categories)];
            if (uniqueCategories.length < 2) return true;
            
            // Create sessions with distinct average ratings per category
            const sessions: CompletedSession[] = uniqueCategories.flatMap((category, index) => {
              // Each category gets a different rating (1 to 5)
              const rating = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
              
              return [{
                id: `session-${index}`,
                userId: 'test-user',
                questionId: `q-${index}`,
                questionTitle: `Question ${index}`,
                category,
                difficulty: 'medium',
                startTime: new Date(),
                endTime: new Date(),
                duration: 1800,
                rating,
                perceivedDifficulty: 'medium',
                notes: '',
                pressureModeUsed: false,
              }];
            });
            
            // Calculate performance
            const performances = AnalyticsService.getPerformanceByCategory(sessions);
            
            // Find weakest
            const weakest = performances.find(p => p.isWeakest);
            expect(weakest).toBeDefined();
            
            // Verify it's the one with minimum rating
            const allRatings = performances.map(p => p.averageRating);
            const minRating = Math.min(...allRatings);
            expect(weakest!.averageRating).toBe(minRating);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use getWeakestCategory method correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              category: categoryArbitrary(),
              rating: ratingArbitrary(),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          (sessionData) => {
            // Ensure at least 2 unique categories
            const uniqueCategories = [...new Set(sessionData.map(d => d.category))];
            if (uniqueCategories.length < 2) return true;
            
            // Create sessions
            const sessions: CompletedSession[] = sessionData.map((data, index) => ({
              id: `session-${index}`,
              userId: 'test-user',
              questionId: `q-${index}`,
              questionTitle: `Question ${index}`,
              category: data.category,
              difficulty: 'medium',
              startTime: new Date(),
              endTime: new Date(),
              duration: 1800,
              rating: data.rating,
              perceivedDifficulty: 'medium',
              notes: '',
              pressureModeUsed: false,
            }));
            
            // Get weakest category
            const weakestCategory = AnalyticsService.getWeakestCategory(sessions);
            
            // Verify it matches the performance data
            const performances = AnalyticsService.getPerformanceByCategory(sessions);
            const weakestPerf = performances.find(p => p.isWeakest);
            
            expect(weakestCategory).toBe(weakestPerf!.category);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw error when no sessions available', () => {
      expect(() => {
        AnalyticsService.getWeakestCategory([]);
      }).toThrow(AnalyticsError);
      
      expect(() => {
        AnalyticsService.getWeakestCategory([]);
      }).toThrow('No sessions available to determine weakest category');
    });
  });
});
