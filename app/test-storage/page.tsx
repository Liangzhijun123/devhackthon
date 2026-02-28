'use client';

import { useEffect, useState } from 'react';
import { StorageService } from '@/services';
import { User, CompletedSession } from '@/types';

/**
 * Test page for StorageService
 * Navigate to /test-storage to run tests in the browser
 */
export default function TestStoragePage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const createMockUser = (id: string = 'user-1'): User => {
    return {
      id,
      email: `test-${id}@example.com`,
      plan: 'basic',
      createdAt: new Date(),
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      streak: 0,
      streakFreezeUsed: false,
      lastSessionDate: null,
    };
  };

  const createMockSession = (userId: string = 'user-1', sessionId: string = 'session-1'): CompletedSession => {
    return {
      id: sessionId,
      userId,
      questionId: 'q-1',
      questionTitle: 'Two Sum',
      category: 'arrays',
      difficulty: 'easy',
      startTime: new Date(Date.now() - 45 * 60 * 1000),
      endTime: new Date(),
      duration: 2700,
      rating: 4,
      perceivedDifficulty: 'medium',
      notes: 'Good practice session',
      pressureModeUsed: false,
    };
  };

  const runTests = () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('🧪 Starting StorageService Tests...\n');

    try {
      // Test 1: Clear storage
      StorageService.clearAll();
      addResult('✅ Test 1: clearAll() - Storage cleared successfully');

      // Test 2: Save and retrieve user
      const user1 = createMockUser('user-1');
      StorageService.saveUser(user1);
      const retrievedUser = StorageService.getUser('user-1');
      
      if (retrievedUser && retrievedUser.id === user1.id && retrievedUser.email === user1.email) {
        addResult('✅ Test 2: saveUser() and getUser() - User saved and retrieved successfully');
      } else {
        addResult('❌ Test 2 FAILED: User data mismatch');
      }

      // Test 3: Get non-existent user
      const nonExistentUser = StorageService.getUser('non-existent');
      if (nonExistentUser === null) {
        addResult('✅ Test 3: getUser() with non-existent ID - Returns null correctly');
      } else {
        addResult('❌ Test 3 FAILED: Should return null for non-existent user');
      }

      // Test 4: Save and retrieve session
      const session1 = createMockSession('user-1', 'session-1');
      StorageService.saveSession(session1);
      const sessions = StorageService.getSessions('user-1');
      
      if (sessions.length === 1 && sessions[0].id === session1.id) {
        addResult('✅ Test 4: saveSession() and getSessions() - Session saved and retrieved successfully');
      } else {
        addResult('❌ Test 4 FAILED: Session data mismatch');
      }

      // Test 5: Save multiple sessions
      const session2 = createMockSession('user-1', 'session-2');
      StorageService.saveSession(session2);
      const multipleSessions = StorageService.getSessions('user-1');
      
      if (multipleSessions.length === 2) {
        addResult('✅ Test 5: Multiple sessions - Both sessions saved correctly');
      } else {
        addResult(`❌ Test 5 FAILED: Expected 2 sessions, got ${multipleSessions.length}`);
      }

      // Test 6: Get sessions for user with no sessions
      const emptySessions = StorageService.getSessions('user-2');
      if (emptySessions.length === 0) {
        addResult('✅ Test 6: getSessions() for user with no sessions - Returns empty array');
      } else {
        addResult('❌ Test 6 FAILED: Should return empty array');
      }

      // Test 7: Update and retrieve streak
      StorageService.updateStreak('user-1', 5);
      const streak = StorageService.getStreak('user-1');
      
      if (streak === 5) {
        addResult('✅ Test 7: updateStreak() and getStreak() - Streak updated and retrieved successfully');
      } else {
        addResult(`❌ Test 7 FAILED: Expected streak 5, got ${streak}`);
      }

      // Test 8: Get streak for user with no streak
      const defaultStreak = StorageService.getStreak('user-3');
      if (defaultStreak === 0) {
        addResult('✅ Test 8: getStreak() for user with no streak - Returns 0 by default');
      } else {
        addResult('❌ Test 8 FAILED: Should return 0 for non-existent streak');
      }

      // Test 9: Update streak to 0 (reset)
      StorageService.updateStreak('user-1', 0);
      const resetStreak = StorageService.getStreak('user-1');
      
      if (resetStreak === 0) {
        addResult('✅ Test 9: updateStreak(0) - Streak reset to 0 successfully');
      } else {
        addResult(`❌ Test 9 FAILED: Expected streak 0, got ${resetStreak}`);
      }

      // Test 10: Invalid streak value
      try {
        StorageService.updateStreak('user-1', -1);
        addResult('❌ Test 10 FAILED: Should throw error for negative streak');
      } catch (error) {
        if (error instanceof Error && error.name === 'StorageError') {
          addResult('✅ Test 10: updateStreak() with negative value - Throws StorageError correctly');
        } else {
          addResult('❌ Test 10 FAILED: Wrong error type thrown');
        }
      }

      // Test 11: Data persistence
      const user2 = createMockUser('user-2');
      StorageService.saveUser(user2);
      StorageService.updateStreak('user-2', 10);
      const session3 = createMockSession('user-2', 'session-3');
      StorageService.saveSession(session3);
      
      const persistedUser = StorageService.getUser('user-2');
      const persistedStreak = StorageService.getStreak('user-2');
      const persistedSessions = StorageService.getSessions('user-2');
      
      if (persistedUser && persistedStreak === 10 && persistedSessions.length === 1) {
        addResult('✅ Test 11: Data persistence - All data persisted correctly across operations');
      } else {
        addResult('❌ Test 11 FAILED: Data persistence issue');
      }

      addResult('\n🎉 All StorageService tests completed!');
      
      // Clean up
      StorageService.clearAll();
      addResult('🧹 Test cleanup: Storage cleared');

    } catch (error) {
      addResult(`❌ Test suite failed with error: ${error}`);
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run tests on mount
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">StorageService Test Suite</h1>
        
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests Again'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="font-mono text-sm space-y-1">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet...</p>
            ) : (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className={`${
                    result.includes('✅') ? 'text-green-600' :
                    result.includes('❌') ? 'text-red-600' :
                    result.includes('🧪') || result.includes('🎉') ? 'text-blue-600 font-bold' :
                    'text-gray-700'
                  }`}
                >
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">About This Test Page</h3>
          <p className="text-blue-800 text-sm">
            This page tests the StorageService class which wraps localStorage operations.
            It verifies user storage, session storage, streak tracking, error handling,
            and data validation. All tests run automatically when you load this page.
          </p>
        </div>
      </div>
    </div>
  );
}
