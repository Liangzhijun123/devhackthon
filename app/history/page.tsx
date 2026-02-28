'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { StorageService } from "@/services/StorageService";
import { useMemo } from "react";

export default function HistoryPage() {
  const { user } = useAuth();

  // Get real sessions from localStorage
  const sessions = useMemo(() => {
    if (!user) return [];
    
    const allSessions = StorageService.getSessions(user.id);
    
    // Apply plan-based limits
    if (user.plan === 'basic') {
      return allSessions.slice(0, 5); // Last 5 sessions only
    }
    
    return allSessions; // All sessions for Premium/Pro
  }, [user]);

  if (!user) return null;

  const difficultyColors = {
    easy: 'bg-green-900/50 text-green-300 border-green-700',
    medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    hard: 'bg-red-900/50 text-red-300 border-red-700',
  };

  const formatRelativeDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Session History</h1>
              <p className="text-slate-400 mt-1">
                {user.plan === 'basic' && 'Showing last 5 sessions (Basic plan limit)'}
                {user.plan === 'premium' && 'All your interview sessions'}
                {user.plan === 'pro' && 'Complete session history with advanced insights'}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium text-sm border border-slate-700">
                All
              </button>
              <button className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg font-medium text-sm border border-slate-700">
                Easy
              </button>
              <button className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg font-medium text-sm border border-slate-700">
                Medium
              </button>
              <button className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg font-medium text-sm border border-slate-700">
                Hard
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Total Sessions</div>
              <div className="text-2xl font-bold text-white mt-1">{sessions.length}</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Average Rating</div>
              <div className="text-2xl font-bold text-white mt-1">
                {(sessions.reduce((acc, s) => acc + s.rating, 0) / sessions.length).toFixed(1)}
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Avg Duration</div>
              <div className="text-2xl font-bold text-white mt-1">40 min</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-slate-400">This Week</div>
              <div className="text-2xl font-bold text-white mt-1">
                {user.plan === 'basic' ? '2' : user.plan === 'premium' ? '5' : '8'}
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Question</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Difficulty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Date</th>
                    {user.plan === 'pro' && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Mode</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={user.plan === 'pro' ? 7 : 6} className="px-6 py-12 text-center">
                        <div className="text-slate-400">
                          <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium">No sessions yet</p>
                          <p className="text-sm mt-1">Complete your first mock interview to see your history</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{session.questionTitle}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[session.difficulty]}`}>
                            {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 capitalize">
                          {session.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{formatDuration(session.duration)}</td>
                        <td className="px-6 py-4 text-slate-400">{formatRelativeDate(session.startTime)}</td>
                        {user.plan === 'pro' && (
                          <td className="px-6 py-4">
                            {session.pressureModeUsed ? (
                              <span className="px-2 py-1 bg-orange-900/50 text-orange-300 border border-orange-700 rounded text-xs font-medium">
                                Pressure
                              </span>
                            ) : (
                              <span className="text-slate-500 text-xs">Standard</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upgrade Prompt for Basic Users */}
          {user.plan === 'basic' && (
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">See Your Full History</h3>
                  <p className="text-slate-300 text-sm">Upgrade to Premium to view all your past sessions and track your progress over time.</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all whitespace-nowrap">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
