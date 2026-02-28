'use client';

/**
 * DashboardHeader Component
 * Displays user stats and plan information at the top of the dashboard
 * 
 * Requirements:
 * - 7.1: Display current streak with fire emoji
 * - 7.2: Show weekly session count
 * - 7.3: Display plan badge
 * - 7.6: Add upgrade button for Basic users
 */

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsService } from '@/services/AnalyticsService';
import { StorageService } from '@/services/StorageService';

export function DashboardHeader() {
  const { user } = useAuth();

  // Calculate streak and weekly stats
  const stats = useMemo(() => {
    if (!user) {
      return { streak: 0, weeklySessionCount: 0 };
    }

    const sessions = StorageService.getSessions(user.id);
    const streak = AnalyticsService.calculateStreak(user.id, sessions);
    const weeklyStats = AnalyticsService.getWeeklyStats(user.id, sessions);

    return {
      streak,
      weeklySessionCount: weeklyStats.sessionsCompleted,
    };
  }, [user]);

  if (!user) {
    return null;
  }

  // Plan badge styling - Dark Blue Theme
  const planBadgeStyles = {
    basic: 'bg-slate-700 text-slate-200 border-slate-600',
    premium: 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
    pro: 'bg-purple-900/50 text-purple-300 border-purple-700',
  };

  const planBadgeStyle = planBadgeStyles[user.plan];

  return (
    <div className="holo-card rounded-lg shadow-lg p-6 glow-border cyber-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Stats Section */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Streak Display - Requirement 7.1 */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {stats.streak}
              </div>
              <div className="text-sm text-slate-400 terminal-text">// Day Streak</div>
            </div>
          </div>

          {/* Weekly Session Count - Requirement 7.2 */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 holo-card rounded-full flex items-center justify-center border border-blue-700">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {stats.weeklySessionCount}
              </div>
              <div className="text-sm text-slate-400 terminal-text">// This Week</div>
            </div>
          </div>

          {/* Plan Badge - Requirement 7.3 */}
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${planBadgeStyle}`}
            >
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
            </span>
          </div>
        </div>

        {/* Upgrade Button for Basic Users - Requirement 7.6 */}
        {user.plan === 'basic' && (
          <div className="flex items-center">
            <Link
              href="/pricing"
              className="inline-flex items-center neon-button px-4 py-2 text-white font-medium rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Upgrade Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
