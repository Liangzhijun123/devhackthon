'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LastSessionSummary } from "@/components/dashboard/LastSessionSummary";
import { UpgradePrompt } from "@/components/dashboard/UpgradePrompt";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-8">
          {/* Dashboard Header with Streak and Plan Badge */}
          <DashboardHeader />

          {/* Quick Actions - Start Interview Button */}
          <QuickActions />

          {/* Upgrade Prompt for Basic Users */}
          {user.plan === 'basic' && <UpgradePrompt />}

          {/* Last Session Summary */}
          <LastSessionSummary />

          {/* Premium: Weekly Analytics */}
          {(user.plan === 'premium' || user.plan === 'pro') && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">This Week's Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400">Sessions Completed</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {user.plan === 'premium' ? '5' : '8'}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400">Average Rating</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {user.plan === 'premium' ? '3.8' : '4.2'}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400">Weakest Category</p>
                  <p className="text-lg font-semibold text-white mt-2">
                    {user.plan === 'premium' ? 'Dynamic Programming' : 'System Design'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pro: Interview Readiness Score */}
          {user.plan === 'pro' && (
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-700 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Interview Readiness</h2>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-5xl font-bold text-white">87</p>
                  <p className="text-sm text-slate-300 mt-1">Overall Score</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-slate-300">Streak Protection Active</span>
                  </div>
                  <p className="text-sm text-slate-400">Consistency: 92%</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Recent Activity</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Performance</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Consistency</p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
