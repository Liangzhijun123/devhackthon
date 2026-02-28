'use client';

/**
 * SessionContext - React Context for active session state management
 * Provides session state, timer logic with drift correction, and session control methods
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Session, Question, Feedback, CompletedSession } from '@/types';
import { SessionService } from '@/services/SessionService';
import { useAuth } from './AuthContext';

/**
 * Session context value interface
 */
interface SessionContextValue {
  activeSession: Session | null;
  currentQuestion: Question | null;
  timeRemaining: number;
  isRunning: boolean;
  error: string | null;
  startSession: () => Promise<void>;
  endSession: (feedback: Feedback) => Promise<CompletedSession>;
  updateSession: (updates: Partial<Session>) => void;
  clearError: () => void;
}

/**
 * Create the session context
 */
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

/**
 * SessionProvider component props
 */
interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * SessionProvider component
 * Wraps the application and provides session state with timer logic
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for timer management with drift correction
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const expectedTimeRef = useRef<number | null>(null);

  /**
   * Timer logic with drift correction
   * Uses actual elapsed time to prevent drift from setInterval delays
   */
  useEffect(() => {
    if (!isRunning || !activeSession) {
      return;
    }

    // Initialize timer references
    startTimeRef.current = Date.now();
    expectedTimeRef.current = activeSession.timeRemaining;

    const tick = () => {
      if (!startTimeRef.current || expectedTimeRef.current === null) {
        return;
      }

      // Calculate actual elapsed time
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
      
      // Calculate remaining time with drift correction
      const newTimeRemaining = Math.max(0, expectedTimeRef.current - elapsedSeconds);
      
      setTimeRemaining(newTimeRemaining);

      // Update session state
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });

      // Auto-end session when timer reaches zero (Requirement 2.5)
      if (newTimeRemaining === 0) {
        setIsRunning(false);
        // Note: Auto-redirect to feedback page should be handled by the interview page component
      }
    };

    // Set up interval for updates every second (Requirement 14.2)
    // Don't call tick() immediately - let the interval handle it
    intervalRef.current = setInterval(tick, 1000);

    // Cleanup on unmount or when timer stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, activeSession]);

  /**
   * Start a new interview session
   * Initializes session with 45-minute timer (Requirement 2.1)
   */
  const startSession = useCallback(async () => {
    if (!user) {
      const errorMessage = 'No user logged in';
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setError(null);

    try {
      // Start session through service
      const session = SessionService.startSession(user.id, user.plan);
      
      // Get the question for this session
      const question = SessionService.getRandomQuestion(user.plan, []);
      
      setActiveSession(session);
      setCurrentQuestion(question);
      setTimeRemaining(session.timeRemaining);
      setIsRunning(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start session';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * End the active session with feedback
   * Completes session and saves to storage (Requirement 2.4)
   */
  const endSession = useCallback(async (feedback: Feedback): Promise<CompletedSession> => {
    if (!activeSession) {
      const errorMessage = 'No active session to end';
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setError(null);

    try {
      // Stop the timer
      setIsRunning(false);

      // End session through service
      const completedSession = SessionService.endSession(activeSession, feedback);

      // Clear active session state
      setActiveSession(null);
      setCurrentQuestion(null);
      setTimeRemaining(0);

      return completedSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
      setError(errorMessage);
      throw err;
    }
  }, [activeSession]);

  /**
   * Update session properties (e.g., pressure mode, hint revealed)
   */
  const updateSession = useCallback((updates: Partial<Session>) => {
    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
      };
    });
  }, []);

  /**
   * Clear error handler
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: SessionContextValue = {
    activeSession,
    currentQuestion,
    timeRemaining,
    isRunning,
    error,
    startSession,
    endSession,
    updateSession,
    clearError,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/**
 * useSession hook
 * Custom hook to consume the session context
 * @throws Error if used outside of SessionProvider
 */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}
