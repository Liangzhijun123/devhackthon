/**
 * Manual test file for StorageService
 * This can be used to verify StorageService functionality
 * Run this in a browser console or Node environment with localStorage polyfill
 */

import { StorageService, StorageError } from '../StorageService';
import { User, CompletedSession } from '@/types';

// Skip this file in Jest test runs - it's for manual testing only
describe.skip('StorageService Manual Tests', () => {
  it('placeholder', () => {
    // This is a manual test file
  });
});

/**
 * Test helper to create a mock user
 */
function createMockUser(id: string = 'user-1'): User {
  return {
    id,
    email: `test-${id}@example.com`,
    plan: 'basic',
    createdAt: new Date(),
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    streak: 0,
    streakFreezeUsed: false,
    lastSessionDate: null,
  };
}

/**
 * Test helper to create a mock session
 */
function createMockSession(userId: string = 'user-1', sessionId: string = 'session-1'): CompletedSession {
  return {
    id: sessionId,
    userId,
    questionId: 'q-1',
    questionTitle: 'Two Sum',
    category: 'arrays',
    difficulty: 'easy',
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    endTime: new Date(),
    duration: 2700, // 45 minutes in seconds
    rating: 4,
    perceivedDifficulty: 'medium',
    notes: 'Good practice session',
    pressureModeUsed: false,
  };
}

/**
 * Run all manual tests
 */
export function runStorageServiceTests() {
  console.log('🧪 Starting StorageService Manual Tests...\n');

  try {
    // Clear storage before tests
    StorageService.clearAll();
    console.log('✅ Test 1: clearAll() - Storage cleared successfully');

    // Test 2: Save and retrieve user
    const user1 = createMockUser('user-1');
    StorageService.saveUser(user1);
    const retrievedUser = StorageService.getUser('user-1');
    
    if (retrievedUser && retrievedUser.id === user1.id && retrievedUser.email === user1.email) {
      console.log('✅ Test 2: saveUser() and getUser() - User saved and retrieved successfully');
    } else {
      console.error('❌ Test 2 FAILED: User data mismatch');
    }

    // Test 3: Get non-existent user
    const nonExistentUser = StorageService.getUser('non-existent');
    if (nonExistentUser === null) {
      console.log('✅ Test 3: getUser() with non-existent ID - Returns null correctly');
    } else {
      console.error('❌ Test 3 FAILED: Should return null for non-existent user');
    }

    // Test 4: Save and retrieve session
    const session1 = createMockSession('user-1', 'session-1');
    StorageService.saveSession(session1);
    const sessions = StorageService.getSessions('user-1');
    
    if (sessions.length === 1 && sessions[0].id === session1.id) {
      console.log('✅ Test 4: saveSession() and getSessions() - Session saved and retrieved successfully');
    } else {
      console.error('❌ Test 4 FAILED: Session data mismatch');
    }

    // Test 5: Save multiple sessions
    const session2 = createMockSession('user-1', 'session-2');
    StorageService.saveSession(session2);
    const multipleSessions = StorageService.getSessions('user-1');
    
    if (multipleSessions.length === 2) {
      console.log('✅ Test 5: Multiple sessions - Both sessions saved correctly');
    } else {
      console.error('❌ Test 5 FAILED: Expected 2 sessions, got', multipleSessions.length);
    }

    // Test 6: Get sessions for user with no sessions
    const emptySessions = StorageService.getSessions('user-2');
    if (emptySessions.length === 0) {
      console.log('✅ Test 6: getSessions() for user with no sessions - Returns empty array');
    } else {
      console.error('❌ Test 6 FAILED: Should return empty array');
    }

    // Test 7: Update and retrieve streak
    StorageService.updateStreak('user-1', 5);
    const streak = StorageService.getStreak('user-1');
    
    if (streak === 5) {
      console.log('✅ Test 7: updateStreak() and getStreak() - Streak updated and retrieved successfully');
    } else {
      console.error('❌ Test 7 FAILED: Expected streak 5, got', streak);
    }

    // Test 8: Get streak for user with no streak
    const defaultStreak = StorageService.getStreak('user-3');
    if (defaultStreak === 0) {
      console.log('✅ Test 8: getStreak() for user with no streak - Returns 0 by default');
    } else {
      console.error('❌ Test 8 FAILED: Should return 0 for non-existent streak');
    }

    // Test 9: Update streak to 0 (reset)
    StorageService.updateStreak('user-1', 0);
    const resetStreak = StorageService.getStreak('user-1');
    
    if (resetStreak === 0) {
      console.log('✅ Test 9: updateStreak(0) - Streak reset to 0 successfully');
    } else {
      console.error('❌ Test 9 FAILED: Expected streak 0, got', resetStreak);
    }

    // Test 10: Invalid streak value
    try {
      StorageService.updateStreak('user-1', -1);
      console.error('❌ Test 10 FAILED: Should throw error for negative streak');
    } catch (error) {
      if (error instanceof StorageError) {
        console.log('✅ Test 10: updateStreak() with negative value - Throws StorageError correctly');
      } else {
        console.error('❌ Test 10 FAILED: Wrong error type thrown');
      }
    }

    // Test 11: Data persistence across multiple operations
    const user2 = createMockUser('user-2');
    StorageService.saveUser(user2);
    StorageService.updateStreak('user-2', 10);
    const session3 = createMockSession('user-2', 'session-3');
    StorageService.saveSession(session3);
    
    const persistedUser = StorageService.getUser('user-2');
    const persistedStreak = StorageService.getStreak('user-2');
    const persistedSessions = StorageService.getSessions('user-2');
    
    if (persistedUser && persistedStreak === 10 && persistedSessions.length === 1) {
      console.log('✅ Test 11: Data persistence - All data persisted correctly across operations');
    } else {
      console.error('❌ Test 11 FAILED: Data persistence issue');
    }

    console.log('\n🎉 All StorageService tests completed!');
    
    // Clean up
    StorageService.clearAll();
    console.log('🧹 Test cleanup: Storage cleared');

  } catch (error) {
    console.error('❌ Test suite failed with error:', error);
  }
}

// Export for use in other test files
export { createMockUser, createMockSession };
