/**
 * AnalyticsService
 * Handles analytics calculations including streaks, weekly stats, and performance metrics
 */

import { CompletedSession, WeeklyStats, CategoryPerformance, ReadinessScore } from '@/types';

/**
 * Custom error class for analytics-related errors
 */
export class AnalyticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyticsError';
  }
}

/**
 * AnalyticsService class
 * Provides methods for calculating user analytics and performance metrics
 */
export class AnalyticsService {
  /**
   * Calculate the current streak for a user based on their session history
   * 
   * @param userId - The user's ID
   * @param sessions - Array of completed sessions
   * @returns The current streak count
   */
  static calculateStreak(userId: string, sessions: CompletedSession[]): number {
    // Filter sessions for this user and sort by date (most recent first)
    const userSessions = sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    if (userSessions.length === 0) {
      return 0;
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's a session today or yesterday
    const mostRecentSession = new Date(userSessions[0].startTime);
    mostRecentSession.setHours(0, 0, 0, 0);

    const daysSinceLastSession = Math.floor(
      (today.getTime() - mostRecentSession.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If last session was more than 1 day ago, streak is broken
    if (daysSinceLastSession > 1) {
      return 0;
    }

    // Count consecutive days with sessions
    let currentDate = new Date(mostRecentSession);
    const sessionDates = new Set(
      userSessions.map(s => {
        const d = new Date(s.startTime);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    while (sessionDates.has(currentDate.getTime())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  /**
   * Get weekly statistics for a user
   * 
   * @param userId - The user's ID
   * @param sessions - Array of completed sessions
   * @returns Weekly statistics
   */
  static getWeeklyStats(userId: string, sessions: CompletedSession[]): WeeklyStats {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of current week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(weekStart.getDate() - 7);

    const previousWeekEnd = new Date(weekStart);
    previousWeekEnd.setMilliseconds(-1);

    // Filter sessions for current week
    const currentWeekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return (
        s.userId === userId &&
        sessionDate >= weekStart &&
        sessionDate <= weekEnd
      );
    });

    // Filter sessions for previous week
    const previousWeekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return (
        s.userId === userId &&
        sessionDate >= previousWeekStart &&
        sessionDate <= previousWeekEnd
      );
    });

    // Calculate current week stats
    const sessionsCompleted = currentWeekSessions.length;
    const averageRating =
      sessionsCompleted > 0
        ? currentWeekSessions.reduce((sum, s) => sum + s.rating, 0) / sessionsCompleted
        : 0;

    const categoriesPracticed = [
      ...new Set(currentWeekSessions.map(s => s.category)),
    ];

    // Calculate previous week stats for comparison
    const previousSessionsCompleted = previousWeekSessions.length;
    const previousAverageRating =
      previousSessionsCompleted > 0
        ? previousWeekSessions.reduce((sum, s) => sum + s.rating, 0) / previousSessionsCompleted
        : 0;

    return {
      weekStart,
      weekEnd,
      sessionsCompleted,
      averageRating,
      categoriesPracticed,
      comparisonToPreviousWeek: {
        sessionsDelta: sessionsCompleted - previousSessionsCompleted,
        ratingDelta: averageRating - previousAverageRating,
      },
    };
  }

  /**
   * Get performance breakdown by category
   * 
   * @param sessions - Array of completed sessions
   * @returns Array of category performance data
   */
  static getPerformanceByCategory(sessions: CompletedSession[]): CategoryPerformance[] {
    // Group sessions by category
    const categoryMap = new Map<string, { ratings: number[]; count: number }>();

    sessions.forEach(session => {
      const existing = categoryMap.get(session.category) || { ratings: [], count: 0 };
      existing.ratings.push(session.rating);
      existing.count++;
      categoryMap.set(session.category, existing);
    });

    // Calculate average rating per category
    const performances: CategoryPerformance[] = [];
    categoryMap.forEach((data, category) => {
      const averageRating = data.ratings.reduce((sum, r) => sum + r, 0) / data.count;
      performances.push({
        category,
        sessionsCount: data.count,
        averageRating,
        isWeakest: false,
      });
    });

    // Identify weakest category (lowest average rating)
    if (performances.length > 0) {
      const weakest = performances.reduce((min, p) =>
        p.averageRating < min.averageRating ? p : min
      );
      weakest.isWeakest = true;
    }

    return performances;
  }

  /**
   * Calculate interview readiness score
   * 
   * @param userId - The user's ID
   * @param sessions - Array of completed sessions
   * @param streak - Current streak count
   * @returns Readiness score with breakdown
   */
  static calculateReadinessScore(
    userId: string,
    sessions: CompletedSession[],
    streak: number
  ): ReadinessScore {
    const userSessions = sessions.filter(s => s.userId === userId);

    // Calculate recent activity score (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = userSessions.filter(
      s => new Date(s.startTime) >= sevenDaysAgo
    );
    const recentActivity = Math.min(100, (recentSessions.length / 7) * 100);

    // Calculate performance score (average rating)
    const averageRating =
      userSessions.length > 0
        ? userSessions.reduce((sum, s) => sum + s.rating, 0) / userSessions.length
        : 0;
    const performance = (averageRating / 5) * 100;

    // Calculate consistency score (based on streak)
    const consistency = Math.min(100, (streak / 30) * 100);

    // Calculate overall score (weighted average)
    const overall = Math.round(
      recentActivity * 0.4 + performance * 0.4 + consistency * 0.2
    );

    // Generate recommendations
    const recommendations: string[] = [];
    if (recentActivity < 50) {
      recommendations.push('Increase practice frequency to build momentum');
    }
    if (performance < 60) {
      recommendations.push('Focus on understanding problem patterns');
    }
    if (consistency < 50) {
      recommendations.push('Build a daily practice habit for better retention');
    }
    if (overall >= 80) {
      recommendations.push("You're interview ready! Keep up the great work");
    }

    return {
      overall,
      breakdown: {
        recentActivity: Math.round(recentActivity),
        performance: Math.round(performance),
        consistency: Math.round(consistency),
      },
      recommendations,
    };
  }

  /**
   * Get the weakest category for a user
   * 
   * @param sessions - Array of completed sessions
   * @returns The category with the lowest average rating
   */
  static getWeakestCategory(sessions: CompletedSession[]): string {
    const performances = this.getPerformanceByCategory(sessions);

    if (performances.length === 0) {
      throw new AnalyticsError('No sessions available to determine weakest category');
    }

    const weakest = performances.find(p => p.isWeakest);
    return weakest?.category || '';
  }
}
