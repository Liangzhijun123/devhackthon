/**
 * Core TypeScript type definitions for Interview Buddy Platform
 * Defines all interfaces and types used throughout the application
 */

// ============================================================================
// Plan Types
// ============================================================================

export type Plan = 'basic' | 'premium' | 'pro';

// ============================================================================
// User Interface
// ============================================================================

export interface User {
  id: string;
  email: string;
  plan: Plan;
  createdAt: Date;
  trialEndsAt: Date | null;  // For basic plan 30-day trial
  streak: number;
  streakFreezeUsed: boolean;  // Resets weekly for Pro users
  lastSessionDate: Date | null;
}

// ============================================================================
// Question Interface
// ============================================================================

export interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'arrays' | 'trees' | 'graphs' | 'dynamic-programming' | 'strings' | 'system-design' | 'behavioral';
  statement: string;
  hint: string;
  planRequired: Plan;
}

// ============================================================================
// Session Interfaces
// ============================================================================

export interface Session {
  id: string;
  userId: string;
  questionId: string;
  startTime: Date;
  endTime: Date | null;
  timeRemaining: number;  // in seconds
  pressureModeEnabled: boolean;
  hintRevealed: boolean;
}

export interface CompletedSession {
  id: string;
  userId: string;
  questionId: string;
  questionTitle: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startTime: Date;
  endTime: Date;
  duration: number;  // in seconds
  rating: 1 | 2 | 3 | 4 | 5;
  perceivedDifficulty: 'easy' | 'medium' | 'hard';
  notes: string;
  pressureModeUsed: boolean;
}

// ============================================================================
// Feedback Interface
// ============================================================================

export interface Feedback {
  rating: 1 | 2 | 3 | 4 | 5;
  perceivedDifficulty: 'easy' | 'medium' | 'hard';
  notes: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface WeeklyStats {
  weekStart: Date;
  weekEnd: Date;
  sessionsCompleted: number;
  averageRating: number;
  categoriesPracticed: string[];
  comparisonToPreviousWeek: {
    sessionsDelta: number;
    ratingDelta: number;
  };
}

export interface CategoryPerformance {
  category: string;
  sessionsCount: number;
  averageRating: number;
  isWeakest: boolean;
}

export interface ReadinessScore {
  overall: number;  // 0-100
  breakdown: {
    recentActivity: number;  // 0-100
    performance: number;  // 0-100
    consistency: number;  // 0-100
  };
  recommendations: string[];
}
