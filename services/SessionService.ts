/**
 * SessionService - Manages interview session lifecycle
 * Handles session creation, question selection, and session completion
 */

import { Session, CompletedSession, Feedback, Plan, Question } from '@/types';
import { getQuestionsByPlan } from '@/lib/questions';
import { StorageService } from './StorageService';

/**
 * Error types for session operations
 */
export class SessionError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'SessionError';
  }
}

/**
 * Session management service
 */
export class SessionService {
  private static readonly TIMER_DURATION = 2700; // 45 minutes in seconds
  private static readonly WEEKLY_LIMIT_BASIC = 3;

  /**
   * Start a new interview session
   * @throws SessionError if weekly limit exceeded for Basic plan
   */
  static startSession(userId: string, plan: Plan): Session {
    // Check weekly limit for Basic plan
    if (plan === 'basic') {
      const weekStart = this.getWeekStart(new Date());
      const sessions = StorageService.getSessions(userId);
      const weekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= weekStart;
      });

      if (weekSessions.length >= this.WEEKLY_LIMIT_BASIC) {
        throw new SessionError(
          `Basic plan users are limited to ${this.WEEKLY_LIMIT_BASIC} interviews per week`
        );
      }
    }

    // Get questions used today to avoid repetition
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessions = StorageService.getSessions(userId);
    const todaySessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
    const usedQuestionIds = todaySessions.map(s => s.questionId);

    // Select a random question
    const question = this.getRandomQuestion(plan, usedQuestionIds);

    // Create new session
    const session: Session = {
      id: this.generateId(),
      userId,
      questionId: question.id,
      startTime: new Date(),
      endTime: null,
      timeRemaining: this.TIMER_DURATION,
      pressureModeEnabled: false,
      hintRevealed: false,
    };

    return session;
  }

  /**
   * Get a random question from the available bank
   * @throws SessionError if no questions available
   */
  static getRandomQuestion(plan: Plan, excludeIds: string[] = []): Question {
    const availableQuestions = getQuestionsByPlan(plan);
    
    // Filter out excluded questions
    const filteredQuestions = availableQuestions.filter(
      q => !excludeIds.includes(q.id)
    );

    // If all questions used today, allow repetition
    const questionsToUse = filteredQuestions.length > 0 
      ? filteredQuestions 
      : availableQuestions;

    if (questionsToUse.length === 0) {
      throw new SessionError('No questions available for this plan');
    }

    // Select random question
    const randomIndex = Math.floor(Math.random() * questionsToUse.length);
    return questionsToUse[randomIndex];
  }

  /**
   * End an active session and save with feedback
   */
  static endSession(
    session: Session,
    feedback: Feedback
  ): CompletedSession {
    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000
    );

    // Get question details
    const { getQuestionById } = require('@/lib/questions');
    const question = getQuestionById(session.questionId);

    if (!question) {
      throw new SessionError('Question not found');
    }

    const completedSession: CompletedSession = {
      id: session.id,
      userId: session.userId,
      questionId: session.questionId,
      questionTitle: question.title,
      category: question.category,
      difficulty: question.difficulty,
      startTime: session.startTime,
      endTime,
      duration,
      rating: feedback.rating,
      perceivedDifficulty: feedback.perceivedDifficulty,
      notes: feedback.notes,
      pressureModeUsed: session.pressureModeEnabled,
    };

    // Save the completed session
    StorageService.saveSession(completedSession);

    return completedSession;
  }

  /**
   * Get current active session for a user
   */
  static getCurrentSession(userId: string): Session | null {
    // In a real implementation, this would track active sessions
    // For now, return null as sessions are managed in React context
    return null;
  }

  /**
   * Get session history for a user with plan-based filtering
   */
  static getSessionHistory(userId: string, plan: Plan): CompletedSession[] {
    const allSessions = StorageService.getSessions(userId);
    
    // Sort by date descending (most recent first)
    const sortedSessions = allSessions.sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );

    // Apply plan-based limits
    if (plan === 'basic') {
      return sortedSessions.slice(0, 5);
    }

    return sortedSessions;
  }

  /**
   * Get the start of the current week (Sunday at 00:00:00)
   */
  private static getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    weekStart.setHours(0, 0, 0, 0);
    const dayOfWeek = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - dayOfWeek);
    return weekStart;
  }

  /**
   * Generate a unique ID for sessions
   */
  private static generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all session data (for testing)
   */
  static clearAll(): void {
    StorageService.clearAll();
  }
}
