'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AnalyticsPage() {
  const { user } = useAuth();

  if (!user) return null;

  // Basic users see upgrade prompt
  if (user.plan === 'basic') {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
            
            {/* Blurred Preview */}
            <div className="relative">
              <div className="filter blur-sm pointer-events-none select-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-sm text-slate-400">Sessions This Week</div>
                    <div className="text-4xl font-bold text-white mt-2">12</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-sm text-slate-400">Average Rating</div>
                    <div className="text-4xl font-bold text-white mt-2">4.2</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="text-sm text-slate-400">Completion Rate</div>
                    <div className="text-4xl font-bold text-white mt-2">87%</div>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 h-64"></div>
              </div>

              {/* Upgrade Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-900/95 border-2 border-blue-500 rounded-xl p-8 max-w-md text-center backdrop-blur-sm">
                  <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Unlock Analytics</h2>
                  <p className="text-slate-300 mb-6">
                    Upgrade to Premium to track your performance, identify weak areas, and see your progress over time.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  // Premium and Pro users see full analytics
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
            <p className="text-slate-400 mt-1">
              {user.plan === 'premium' ? 'Track your progress and performance' : 'Advanced insights and readiness metrics'}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Sessions This Week</div>
              <div className="text-3xl font-bold text-white mt-2">
                {user.plan === 'premium' ? '5' : '8'}
              </div>
              <div className="text-xs text-green-400 mt-1">+2 from last week</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Average Rating</div>
              <div className="text-3xl font-bold text-white mt-2">
                {user.plan === 'premium' ? '3.8' : '4.2'}
              </div>
              <div className="text-xs text-green-400 mt-1">+0.3 improvement</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Completion Rate</div>
              <div className="text-3xl font-bold text-white mt-2">
                {user.plan === 'premium' ? '82%' : '91%'}
              </div>
              <div className="text-xs text-slate-400 mt-1">Last 30 days</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-sm text-slate-400">Total Sessions</div>
              <div className="text-3xl font-bold text-white mt-2">
                {user.plan === 'premium' ? '23' : '47'}
              </div>
              <div className="text-xs text-slate-400 mt-1">All time</div>
            </div>
          </div>

          {/* Pro Only: Interview Readiness */}
          {user.plan === 'pro' && (
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-700 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">Interview Readiness Score</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-end gap-4 mb-6">
                    <div className="text-6xl font-bold text-white">87</div>
                    <div className="text-slate-300 mb-2">/ 100</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Recent Activity</span>
                        <span className="text-sm font-semibold text-white">90%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Performance</span>
                        <span className="text-sm font-semibold text-white">85%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Consistency</span>
                        <span className="text-sm font-semibold text-white">92%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3">Recommendations</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Great consistency! Keep up your daily practice.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Focus more on Dynamic Programming problems.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Try more Hard difficulty problems to challenge yourself.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Performance by Category */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">Performance by Category</h2>
            <div className="space-y-4">
              {[
                { name: 'Arrays', sessions: user.plan === 'premium' ? 8 : 15, rating: 4.2, color: 'blue' },
                { name: 'Strings', sessions: user.plan === 'premium' ? 6 : 12, rating: 3.8, color: 'green' },
                { name: 'Trees', sessions: user.plan === 'premium' ? 5 : 10, rating: 4.0, color: 'purple' },
                { name: 'Dynamic Programming', sessions: user.plan === 'premium' ? 3 : 7, rating: 3.2, color: 'orange', weakest: true },
                { name: 'Graphs', sessions: user.plan === 'premium' ? 1 : 3, rating: 3.5, color: 'pink' },
              ].map((category) => (
                <div key={category.name} className="flex items-center gap-4">
                  <div className="w-40 text-slate-300 font-medium">{category.name}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${category.color}-500`}
                          style={{ width: `${(category.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-right text-sm font-semibold text-white">
                        {category.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{category.sessions} sessions</div>
                  </div>
                  {category.weakest && (
                    <span className="px-2 py-1 bg-orange-900/50 text-orange-300 border border-orange-700 rounded text-xs font-medium">
                      Focus Area
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">Weekly Progress</h2>
            <div className="flex items-end justify-between h-64 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const height = user.plan === 'premium' 
                  ? [60, 40, 80, 50, 70, 30, 90][i]
                  : [70, 85, 90, 75, 95, 80, 100][i];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-700 rounded-t-lg relative group cursor-pointer hover:bg-blue-600 transition-colors" style={{ height: `${height}%` }}>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {Math.floor(height / 20)} sessions
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrade Prompt for Premium Users */}
          {user.plan === 'premium' && (
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Unlock Pro Features</h3>
                  <p className="text-slate-300 text-sm">Get Interview Readiness Score, Pressure Mode, and advanced insights with Pro.</p>
                </div>
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all whitespace-nowrap"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
