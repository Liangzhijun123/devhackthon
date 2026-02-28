'use client';

/**
 * QuickActions Component
 * Provides prominent action buttons for starting interviews and navigating to key pages
 * 
 * Requirements:
 * - 7.4: Prominent "Start Mock Interview" button with weekly limit check
 * - Secondary navigation to history and analytics
 */

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { StorageService } from '@/services/StorageService';

export function QuickActions() {
  const { user } = useAuth();
  const router = useRouter();

  // Check weekly limit for Basic users
  const weeklyLimitStatus = useMemo(() => {
    if (!user) {
      return { canStart: false, sessionsThisWeek: 0, limit: 3 };
    }

    if (user.plan !== 'basic') {
      return { canStart: true, sessionsThisWeek: 0, limit: null };
    }

    // Calculate sessions this week for Basic users
    const weekStart = getWeekStart(new Date());
    const sessions = StorageService.getSessions(user.id);
    const weekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= weekStart;
    });

    const sessionsThisWeek = weekSessions.length;
    const limit = 3;
    const canStart = sessionsThisWeek < limit;

    return { canStart, sessionsThisWeek, limit };
  }, [user]);

  const handleStartInterview = () => {
    if (!weeklyLimitStatus.canStart) {
      // Show upgrade prompt for Basic users who hit the limit
      router.push('/pricing');
      return;
    }
    router.push('/interview');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
      
      <div className="space-y-4">
        {/* Primary Action: Start Mock Interview */}
        <div>
          <button
            onClick={handleStartInterview}
            disabled={!weeklyLimitStatus.canStart}
            className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              weeklyLimitStatus.canStart
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Start Mock Interview
          </button>
          
          {/* Weekly limit indicator for Basic users */}
          {user.plan === 'basic' && weeklyLimitStatus.limit && (
            <div className="mt-2 text-center">
              <p className="text-sm text-slate-400">
                {weeklyLimitStatus.canStart ? (
                  <>
                    {weeklyLimitStatus.sessionsThisWeek} of {weeklyLimitStatus.limit} interviews used this week
                  </>
                ) : (
                  <span className="text-orange-400 font-medium">
                    Weekly limit reached. Upgrade for unlimited interviews.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* View History */}
          <Link
            href="/history"
            className="flex items-center justify-center px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-600 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View History
          </Link>

          {/* View Analytics */}
          <Link
            href="/analytics"
            className="flex items-center justify-center px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-600 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Get the start of the current week (Sunday at 00:00:00)
 */
function getWeekStart(date: Date): Date {
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  const dayOfWeek = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - dayOfWeek);
  return weekStart;
}
