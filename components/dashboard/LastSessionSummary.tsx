'use client';

/**
 * LastSessionSummary Component
 * Displays a summary of the user's most recent completed session
 * 
 * Requirements:
 * - 7.5: Display most recent session details
 * - Show question title, rating, date
 * - Link to full session in history
 */

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { StorageService } from '@/services/StorageService';
import { CompletedSession } from '@/types';

export function LastSessionSummary() {
  const { user } = useAuth();

  // Get the most recent session
  const lastSession = useMemo<CompletedSession | null>(() => {
    if (!user) {
      return null;
    }

    const sessions = StorageService.getSessions(user.id);
    if (sessions.length === 0) {
      return null;
    }

    // Sessions are already sorted by date descending in StorageService
    return sessions[0];
  }, [user]);

  if (!user) {
    return null;
  }

  // Empty state when no sessions exist
  if (!lastSession) {
    return (
      <div className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Last Session</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600">
            <svg
              className="w-8 h-8 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">No sessions completed yet</p>
          <p className="text-slate-500 text-xs mt-1">Start your first mock interview to see your progress</p>
        </div>
      </div>
    );
  }

  // Format the date
  const sessionDate = new Date(lastSession.startTime);
  const formattedDate = formatRelativeDate(sessionDate);

  // Difficulty badge styling - Dark Blue Theme
  const difficultyStyles = {
    easy: 'bg-green-900/50 text-green-300 border-green-700',
    medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    hard: 'bg-red-900/50 text-red-300 border-red-700',
  };

  const difficultyStyle = difficultyStyles[lastSession.difficulty];

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Last Session</h2>
        <Link
          href="/history"
          className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {/* Question Title */}
        <div>
          <h3 className="text-base font-medium text-slate-100 mb-1">
            {lastSession.questionTitle}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium border ${difficultyStyle}`}
            >
              {lastSession.difficulty.charAt(0).toUpperCase() + lastSession.difficulty.slice(1)}
            </span>
            <span className="text-xs text-slate-400">
              {lastSession.category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </div>
        </div>

        {/* Rating Display */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Your Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= lastSession.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
            <span className="ml-1 text-sm font-medium text-slate-300">
              {lastSession.rating}/5
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formattedDate}</span>
        </div>

        {/* Notes Preview (if available) */}
        {lastSession.notes && lastSession.notes.trim() !== '' && (
          <div className="pt-3 border-t border-slate-700">
            <p className="text-sm text-slate-400 line-clamp-2">
              <span className="font-medium text-slate-300">Notes:</span> {lastSession.notes}
            </p>
          </div>
        )}

        {/* Link to Full Details */}
        <div className="pt-2">
          <Link
            href="/history"
            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            View Full Details
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Format a date as a relative time string (e.g., "Today", "Yesterday", "2 days ago")
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else {
    // Format as date for older sessions
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}
