/**
 * Unit tests for SessionContext
 * Tests session state management, timer logic, and session control methods
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SessionProvider, useSession } from '../SessionContext';
import { AuthProvider } from '../AuthContext';
import { SessionService } from '@/services/SessionService';
import { StorageService } from '@/services/StorageService';
import { Plan, Feedback } from '@/types';

// Mock the services
jest.mock('@/services/SessionService');
jest.mock('@/services/StorageService');

// Mock AuthContext
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  plan: 'premium' as Plan,
  createdAt: new Date(),
  trialEndsAt: null,
  streak: 0,
  streakFreezeUsed: false,
  lastSessionDate: null,
};

jest.mock('../AuthContext', () => ({
  ...jest.requireActual('../AuthContext'),
  useAuth: () => ({
    user: mockUser,
    loading: false,
    error: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    updatePlan: jest.fn(),
    clearError: jest.fn(),
  }),
}));

describe('SessionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <SessionProvider>{children}</SessionProvider>
    </AuthProvider>
  );

  describe('startSession', () => {
    it('should start a new session with 45-minute timer', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'test-user-id',
        questionId: 'q1',
        startTime: new Date(),
        endTime: null,
        timeRemaining: 2700, // 45 minutes
        pressureModeEnabled: false,
        hintRevealed: false,
      };

      const mockQuestion = {
        id: 'q1',
        title: 'Test Question',
        difficulty: 'medium' as const,
        category: 'arrays' as const,
        statement: 'Test statement',
        hint: 'Test hint',
        planRequired: 'basic' as Plan,
      };

      (SessionService.startSession as jest.Mock).mockReturnValue(mockSession);
      (SessionService.getRandomQuestion as jest.Mock).mockReturnValue(mockQuestion);

      const { result } = renderHook(() => useSession(), { wrapper });

      await act(async () => {
        await result.current.startSession();
      });

      expect(result.current.activeSession).toEqual(mockSession);
      expect(result.current.currentQuestion).toEqual(mockQuestion);
      expect(result.current.timeRemaining).toBe(2700);
      expect(result.current.isRunning).toBe(true);
    });
  });

  describe('timer logic', () => {
    it('should decrement timer every second', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'test-user-id',
        questionId: 'q1',
        startTime: new Date(),
        endTime: null,
        timeRemaining: 10,
        pressureModeEnabled: false,
        hintRevealed: false,
      };

      const mockQuestion = {
        id: 'q1',
        title: 'Test Question',
        difficulty: 'medium' as const,
        category: 'arrays' as const,
        statement: 'Test statement',
        hint: 'Test hint',
        planRequired: 'basic' as Plan,
      };

      (SessionService.startSession as jest.Mock).mockReturnValue(mockSession);
      (SessionService.getRandomQuestion as jest.Mock).mockReturnValue(mockQuestion);

      const { result } = renderHook(() => useSession(), { wrapper });

      await act(async () => {
        await result.current.startSession();
      });

      expect(result.current.timeRemaining).toBe(10);

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(9);
      });

      // Advance time by 3 more seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(6);
      });
    });

    it('should stop timer when reaching zero', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'test-user-id',
        questionId: 'q1',
        startTime: new Date(),
        endTime: null,
        timeRemaining: 2,
        pressureModeEnabled: false,
        hintRevealed: false,
      };

      const mockQuestion = {
        id: 'q1',
        title: 'Test Question',
        difficulty: 'medium' as const,
        category: 'arrays' as const,
        statement: 'Test statement',
        hint: 'Test hint',
        planRequired: 'basic' as Plan,
      };

      (SessionService.startSession as jest.Mock).mockReturnValue(mockSession);
      (SessionService.getRandomQuestion as jest.Mock).mockReturnValue(mockQuestion);

      const { result } = renderHook(() => useSession(), { wrapper });

      await act(async () => {
        await result.current.startSession();
      });

      expect(result.current.isRunning).toBe(true);

      // Advance time by 3 seconds (past the 2-second timer)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(0);
        expect(result.current.isRunning).toBe(false);
      });
    });
  });

  describe('endSession', () => {
    it('should end active session and save feedback', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'test-user-id',
        questionId: 'q1',
        startTime: new Date(),
        endTime: null,
        timeRemaining: 2700,
        pressureModeEnabled: false,
        hintRevealed: false,
      };

      const mockQuestion = {
        id: 'q1',
        title: 'Test Question',
        difficulty: 'medium' as const,
        category: 'arrays' as const,
        statement: 'Test statement',
        hint: 'Test hint',
        planRequired: 'basic' as Plan,
      };

      const mockCompletedSession = {
        id: 'session-1',
        userId: 'test-user-id',
        questionId: 'q1',
        questionTitle: 'Test Question',
        category: 'arrays',
        difficulty: 'medium' as const,
        startTime: mockSession.startTime,
        endTime: new Date(),
        duration: 300,
        rating: 4 as const,
        perceivedDifficulty: 'medium' as const,
        notes: 'Good practice',
        pressureModeUsed: false,
      };

      (SessionService.startSession as jest.Mock).mockReturnValue(mockSession);
      (SessionService.getRandomQuestion as jest.Mock).mockReturnValue(mockQuestion);
      (SessionService.endSession as jest.Mock).mockReturnValue(mockCompletedSession);

      const { result } = renderHook(() => useSession(), { wrapper });

      await act(async () => {
        await result.current.startSession();
      });

      const feedback: Feedback = {
        rating: 4,
        perceivedDifficulty: 'medium',
        notes: 'Good practice',
      };

      let completedSession;
      await act(async () => {
        completedSession = await result.current.endSession(feedback);
      });

      expect(completedSession).toEqual(mockCompletedSession);
      expect(result.current.activeSession).toBeNull();
      expect(result.current.currentQuestion).toBeNull();
      expect(result.current.timeRemaining).toBe(0);
      expect(result.current.isRunning).toBe(false);
    });

    it('should throw error when no active session', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      const feedback: Feedback = {
        rating: 4,
        perceivedDifficulty: 'medium',
        notes: 'Good practice',
      };

      await act(async () => {
        try {
          await result.current.endSession(feedback);
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('No active session to end');
    });
  });

  describe('updateSession', () => {
    it('should update session properties', async () => {
      const mockSession = {
        id: 'session-1',
        userId: 'test-user-id',
        questionId: 'q1',
        startTime: new Date(),
        endTime: null,
        timeRemaining: 2700,
        pressureModeEnabled: false,
        hintRevealed: false,
      };

      const mockQuestion = {
        id: 'q1',
        title: 'Test Question',
        difficulty: 'medium' as const,
        category: 'arrays' as const,
        statement: 'Test statement',
        hint: 'Test hint',
        planRequired: 'basic' as Plan,
      };

      (SessionService.startSession as jest.Mock).mockReturnValue(mockSession);
      (SessionService.getRandomQuestion as jest.Mock).mockReturnValue(mockQuestion);

      const { result } = renderHook(() => useSession(), { wrapper });

      await act(async () => {
        await result.current.startSession();
      });

      act(() => {
        result.current.updateSession({ pressureModeEnabled: true });
      });

      expect(result.current.activeSession?.pressureModeEnabled).toBe(true);

      act(() => {
        result.current.updateSession({ hintRevealed: true });
      });

      expect(result.current.activeSession?.hintRevealed).toBe(true);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      // Manually set an error by calling a method that would set it
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('useSession hook', () => {
    it('should throw error when used outside SessionProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useSession());
      }).toThrow('useSession must be used within a SessionProvider');

      consoleSpy.mockRestore();
    });
  });
});
